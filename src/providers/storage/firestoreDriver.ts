import {Injectable} from "@angular/core";
import {AngularFirestore} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";
import {AuthServiceProvider} from "../auth-service/auth-service";
import {Observer} from "rxjs/Observer";

export class UserCandidate {
  constructor(readonly userId: string,
              readonly email: string,
              readonly displayName: string,
              readonly lastRequestTime: number,
              readonly lastRequestTimeReadable: string) {
  }
}

export class Group {
  members: Set<string> = new Set<string>();

  constructor(readonly name: string,
              ...userIds: string[]) {
    userIds.forEach(uid => this.add(uid));
  }

  add(uid: string) {
    this.members.add(uid);
  }

  toJSON() {
    let obj: { [k: string]: any } = {};

    obj.name = this.name;
    obj.members = Array.from(this.members.values());

    return obj;
  }

  static fromObject(g: Group): Group {
    let group = new Group(g.name);
    group.members = new Set<string>(g.members);
    return group;
  }
}

export class UserProfile {

  friends: Friend[] = [];
  groups: Group[] = [];

  constructor(readonly userId: string,
              readonly email: string,
              readonly displayName: string,
              readonly createdAt: number,
              readonly createdAtReadable: string) {
  }

  static fromCandidate(candidate: UserCandidate) {
    return new UserProfile(candidate.userId,
                           candidate.email,
                           candidate.displayName,
                           Date.now(),
                           new Date().toUTCString());
  }

  static fromObject(p: UserProfile): UserProfile {
    let profile = new UserProfile(p.userId,
                                  p.email,
                                  p.displayName,
                                  p.createdAt,
                                  p.createdAtReadable);
    profile.friends = p.friends || [];
    profile.groups = [];
    if (p.groups) {
      p.groups.forEach(g => {
        profile.groups.push(Group.fromObject(g))
      });
    }
    return profile;
  }

  addOrUpdateGroup(_group: Group) {
    let map: Map<string, Group> = new Map<string, Group>();
    this.groups.forEach(g => map.set(g.name, g));

    map.set(_group.name, _group);

    this.groups = Array.from(map.values())
  }

  listGroups(): Group[] {
    let groups = Array.from(this.groups);
    groups.sort((a: Group, b: Group) => {
      return a.name.localeCompare(b.name)
    });
    return Array.from(groups.values());
  }

}

export class Friend {
  constructor(readonly userId: string,
              readonly createdAt: number) {
  }

  static fromUserProfile(user: UserProfile) {
    return new Friend(user.userId, Date.now());
  }
}

@Injectable()
export class FireStoreDriver {
  private readonly setOptions = {merge: true};
  private readonly col_user_candidates = "/user_candidates";
  private readonly col_users = "/user_profiles";

  constructor(private _database: AngularFirestore,
              private _auth: AuthServiceProvider) {
  }

  accept(candidate: UserCandidate): Promise<void> {
    console.log(candidate);
    let candidateDocRef = this._database
                              .collection(this.col_user_candidates)
                              .doc(candidate.userId).ref;
    let userDocRef = this._database
                         .collection(this.col_users)
                         .doc(candidate.userId).ref;

    let firestore = this._database.firestore;
    let retryCounter = 0;
    return firestore.runTransaction((tx) => {
      return tx.get(candidateDocRef)
               .then((candidateDoc) => {
                 retryCounter++;
                 if (retryCounter > 1) {
                   console.log("retry " + retryCounter);
                 }

                 if (!candidateDoc.exists) {
                   throw "Document does not exist";
                 } else {
                   let candidate = <UserCandidate>candidateDoc.data();
                   let userProfile = UserProfile.fromCandidate(candidate);
                   tx.set(userDocRef, FireStoreDriver.asObject(userProfile), this.setOptions)
                     .delete(candidateDocRef);
                 }
               })
               .catch((reason) => console.error(reason, candidateDocRef));
    });
  }

  candidateValueChanges(): Observable<UserCandidate[]> {
    return this._database.collection<UserCandidate>(this.col_user_candidates).valueChanges();
  }

  createUserCandidate(candidate: UserCandidate): Promise<void> {
    return this._database
               .collection(this.col_user_candidates)
               .doc(candidate.userId).ref
               .set(FireStoreDriver.asObject(candidate), this.setOptions)
               .then(_ => console.log("candidate inserted"))
               .catch((reason) => console.error(reason));
  }

  getProfileById(uid: string): Promise<UserProfile> {
    return this._users()
               .doc(uid)
               .ref
               .get()
               .then((snapshot) => Promise.resolve(<UserProfile>snapshot.data()))
               .catch(reason => Promise.reject(reason));
  }

  isApproved(uid: string): Promise<boolean> {
    return new Promise((fullfill, error) => {
      this._users()
          .doc(uid).ref
          .get()
          .then((snapShot) => fullfill(snapShot.exists))
          .catch((reason) => {
            console.error(reason);
            error(reason);
          });
    });
  }

  myProfileChanges() {
    return this._myProfile().valueChanges()
  }

  updateProfile(userProfile: UserProfile): Promise<void> {
    return this._users()
               .doc(userProfile.userId)
               .set(FireStoreDriver.asObject(userProfile), this.setOptions)
  }

  usersValueChanges(): Observable<UserProfile[]> {
    let observer = (observer: Observer<UserProfile[]>) => {
      this._users()
          .valueChanges()
          .takeUntil(this._auth.signedOut)
          .subscribe((dct: UserProfile[]) => {
            observer.next(dct.map((d: UserProfile) => UserProfile.fromObject(d)));
          });
    };
    return Observable.create(observer);
  }

  private _myProfile() {
    return this._users().doc(this._auth.uid);
  }


  private _users() {
    return this._database.collection<UserProfile>(this.col_users);
  }

  // see https://github.com/firebase/firebase-js-sdk/issues/311
  private static asObject(value: any): object {

    let obj = JSON.parse(JSON.stringify(value));
    console.debug("object", value, obj);
    return obj;
  }

  deny(candidate: UserCandidate): Promise<void> {
    return this._database
               .collection(this.col_user_candidates)
               .doc(candidate.userId)
               .delete()
               .then(_ => console.log("candidate removed"))
               .catch((reason) => console.error(reason));
  }
}

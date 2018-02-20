import {Injectable} from "@angular/core";
import {AngularFirestore} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";
import {AuthServiceProvider} from "./auth-service/auth-service";

export class UserCandidate {
  constructor(readonly userId: string,
              readonly email: string,
              readonly displayName: string,
              readonly lastRequestTime: number,
              readonly lastRequestTimeReadable: string) {
  }
}

export class UserProfile {
  friends: Friend[] = [];

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
export class UserStorage {
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
                   tx.set(userDocRef, UserStorage.asObject(userProfile), this.setOptions)
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
               .set(UserStorage.asObject(candidate), this.setOptions)
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
               .update(UserStorage.asObject(userProfile))
  }

  usersValueChanges(): Observable<UserProfile[]> {
    return this._users().valueChanges();
  }

  private _myProfile() {
    return this._users().doc(this._auth.uid);
  }


  private _users() {
    return this._database.collection<UserProfile>(this.col_users);
  }

  // see https://github.com/firebase/firebase-js-sdk/issues/311
  private static asObject(value: any): object {
    return JSON.parse(JSON.stringify(value));
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

@Injectable()
export class UserStore {

  constructor(private _auth: AuthServiceProvider,
              private _storage: UserStorage) {
  }

  acceptCandidate(candidate: UserCandidate): Promise<void> {
    return this._storage.accept(candidate);
  }

  denyCandidate(candidate: UserCandidate): Promise<void> {
    return this._storage.deny(candidate);
  }

  getFriends(friends: Friend[]): Promise<UserProfile[]> {
    if (!friends) {
      return Promise.resolve([]);
    }

    let promises: Promise<UserProfile>[] = [];
    let userIds = friends.map(f => f.userId);
    userIds.forEach(uid => promises.push(this.getProfileById(uid)));
    return Promise.all(promises)
                  .then(profiles => {
                    // filter friends which are removed as users
                    // to avoid undefined friends
                    return Promise.resolve(profiles.filter(f => f != undefined));
                  })
                  .catch(e => Promise.reject(e));
  }

  getProfileById(uid: string): Promise<UserProfile> {
    return this._storage.getProfileById(uid);
  }

  isApproved(): Promise<boolean> {
    return this._storage.isApproved(this._auth.uid);
  }

  requestApproval(): Promise<void> {
    let userCandidate = new UserCandidate(
      this._auth.uid,
      this._auth.email || "",
      this._auth.displayName || "",
      Date.now(),
      new Date().toISOString());

    return this._storage.createUserCandidate(userCandidate);
  }

  updateProfile(userProfile: UserProfile): Promise<void> {
    return this._storage.updateProfile(userProfile)
  }

  get changes(): Changes {
    return new Changes(this._storage);
  }

  get delete(): Deletes {
    return new Deletes(this._storage);
  }
}

class Changes {
  constructor(private readonly _storage: UserStorage) {
  }

  candidates(): Observable<UserCandidate[]> {
    return this._storage.candidateValueChanges();
  }

  myProfile() {
    return this._storage.myProfileChanges();
  }

  users(): Observable<UserProfile[]> {
    return this._storage.usersValueChanges();
  }
}

class Deletes {
  constructor(private readonly _storage: UserStorage) {
  }
}

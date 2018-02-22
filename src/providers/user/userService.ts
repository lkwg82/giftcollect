import {Injectable} from '@angular/core';
import {FireStoreDriver, Friend, UserCandidate, UserProfile} from "../storage/firestoreDriver";
import {AuthServiceProvider} from "../auth-service/auth-service";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class UserService {
  meO: Subject<UserProfile> = new Subject<UserProfile>();
  me: UserProfile = new UserProfile("x", "", "", 1, "");

  friendsO: Subject<UserProfile[]> = new Subject<UserProfile[]>();
  friends: UserProfile[] = [];

  otherUsersO: Subject<UserProfile[]> = new Subject<UserProfile[]>();
  otherUsers: UserProfile[] = [];


  constructor(private _auth: AuthServiceProvider,
              private _firestoreDriver: FireStoreDriver,
              private _storage: FireStoreDriver,) {
    console.log('Hello UserProvider Provider');

    this.changes
        .users()
        .takeUntil(this._auth.signedOut)
        .subscribe((profiles: UserProfile[]) => {
          let users: UserProfile[] = [];
          profiles.map(profile => {
            if (profile.userId == this._auth.uid) {
              this.me = profile;
              this.meO.next(profile);
            }
            else {
              users.push(profile);
            }
          });
          this.otherUsers = users;
          this.otherUsersO.next(users);
        });

    this.meO
        .takeUntil(this._auth.signedOut)
        .subscribe((myUserProfile: UserProfile) => {
          this.getFriends(myUserProfile.friends)
              .then(friends => {
                this.friends = friends;
                this.friendsO.next(friends)
              })
        });
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
    return this._firestoreDriver.updateProfile(userProfile)
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


  get changes(): Changes {
    return new Changes(this._storage);
  }

  get delete(): Deletes {
    return new Deletes(this._storage);
  }
}


class Changes {
  constructor(private readonly _storage: FireStoreDriver) {
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
  constructor(private readonly _storage: FireStoreDriver) {
  }
}

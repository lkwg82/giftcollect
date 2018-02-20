import {Injectable} from '@angular/core';
import {UserProfile, UserStore} from "../userstore";
import {AuthServiceProvider} from "../auth-service/auth-service";
import {Subject} from "rxjs/Subject";

@Injectable()
export class UserService {
  meO: Subject<UserProfile> = new Subject<UserProfile>();
  me: UserProfile = new UserProfile("x", "", "", 1, "");

  friendsO: Subject<UserProfile[]> = new Subject<UserProfile[]>();
  friends: UserProfile[] = [];

  otherUsersO: Subject<UserProfile[]> = new Subject<UserProfile[]>();
  otherUsers: UserProfile[] = [];

  constructor(private _userStore: UserStore,
              private _auth: AuthServiceProvider) {
    console.log('Hello UserProvider Provider');

    this._userStore
        .changes
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
          this._userStore
              .getFriends(myUserProfile.friends)
              .then(friends => {
                this.friends = friends;
                this.friendsO.next(friends)
              })
        });
  }
}

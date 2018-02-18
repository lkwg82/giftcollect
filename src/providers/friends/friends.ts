import {Injectable} from '@angular/core';
import {UserProfile, UserStore} from "../userstore";
import {AuthServiceProvider} from "../auth-service/auth-service";
import {Subject} from "rxjs/Subject";

@Injectable()
export class FriendsProvider {
  me: Subject<UserProfile> = new Subject<UserProfile>();
  friends: Subject<UserProfile[]> = new Subject<UserProfile[]>();

  constructor(private _userStore: UserStore,
              private _auth: AuthServiceProvider) {
    console.log('Hello FriendsProvider Provider');

    this._userStore
        .changes.myProfile()
        .takeUntil(this._auth.signedOut)
        .subscribe((myUserProfile: UserProfile) => this.me.next(myUserProfile));

    this.me
        .takeUntil(this._auth.signedOut)
        .subscribe((myUserProfile: UserProfile) => {
          this._userStore
              .getFriends(myUserProfile.friends)
              .then(friends => this.friends.next(friends))
        });
  }
}

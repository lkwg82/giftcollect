import {Component} from '@angular/core';
import {Friend, UserProfile, UserStore} from "../../providers/userstore";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";

@Component({
             selector: 'page-users',
             templateUrl: 'users.html',
           })
export class UsersPage {
  users: UserProfile[] = [];
  me: UserProfile;

  constructor(private _userStore: UserStore,
              private _auth: AuthServiceProvider) {
  }

  ionViewDidLoad() {
    console.log("loaded UsersPage");
    this._userStore
        .usersValueChanges()
        .takeUntil(this._auth.signedOut)
        .subscribe((userProfiles) => {
          console.log(userProfiles)
          this.me = userProfiles.filter(p => p.userId == this._auth.uid)[0];
          this.users = userProfiles;
        });
  }

  addAsFriend(user: UserProfile) {
    this._userStore
        .addAsFriend(Friend.fromUserProfile(user))
        .then(() => {
          console.log("as friend added");
        })
        .catch((reason) => console.error(reason));
  }

  areFriends(user: UserProfile): boolean {
    let friends = this.me.friends;
    if (friends) {
      return friends.map(f => f.userId == user.userId).length == 1
    }
    return false;
  }
}

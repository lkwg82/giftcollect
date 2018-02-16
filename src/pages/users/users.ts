import {Component} from '@angular/core';
import {Friend, UserProfile, UserStore} from "../../providers/userstore";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {Subscription} from "rxjs/Subscription";

@Component({
             selector: 'page-users',
             templateUrl: 'users.html',
           })
export class UsersPage {
  users: UserProfile[] = [];
  me: UserProfile;

  private usersSubscription: Subscription;

  constructor(private _userStore: UserStore,
              private _auth: AuthServiceProvider) {
  }

  ionViewDidLoad() {
    console.log("loaded UsersPage");
    this.usersSubscription = this._userStore
                                 .usersValueChanges()
                                 .takeUntil(this._auth.signedOut)
                                 .subscribe((userProfiles) => {
                                   console.log(userProfiles)
                                   this.me = userProfiles.filter(p => p.userId == this._auth.uid)[0];
                                   this.users = userProfiles;
                                 });
  }

  ionViewWillLeave() {
    this.usersSubscription.unsubscribe();
  }

  addAsFriend(user: UserProfile) {
    if (!this.me.friends) {
      this.me.friends = [];
    }
    this.me.friends.push(Friend.fromUserProfile(user));
    this._userStore
        .updateProfile(this.me)
        .then(() => {
          console.log("as friend added");
        })
        .catch(e => console.error(e));
  }

  areFriends(user: UserProfile): boolean {
    let friends = this.me.friends;
    if (friends) {
      return friends.map(f => f.userId == user.userId).length == 1
    }
    return false;
  }
}

import {Component} from '@angular/core';
import {Friend, UserProfile, UserStore} from "../../providers/userstore";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {Subscription} from "rxjs/Subscription";
import {UserService} from "../../providers/user/userService";

@Component({
             selector: 'page-users',
             templateUrl: 'users.html',
           })
export class UsersPage {
  users: UserProfile[] = [];
  me: UserProfile = new UserProfile("x", "", "", 1, "");

  private usersSubscription: Subscription;

  constructor(private _userStore: UserStore,
              private _auth: AuthServiceProvider,
              private _userService: UserService) {
  }

  ionViewDidLoad() {
    console.log("loaded UsersPage");
    this._userService.me.subscribe(me => this.me = me);
    this._userService.friends.subscribe(friends => this.users = friends);
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
    console.dir(user);
    let friends = this.me.friends;
    if (friends) {
      return friends.map(f => f.userId == user.userId).length == 1
    }
    return false;
  }
}

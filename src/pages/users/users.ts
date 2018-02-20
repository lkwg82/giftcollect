import {Component} from '@angular/core';
import {Friend, UserProfile, UserStore} from "../../providers/userstore";
import {UserService} from "../../providers/user/userService";

@Component({
             selector: 'page-users',
             templateUrl: 'users.html',
           })
export class UsersPage {
  otherUsers: UserProfile[] = [];
  me: UserProfile = new UserProfile("x", "", "", 1, "");

  constructor(private _userStore: UserStore,
              private _userService: UserService) {

    this.me = this._userService.me;
    this.otherUsers = this._userService.otherUsers;
  }

  ionViewDidLoad() {
    console.log("loaded UsersPage");
    this._userService.meO
        .subscribe(me => this.me = me);
    this._userService.otherUsersO
        .subscribe(otherUsers => this.otherUsers = otherUsers);
  }

  addAsFriend(user: UserProfile) {
    if (!user) {
      console.error("user undefined");
      return false;
    }

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

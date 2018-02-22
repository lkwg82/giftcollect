import {Component} from '@angular/core';
import {Friend, UserProfile, UserStore} from "../../providers/userstore";
import {UserService} from "../../providers/user/userService";
import {NavController} from "ionic-angular";
import {FriendsGroupCreatePage} from "../friends-group-create/friends-group-create";

@Component({
             selector: 'page-friends',
             templateUrl: 'friends.html',
           })
export class FriendsPage {
  friends: UserProfile[] = [];
  me: UserProfile;

  constructor(private _userStore: UserStore,
              private _userService: UserService,
              private _navCtrl: NavController) {
    this.me = this._userService.me;
    this.friends = this._userService.friends;
  }

  ionViewWillEnter() {
    console.log("loaded FriendsPage");
    this._userService.friendsO
        .subscribe(friends => this.friends = friends);
    this._userService.meO
        .subscribe(profile => this.me = profile);
  }

  finishFriendship(friend: Friend) {
    this.me.friends = this.me.friends.filter(f => f == friend);
    this._userStore
        .updateProfile(this.me)
        .then(() => {
          console.log("updated profile", this.me);
        })
        .catch(e => console.error(e));
  }

  createGroup() {
    this._navCtrl.push(FriendsGroupCreatePage)
  }
}

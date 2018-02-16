import {Component} from '@angular/core';
import {Friend, UserProfile, UserStore} from "../../providers/userstore";
import {CurrentUser} from "../../providers/user/CurrentUser";

/**
 * Generated class for the FriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
             selector: 'page-friends',
             templateUrl: 'friends.html',
           })
export class FriendsPage {
  friends: UserProfile[] = [];
  me: UserProfile;
  count: number = 0;

  constructor(private _userStore: UserStore,
              private _currentUser: CurrentUser) {
  }

  ionViewWillEnter() {
    console.log("loaded FriendsPage");
    this.updateFriends();
  }

  private updateFriends() {
    this._currentUser.getProfile().then(profile => {
      this.me = profile;
      this._userStore.getFriends(profile.friends).then(userProfiles => {
        this.friends = userProfiles;
        this.count = userProfiles.length;
      })
    });
  }

  finishFriendship(friend: Friend) {
    this.me.friends = this.me.friends.filter(f => f == friend);
    this._userStore
        .updateProfile(this.me)
        .then(() => {
          console.log("updated profile", this.me);
          this.updateFriends();
        })
        .catch(e => console.error(e));
  }
}

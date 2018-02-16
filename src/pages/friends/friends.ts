import {Component} from '@angular/core';
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {UserProfile, UserStore} from "../../providers/userstore";
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
              private _auth: AuthServiceProvider,
              private _currentUser: CurrentUser) {
  }

  ionViewDidLoad() {
    console.log("loaded FriendsPage");
    this._currentUser.getProfile().then(profile => {
      this.me = profile;
      this._userStore.getFriends(profile.friends).then(userProfiles => {
        this.friends = userProfiles;
      })
    });
  }
}

import {Component} from '@angular/core';
import {Friend, UserProfile, UserStore} from "../../providers/userstore";
import {UserService} from "../../providers/user/userService";
import {Subject} from "rxjs/Subject";

@Component({
             selector: 'page-friends',
             templateUrl: 'friends.html',
           })
export class FriendsPage {
  friends: UserProfile[] = [];
  me: UserProfile;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _userStore: UserStore,
              private _userService: UserService) {
  }

  ionViewWillEnter() {
    console.log("loaded FriendsPage");
    this._userService.friends
        .takeUntil(this.destroy$)
        .subscribe(friends => this.friends = friends)
    this._userService.me
        .takeUntil(this.destroy$)
        .subscribe(profile => this.me = profile);
  }

  ionViewWillLeave() {
    this.destroy$.next(true);
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
}

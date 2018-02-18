import {Component} from '@angular/core';
import {Friend, UserProfile, UserStore} from "../../providers/userstore";
import {FriendsProvider} from "../../providers/friends/friends";
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
              private _friendsProvider: FriendsProvider) {
    _friendsProvider.friends
                    .takeUntil(this.destroy$)
                    .subscribe(friends => this.friends = friends)
    _friendsProvider.me
                    .takeUntil(this.destroy$)
                    .subscribe(profile => this.me = profile);
  }

  ionViewWillEnter() {
    console.log("loaded FriendsPage");
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

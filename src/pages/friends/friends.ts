import {Component} from '@angular/core';
import {Friend, Group, UserProfile} from "../../providers/storage/firestoreDriver";
import {UserService} from "../../providers/user/userService";
import {NavController} from "ionic-angular";
import {FriendsGroupPage} from "../friends-group/friends-group";
import {Subject} from "rxjs/Subject";

@Component({
             selector: 'page-friends',
             templateUrl: 'friends.html',
           })
export class FriendsPage {
  friends: UserProfile[] = [];
  me: UserProfile;

  private stop$ = new Subject<void>();

  constructor(private _userService: UserService,
              private _navCtrl: NavController) {
    this.me = this._userService.me;
    this.friends = this._userService.friends;
  }

  ionViewWillEnter() {
    console.log("loaded FriendsPage");

    this.friends = this._userService.friends;
    this._userService.friendsO
        .takeUntil(this.stop$)
        .subscribe(friends => this.friends = friends);
    this.me = this._userService.me;
    this._userService.meO
        .takeUntil(this.stop$)
        .subscribe(profile => this.me = profile);
  }

  ionViewDidLeave() {
    this.stop$.complete();
  }

  finishFriendship(friend: Friend) {
    this.me.friends = this.me.friends.filter(f => f == friend);
    this._userService
        .updateProfile(this.me)
        .then(() => {
          console.log("updated profile", this.me);
        })
        .catch(e => console.error(e));
  }

  createGroup() {
    this._navCtrl.push(FriendsGroupPage)
  }

  name(uid: string): string {
    let found = this.friends.find((friend, _) => friend.userId === uid);
    if (found) {
      return found.displayName;
    }
    return "??";
  }

  editGroup(group: Group) {
    this._navCtrl.push(FriendsGroupPage, {"group": group})
  }
}

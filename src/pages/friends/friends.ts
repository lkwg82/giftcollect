import {Component} from '@angular/core';
import {Group, UserProfile} from "../../providers/storage/firestoreDriver";
import {UserService} from "../../providers/user/userService";
import {AlertController, NavController} from "ionic-angular";
import {FriendsGroupPage} from "../friends-group/friends-group";
import {Subject} from "rxjs/Subject";
import {NoticeController} from "../../providers/view/notice/NoticeController";

@Component({
             selector: 'page-friends',
             templateUrl: 'friends.html',
           })
export class FriendsPage {
  friends: UserProfile[] = [];
  me: UserProfile;

  private stop$ = new Subject<void>();

  constructor(private _userService: UserService,
              private _navCtrl: NavController,
              private _alertCtrl: AlertController,
              private _noticeCtrl: NoticeController,) {
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

  finishFriendship(friend: UserProfile) {

    this._alertCtrl.create({
                             title: 'Freundschaft beenden',
                             message: 'Möchtest du die Freundschaft mit "' + friend.displayName + '" beenden?',
                             buttons: [
                               {
                                 text: 'Abbrechen',
                                 role: 'cancel',
                                 handler: () => {
                                   console.log('Cancel clicked');
                                 }
                               },
                               {
                                 text: 'Beenden',
                                 handler: () => {
                                   this.me.friends = this.me.friends.filter(f => f == friend);
                                   this._userService
                                       .updateProfile(this.me)
                                       .then(() => this._noticeCtrl.notice("Freundschaft beendet"))
                                       .catch(e => console.error(e));
                                 }
                               }
                             ]
                           }).present();
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

import {Component} from '@angular/core';
import {AlertController, NavController} from "ionic-angular";
import {UserService} from "../../providers/user/userService";
import {UserProfile} from "../../providers/userstore";
import {FriendsGroupCreateStep2Page} from "../friends-group-create-step2/friends-group-create-step2";
import {NoticeController} from "../../providers/view/notice/NoticeController";

@Component({
             selector: 'page-friends-group-create',
             templateUrl: 'friends-group-create.html',
           })
export class FriendsGroupCreatePage {
  friends: SelectableUserProfile[] = [];
  me: UserProfile;

  selectedUsers: UserProfile[] = [];

  constructor(private _userService: UserService,
              private _navCtrl: NavController,
              private alertCtrl: AlertController,
              private _noticeCtrl: NoticeController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsGroupCreatePage');
    this.friends = this._userService.friends.map(f => new SelectableUserProfile(f));
    this._userService.friendsO
        .subscribe(friends => this.friends = friends.map(f => new SelectableUserProfile(f)));
    this._userService.meO
        .subscribe(profile => this.me = profile);
  }

  add(user: SelectableUserProfile) {
    user.selected = true;

    let without = this.selectedUsers.filter(u => u != user);
    if (without.length == this.selectedUsers.length) {
      this.selectedUsers.push(user);
    }
  }

  remove(user: SelectableUserProfile) {
    user.selected = false;
    this.selectedUsers = this.selectedUsers.filter(u => u != user);
  }

  next() {
    if (this.selectedUsers.length == 0) {
      this._noticeCtrl.notice('mindestens ein Kontakt muss ausgewählt werden')
    } else {
      this._navCtrl.push(FriendsGroupCreateStep2Page, {'selectedUsers': this.selectedUsers});
    }
  }
}

class SelectableUserProfile extends UserProfile {
  selected: boolean = false;

  constructor(user: UserProfile) {
    super(user.userId,
          user.email,
          user.displayName,
          user.createdAt,
          user.createdAtReadable)
  }
}

import {Component} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {UserProfile} from "../../providers/storage/firestoreDriver";
import {UserService} from "../../providers/user/userService";
import {HomePage} from "../home/home";
import {NoticeController} from "../../providers/view/notice/NoticeController";

@Component({
             selector: 'page-friends-group-create-step2',
             templateUrl: 'friends-group-create-step2.html',
           })
export class FriendsGroupCreateStep2Page {
  title: string = "";
  selectedUsers: UserProfile[] = [];
  me: UserProfile;

  constructor(private _navCtrl: NavController,
              public navParams: NavParams,
              private _userService: UserService,
              private _noticeCtrl: NoticeController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsGroupCreateStep2Page');

    this.selectedUsers = this.navParams.get("selectedUsers");

    this.me = this._userService.me;
    this._userService.meO
        .subscribe(profile => this.me = profile);
  }

  saveGroup() {
    if (!this.title || this.title === "") {
      this._noticeCtrl.notice('Titel darf nicht leer bleiben');
    }
    else {
      this.selectedUsers
          .map(f => f.userId)
          .forEach(uid => this.me.groups.add(this.title, uid));
      this._userService
          .updateProfile(this.me)
          .then(() => {
            this._noticeCtrl
                .notice("Gruppe '" + this.title + "' angelegt")
                .then(() => this._navCtrl.setRoot(HomePage));
          })
          .catch((e) => console.error(e))
    }
  }
}

import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from "ionic-angular";
import {UserProfile} from "../../providers/userstore";
import {UserService} from "../../providers/user/userService";
import {HomePage} from "../home/home";

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
              private _alertCtrl: AlertController) {
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
      let alert = this._alertCtrl.create({
                                           subTitle: 'Titel darf nicht leer bleiben',
                                         });
      alert.present().then(() => setTimeout(() => alert.dismiss(), 500));
    }
    else {
      this.selectedUsers
          .map(f => f.userId)
          .forEach(uid => this.me.groups.add(this.title, uid));
      this._userService
          .updateProfile(this.me)
          .then(() => {
            let alert = this._alertCtrl.create({
                                                 title: "Gruppe '" + this.title + "' angelegt",
                                               });
            alert.present()
                 .then(() => {
                   setTimeout(() => {
                     alert.dismiss();
                     this._navCtrl.setRoot(HomePage);
                   }, 500)
                 });
          })
          .catch((e) => console.error(e))
    }
  }
}

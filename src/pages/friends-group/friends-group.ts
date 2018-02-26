import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from "ionic-angular";
import {UserService} from "../../providers/user/userService";
import {Group, UserProfile} from "../../providers/storage/firestoreDriver";
import {NoticeController} from "../../providers/view/notice/NoticeController";
import {GiftListPage} from "../gift-list/gift-list";
import {Subject} from "rxjs/Subject";

@Component({
             selector: 'page-friends-group',
             templateUrl: 'friends-group.html',
           })
export class FriendsGroupPage {
  private stop$ = new Subject<void>();

  changing: boolean = false;
  friends: SelectableUserProfile[] = [];
  group: Group = new Group("");
  me: UserProfile;
  selectedUsers: Set<UserProfile> = new Set<UserProfile>();

  constructor(private _userService: UserService,
              private _navCtrl: NavController,
              private _navParams: NavParams,
              private _noticeCtrl: NoticeController,
              private _alertCtrl: AlertController,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsGroupPage');

    if (this._navParams.data.hasOwnProperty("group")) {
      this.group = this._navParams.get("group") as Group;
      this.changing = true;
    }

    this.mapFriends(this._userService.friends);
    this.me = this._userService.me;
    this._userService.meO
        .takeUntil(this.stop$)
        .subscribe(profile => this.me = profile);
  }

  ionViewDidLeave() {
    this.stop$.complete();
  }

  private mapFriends(friends: UserProfile[]) {

    this.friends = friends.map(f => new SelectableUserProfile(f));
    this.group.members.forEach((uid: string) => this.friends.forEach(f => {
                                 if (f.userId == uid) {
                                   this.selectedUsers.add(f);
                                   f.selected = true;
                                 }
                               })
    );
  }

  select(user: SelectableUserProfile) {
    user.selected = true;
    this.selectedUsers.add(user);
  }

  unselect(user: SelectableUserProfile) {
    user.selected = false;
    this.selectedUsers.delete(user);
  }

  next() {
    if (this.selectedUsers.size == 0) {
      this._noticeCtrl.notice('mindestens ein Kontakt muss ausgewählt werden')
    } else {
      let params = {
        'group': this.group,
        'selectedUsers': this.selectedUsers,
      };
      this._navCtrl.push(FriendsGroupStep2Page, params);
    }
  }

  delete(group: Group) {
    this._alertCtrl.create({
                             title: 'Gruppe entfernen',
                             message: 'Möchtest du die Gruppe "' + this.group.name + '" entfernen?',
                             buttons: [
                               {
                                 text: 'Abbrechen',
                                 role: 'cancel',
                                 handler: () => {
                                   console.log('Cancel clicked');
                                 }
                               },
                               {
                                 text: 'Löschen',
                                 handler: () => {
                                   this.me.removeGroup(this.group);
                                   this._userService
                                       .updateProfile(this.me)
                                       .then(() => {
                                         this._noticeCtrl.notice("Gruppe '" + this.group.name + "' entfernt")
                                         this._navCtrl.pop();
                                       })
                                       .catch((e) => console.error(e))
                                 }
                               }
                             ]
                           }).present();

  }
}


@Component({
             selector: 'page-friends-group-step2',
             templateUrl: 'friends-group-step2.html',
           })
export class FriendsGroupStep2Page {
  private stop$ = new Subject<void>();

  changing: boolean = false;
  group: Group = new Group("");
  me: UserProfile;
  selectedUsers: Set<UserProfile> = new Set<UserProfile>();

  constructor(private _navCtrl: NavController,
              public navParams: NavParams,
              private _userService: UserService,
              private _noticeCtrl: NoticeController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsGroupCreateStep2Page');

    this.group = this.navParams.get("group") as Group;
    this.selectedUsers = this.navParams.get("selectedUsers");

    this.changing = this.group.name !== "";

    this.me = this._userService.me;
    this._userService.meO
        .takeUntil(this.stop$)
        .subscribe(profile => this.me = profile);
  }

  ionViewDidLeave() {
    this.stop$.complete();
  }

  saveGroup() {
    if (this.group.name === "") {
      this._noticeCtrl.notice('Name darf nicht leer bleiben');
    }
    else {
      this.selectedUsers.forEach(u => this.group.add(u.userId));
      this.me.addOrUpdateGroup(this.group);
      this._userService
          .updateProfile(this.me)
          .then(() => {
            if (this.changing) {
              this._noticeCtrl.notice("Gruppe '" + this.group.name + "' aktualisiert")
            } else {
              this._noticeCtrl.notice("Gruppe '" + this.group.name + "' angelegt");
            }
            this._navCtrl.setRoot(GiftListPage);
          })
          .catch((e) => console.error(e))
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

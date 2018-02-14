import {Component} from '@angular/core';
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import * as firebase from 'firebase/app';
import {GiftStore} from "../../providers/giftstore";
import {NavController} from "ionic-angular";
import {GiftPage} from "../gift/gift";
import {Gift} from "../../app/domain/gift";
import {UserStore} from "../../providers/userstore";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  username: string;
  gifts: Gift[] = [];
  userApproved: boolean;
  initialized: boolean;

  constructor(private _auth: AuthServiceProvider,
              public giftStore: GiftStore,
              private userStore: UserStore,
              private _navCtr: NavController) {
  }

  ionViewDidLoad() {
    console.log("homepage loaded")
    let authState = this._auth.afAuth.authState;
    authState.subscribe((user: firebase.User) => {
      console.log("user ", user);
      if (user) {
        if (user.displayName) {
          this.username = user.displayName;
        }

        this.userStore.isApproved().then(approved => {
          if (approved) {
            this.userApproved = true;
            console.log("approved");
            this.giftStore.list().subscribe((gifts) => this.gifts = gifts)
          } else {
            console.log("not approved");
          }
          this.initialized = true;
        }).catch(error => console.error(error));
      }
    });
  }

  ionViewWillEnter() {
    if (this.userApproved) {
      this.giftStore.list().subscribe((gifts) => this.gifts = gifts);
    }
  }

  addGift() {
    this._navCtr.push(GiftPage);
  }

  itemSelected(gift: Gift) {
    this._navCtr.push(GiftPage, {"gift": gift})
  }
}

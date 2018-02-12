import {Component} from '@angular/core';
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import * as firebase from 'firebase/app';
import {GiftStore} from "../../providers/giftstore";
import {NavController} from "ionic-angular";
import {GiftPage} from "../gift/gift";
import {Gift} from "../../app/domain/gift";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  username;
  gifts: Gift[] = [];

  constructor(private _auth: AuthServiceProvider,
              public giftStore: GiftStore,
              private _navCtr: NavController) {
    let authState = this._auth.afAuth.authState;
    authState.subscribe((user: firebase.User) => {
      if (user) {
        this.username = user.displayName;
      }
    });
  }

  ionViewDidLoad() {
    console.log("homepage loaded")
    this.gifts = this.giftStore.list();
  }

  addGift() {
    this._navCtr.push(GiftPage);
  }

  itemSelected(gift: Gift) {
    this._navCtr.push(GiftPage, {"gift": gift})
  }
}

import {Component} from '@angular/core';
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import * as firebase from 'firebase/app';
import {GiftStore} from "../../providers/giftstore";
import {NavController} from "ionic-angular";
import {NewGiftPage} from "../new-gift/new-gift";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  username;

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

  addGift() {
    this._navCtr.push(NewGiftPage);
  }
}

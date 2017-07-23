import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import * as firebase from 'firebase/app';

import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {HomePage} from "../home/home";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, private _auth: AuthServiceProvider) {
    let authState = this._auth.afAuth.authState;
    authState.subscribe((user: firebase.User) => {
      if (user) {
        navCtrl.setRoot(HomePage);
        return;
      }
    });
  }

  signInWithGoogle(): void {
    this._auth.signInWithGoogle();
  }
}

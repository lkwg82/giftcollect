import {Component} from '@angular/core';
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {AlertController, NavController} from "ionic-angular";
import * as firebase from 'firebase/app';

import {AboutPage} from "../about/about";
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  aboutPage = AboutPage;
  username;

  constructor(private _auth: AuthServiceProvider,
              private alertCtrl: AlertController,
              public navCtrl: NavController) {
    let authState = this._auth.afAuth.authState;
    authState.subscribe((user: firebase.User) => {
      if (user) {
        this.username = user.displayName;
        return;
      }
      navCtrl.setRoot(LoginPage);
    });
  }

  signOut(): void {
    this._auth.signOut();
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Low battery',
      subTitle: '10% of battery remaining',
      buttons: ['Dismiss']
    });
    alert.present();
  }
}

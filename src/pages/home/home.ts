import {Component} from '@angular/core';
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {AlertController} from "ionic-angular";
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  username;

  constructor(private _auth: AuthServiceProvider,
              private alertCtrl: AlertController) {
    let authState = this._auth.afAuth.authState;
    authState.subscribe((user: firebase.User) => {
      if (!user) {
        this.username = 'anon';
        return;
      }
      this.username = user.displayName;
    });
  }

  signInWithGoogle(): void {
    this._auth.signInWithGoogle()
      .then(() => this.onSignInSuccess());
  }

  signOut(): void {
    this._auth.signOut();
  }

  isLoggedIn(): boolean {
    return this._auth.authenticated;
  }

  private onSignInSuccess(): void {
    console.log("Google display name ", this._auth);
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

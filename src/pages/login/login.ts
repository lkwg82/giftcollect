import {Component} from '@angular/core';
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {AlertController} from "ionic-angular";

@Component({
             selector: 'page-login',
             templateUrl: 'login.html',
           })
export class LoginPage {
  loading: boolean = false;

  constructor(private _auth: AuthServiceProvider,
              private alertCtrl: AlertController) {
  }

  signInWithGoogle(): void {
    this.loading = true;
    this._auth.signInWithGoogle().catch((e) => {
      this.alertCtrl.create({
                              title: 'Fehler',
                              message: e,
                              buttons: [
                                {
                                  text: 'Abbrechen',
                                  role: 'cancel',
                                  handler: () => {
                                    console.log('Cancel clicked');
                                  }
                                }
                              ]
                            }).present();
      console.error(e);
      this.loading = false;
    });
  }
}

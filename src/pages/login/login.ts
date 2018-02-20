import {Component} from '@angular/core';
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {ModalController} from "ionic-angular";
import {HintComponent} from "../../components/hint/hint";

@Component({
             selector: 'page-login',
             templateUrl: 'login.html',
           })
export class LoginPage {
  loading: boolean = false;

  constructor(private _auth: AuthServiceProvider,
              private modalCtrl: ModalController) {
  }

  signInWithGoogle(): void {
    this.loading = true;
    this._auth.signInWithGoogle().catch((e) => {
      this.modalCtrl.create(HintComponent, {"hint": e}).present();
      console.error(e);
      this.loading = false;
    });
  }
}

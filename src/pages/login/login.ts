import {Component} from '@angular/core';

import {AuthServiceProvider} from "../../providers/auth-service/auth-service";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(private _auth: AuthServiceProvider) {
  }

  signInWithGoogle(): void {
    this._auth.signInWithGoogle();
  }
}

import {Component} from '@angular/core';
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";

@Component({
             selector: 'page-login',
             templateUrl: 'login.html',
           })
export class LoginPage {
  loading: boolean = false;

  constructor(private _auth: AuthServiceProvider) {
  }

  signInWithGoogle(): void {
    this.loading = true;
    this._auth.signInWithGoogle().catch((e) => {
      console.error(e);
      this.loading = false;
    });
  }
}

import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

import {AngularFireAuth} from 'angularfire2/auth';
// Do not import from 'firebase' as you'll lose the tree shaking benefits
import * as firebase from 'firebase/app';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

@Injectable()
export class AuthServiceProvider {
  private _user: firebase.User;
  state: Observable<firebase.User | null>;
  readonly signedOut: Subject<void> = new Subject<void>();

  constructor(private afAuth: AngularFireAuth) {
    this.state = afAuth.authState;
    this.state.subscribe((user: firebase.User) => {
      console.log("user", user);
      this._user = user;
    });

    this.state
        .subscribe((user: firebase.User) => {
          if (user == null) {
            console.log("signal signout:");
            this.signedOut.next();
          }
        });
  }

  signInWithGoogle(): Promise<void> {
    let authProvider = new firebase.auth.GoogleAuthProvider();
    // https://developers.google.com/identity/protocols/OpenIDConnect#authenticationuriparameters
    authProvider.setCustomParameters({'prompt': 'select_account',});

    let auth = this.afAuth.auth;

    return auth.signInWithPopup(authProvider).then((result) => {
      // this.additionalUserInfo = result.additionalUserInfo
    }).catch(function (error) {
      console.error(error);
    });
  }

  get uid(): string {
    return this._user.uid
  }

  get email(): string {
    return this._user.email || "not set";
  }

  get displayName(): string {
    return this._user.displayName || "not set";
  }

  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }
}

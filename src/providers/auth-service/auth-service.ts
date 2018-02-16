import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

import {AngularFireAuth} from 'angularfire2/auth';
// Do not import from 'firebase' as you'll lose the tree shaking benefits
import * as firebase from 'firebase/app';
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";

@Injectable()
export class AuthServiceProvider {
  private _user: firebase.User;
  state: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.state = afAuth.authState;
    this.state.subscribe((user: firebase.User) => {
      console.log("user", user);
      this._user = user;
    });
  }

  signInWithGoogle(): Promise<void> {
    let authProvider = new firebase.auth.GoogleAuthProvider();
    // https://developers.google.com/identity/protocols/OpenIDConnect#authenticationuriparameters
    authProvider.setCustomParameters({'prompt': 'select_account',});

    // let authServiceProvider = this;
    let auth = this.afAuth.auth;

    return auth.signInWithRedirect(authProvider).then((result) => {
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

  get signedOut(): Observable<void> {
    return Observable.create((observer: Observer<void>) => {
      this.state
          .subscribe((user: firebase.User) => {
            if (user == null) {
              observer.complete();
            }
          });
    });
  }

  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }
}

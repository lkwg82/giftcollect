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
      console.debug("user", user);
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

    return auth.signInWithRedirect(authProvider)
               .then(() => firebase.auth().getRedirectResult())
               .then(result => {
                 // This gives you a Google Access Token.
                 // You can use it to access the Google API.
                 let token = result.credential.accessToken;
                 // The signed-in user info.
                 let user = result.user;
                 console.log("auth ok", result)
               })
               .catch(function (error) {
                 // Handle Errors here.
                 let errorCode = error.code;
                 let errorMessage = error.message;
                 console.error("error " + errorCode + ":" + errorMessage)
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

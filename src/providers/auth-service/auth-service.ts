import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

import {AngularFireAuth} from 'angularfire2/auth';
// Do not import from 'firebase' as you'll lose the tree shaking benefits
import * as firebase from 'firebase/app';

@Injectable()
export class AuthServiceProvider {
  private currentUser: firebase.User;

  constructor(public afAuth: AngularFireAuth) {
    afAuth.authState.subscribe((user: firebase.User) => {
      console.log("currentUser", user);
      this.currentUser = user;
    });
  }

  get uid(): string {
    return this.currentUser.uid
  }

  get email(): string {
    return this.currentUser.email || "not set";
  }

  signInWithGoogle(): Promise<void> {
    let authProvider = new firebase.auth.GoogleAuthProvider();
    // https://developers.google.com/identity/protocols/OpenIDConnect#authenticationuriparameters
    authProvider.setCustomParameters({
      'prompt': 'select_account',
    });

    // let authServiceProvider = this;
    let auth = this.afAuth.auth;

    return auth.signInWithRedirect(authProvider).then((result) => {
      // this.additionalUserInfo = result.additionalUserInfo
    }).catch(function (error) {
      console.error(error);
    });
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }

  get displayName(): string {
    return this.currentUser.displayName || "not set";
  }
}

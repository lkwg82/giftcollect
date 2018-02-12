import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

import {AngularFireAuth} from 'angularfire2/auth';
// Do not import from 'firebase' as you'll lose the tree shaking benefits
import * as firebase from 'firebase/app';
import {UserInfo} from 'firebase/app';

@Injectable()
export class AuthServiceProvider {
  private currentUser: firebase.User;

  constructor(public afAuth: AngularFireAuth) {
    console.log("huch");
    let authState = afAuth.authState;
    let _this = this;
    authState.subscribe((user: firebase.User) => {
      console.log("currentUser", user);
      _this.currentUser = user
    });
  }

  get authenticated(): boolean {
    return this.currentUser !== undefined;
  }

  get userId(): string {
    console.log("user?", this.currentUser);
    if (!this.authenticated) {
      return "";
    }
    else {
      let providerData = this.currentUser.providerData;
      if (providerData != null && providerData.length > 0) {
        let userInfo: UserInfo = providerData[0];
        return userInfo.providerId + "-" + userInfo.uid;
      }
      else {
        return "";
      }
    }
  }

  signInWithGoogle(): Promise<void> {
    let authProvider = new firebase.auth.GoogleAuthProvider();
    // https://developers.google.com/identity/protocols/OpenIDConnect#authenticationuriparameters
    authProvider.setCustomParameters({
      'prompt': 'select_account',
    });

    // let authServiceProvider = this;
    let auth = this.afAuth.auth;

    return auth.signInWithPopup(authProvider).then(function (result) {
      // authServiceProvider.additionalUserInfo = result.additionalUserInfo
    }).catch(function (error) {
      console.error(error);
    });
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }

  displayName(): string {
    if (this.currentUser !== null) {
      return this.currentUser.displayName;
    } else {
      return '';
    }
  }

}

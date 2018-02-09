import {Component, ViewChild} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import * as firebase from 'firebase/app';
import {AuthServiceProvider} from "../providers/auth-service/auth-service";
import {NewGiftPage} from "../pages/new-gift/new-gift";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('mycontent') nav: NavController;
  rootPage: any = NewGiftPage;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private _auth: AuthServiceProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // TODO
      // statusBar.styleDefault();
      // splashScreen.hide();
    });
  }

  // Wait for the components in MyApp's template to be initialized
  // In this case, we are waiting for the Nav with reference variable of "#myNav"
  ngOnInit() {
    let authState = this._auth.afAuth.authState;
    authState.subscribe((user: firebase.User) => {
      if (user) {
        this.nav.setRoot(NewGiftPage);
      } else {
        this.nav.setRoot(NewGiftPage);
      }
    });
  }

  signOut(): void {
    this._auth.signOut();
  }
}


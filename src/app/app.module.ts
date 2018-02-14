import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {Camera} from "@ionic-native/camera";
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {AngularFireModule} from "angularfire2";
import {AngularFireAuth} from 'angularfire2/auth';

import {MyApp} from './app.component';

import {AboutPage} from "../pages/about/about";
import {HomePage} from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {GiftPage} from "../pages/gift/gift";

import {AuthServiceProvider} from '../providers/auth-service/auth-service';
import {GiftStorage, GiftStore} from "../providers/giftstore";
import {AngularFirestore, AngularFirestoreModule} from "angularfire2/firestore";
import {UserStorage, UserStore} from "../providers/userstore";

export const firebaseConfig = {
  apiKey: "AIzaSyAxO7i-Ekduq6VbeLkouU6pFnOiD28xCLg",
  authDomain: "giftcollect-8d3e6.firebaseapp.com",
  databaseURL: "https://giftcollect-8d3e6.firebaseio.com",
  projectId: "giftcollect-8d3e6",
  storageBucket: "giftcollect-8d3e6.appspot.com",
  messagingSenderId: "710928653535"
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    HomePage,
    LoginPage,
    GiftPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    LoginPage,
    HomePage,
    GiftPage,
  ],
  providers: [
    AngularFireAuth,
    AngularFirestore,
    AuthServiceProvider,
    Camera,
    GiftStore,
    GiftStorage,
    SplashScreen,
    StatusBar,
    UserStore,
    UserStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {
}

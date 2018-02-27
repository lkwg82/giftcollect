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
import {GiftListPage} from '../pages/gift-list/gift-list';
import {LoginPage} from "../pages/login/login";
import {GiftPage} from "../pages/gift/gift";

import {AuthServiceProvider} from '../providers/auth-service/auth-service';
import {GiftStorage, GiftStore} from "../providers/giftstore";
import {AngularFirestore, AngularFirestoreModule} from "angularfire2/firestore";
import {FireStoreDriver} from "../providers/storage/firestoreDriver";
import {ApprovalPage} from "../pages/approval/approval";
import {CandidatesPage} from "../pages/candidates/candidates";
import {UsersPage} from "../pages/users/users";
import {CurrentUser} from "../providers/user/CurrentUser";
import {FriendsPage} from "../pages/friends/friends";
import {UserService} from '../providers/user/userService';
import {UserProfileComponent} from '../components/user-profile/user-profile';
import {FriendsGroupPage, FriendsGroupStep2Page} from "../pages/friends-group/friends-group";
import {NoticeController} from "../providers/view/notice/NoticeController";

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
              ApprovalPage,
              CandidatesPage,
              FriendsPage,
              FriendsGroupPage,
              FriendsGroupStep2Page,
              GiftPage,
              GiftListPage,
              LoginPage,
              UsersPage,
              /* components */
              UserProfileComponent,
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
              ApprovalPage,
              CandidatesPage,
              FriendsPage,
              FriendsGroupPage,
              FriendsGroupStep2Page,
              GiftPage,
              GiftListPage,
              LoginPage,
              UsersPage,
              /* components */
              UserProfileComponent,
            ],
            providers: [
              AngularFireAuth,
              AngularFirestore,
              AuthServiceProvider,
              Camera,
              CurrentUser,
              GiftStore,
              GiftStorage,
              SplashScreen,
              StatusBar,
              UserService,
              FireStoreDriver,
              /* view controller */
              NoticeController,
              /* ionic default */
              {provide: ErrorHandler, useClass: IonicErrorHandler}
            ]
          })

export class AppModule {
}

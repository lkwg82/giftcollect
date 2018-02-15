import {Component, ViewChild} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {LoginPage} from "../pages/login/login";
import {HomePage} from "../pages/home/home";
import {CurrentUser, State} from "../providers/user/CurrentUser";
import {ApprovalPage} from "../pages/approval/approval";
import {UserStore} from "../providers/userstore";
import {CandidatesPage} from "../pages/candidates/candidates";

@Component({
             templateUrl: 'app.html'
           })
export class MyApp {
  @ViewChild('mycontent') nav: NavController;
  rootPage: any = LoginPage;
  approved: boolean;
  candidatesCount: number = 0;
  classes: string = "zero";

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private _currentUser: CurrentUser,
              private _userStore: UserStore) {
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
    this._currentUser.state.subscribe((state: State) => {
      if (state.authenticated) {
        this.approved = state.approved;

        this._userStore.candidateValueChanges().subscribe((candidates) => {
          this.candidatesCount = candidates.length;
          if (this.candidatesCount == 0) {
            this.classes = "zero";
          } else {
            this.classes = "";
          }
        });
        if (state.approved) {
          this.nav.setRoot(HomePage);
        } else {
          this.nav.setRoot(ApprovalPage);
        }
      } else {
        this.nav.setRoot(LoginPage);
      }
    });
  }

  showCandidates(): void {
    this.nav.push(CandidatesPage)
  }

  signOut(): void {
    this._currentUser.signOut();
  }
}


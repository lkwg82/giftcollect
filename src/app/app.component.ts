import {Component, ViewChild} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {LoginPage} from "../pages/login/login";
import {CurrentUser, State} from "../providers/user/CurrentUser";
import {ApprovalPage} from "../pages/approval/approval";
import {Friend, UserCandidate} from "../providers/storage/firestoreDriver";
import {CandidatesPage} from "../pages/candidates/candidates";
import {UsersPage} from "../pages/users/users";
import {AuthServiceProvider} from "../providers/auth-service/auth-service";
import {FriendsPage} from "../pages/friends/friends";
import {UserService} from "../providers/user/userService";
import {GiftListPage} from "../pages/gift-list/gift-list";

@Component({
             templateUrl: 'app.html'
           })
export class MyApp {
  @ViewChild('mycontent') nav: NavController;
  rootPage: any = LoginPage;
  approved: boolean;

  candidatesCount: number = 0;
  friendsCount: number = 0;
  usersCount: number = 1;
  classes: string = "zero";

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private _currentUser: CurrentUser,
              private _userService: UserService,
              private _auth: AuthServiceProvider) {
  }

  // Wait for the components in MyApp's template to be initialized
  // In this case, we are waiting for the Nav with reference variable of "#myNav"
  ngOnInit() {
    this._currentUser.state.subscribe((state: State) => {
      if (state.authenticated) {
        this.approved = state.approved;

        this._userService.changes.candidates()
            .takeUntil(this._auth.signedOut)
            .subscribe(candidates => this.decorateMenuEntryCandidates(candidates));

        this._userService.friendsO.subscribe(friends => this.decorateMenuEntryFriends(friends));
        this.usersCount = this._userService.otherUsers.length + 1;
        this._userService.otherUsersO.subscribe(users => this.usersCount = users.length + 1);

        if (state.approved) {
          this.nav.setRoot(GiftListPage);
        } else {
          this.nav.setRoot(ApprovalPage);
        }
      } else {
        this.nav.setRoot(LoginPage);
      }
    });
  }

  private decorateMenuEntryCandidates(candidates: UserCandidate[]) {
    this.candidatesCount = candidates.length;
    if (this.candidatesCount == 0) {
      this.classes = "zero";
    } else {
      this.classes = "";
    }
  }

  private decorateMenuEntryFriends(friends: Friend[]) {
    this.friendsCount = friends.length;
    if (this.friendsCount == 0) {
      this.classes = "zero";
    } else {
      this.classes = "";
    }
  }

  showCandidates(): void {
    this.nav.push(CandidatesPage)
  }

  showFriends(): void {
    this.nav.push(FriendsPage)
  }

  showUsers(): void {
    this.nav.push(UsersPage)
  }

  signOut(): void {
    this._currentUser.signOut();
  }
}


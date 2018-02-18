import {Injectable} from "@angular/core";
import {AuthServiceProvider} from "../auth-service/auth-service";
import {UserProfile, UserStore} from "../userstore";
import * as firebase from "firebase/app";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";

export class State {
  constructor(readonly authenticated: boolean,
              readonly approved: boolean) {
  }
}

@Injectable()
export class CurrentUser {
  name: string;
  userApproved: boolean;
  private _user: firebase.User;
  state: Observable<State>;

  constructor(private _auth: AuthServiceProvider,
              private _store: UserStore) {
    this.init();
  }

  init() {
    console.debug("init");

    this.state = Observable.create((observer: Observer<State>) => {
      this._auth.state.subscribe((user: firebase.User) => {
        this._user = user;
        if (user) {
          this.handleUser(user, observer);
        } else {
          observer.next(new State(false, false));
          console.debug("user not logged in", user);
        }
      });
    });
  }

  private handleUser(user: firebase.User, observer: Observer<State>) {
    console.debug("current user ", user);
    if (user.displayName) {
      this.name = user.displayName;
    }
    this._store.isApproved().then(approved => {
      this.userApproved = approved;
      observer.next(new State(true, approved));
      if (!approved) {
        this._store.requestApproval();
      }
    }).catch(error => console.error(error));
  }

  signOut(): void {
    this._auth.signOut();
  }

  getProfile(): Promise<UserProfile> {
    return this._store.getProfileById(this._auth.uid);
  }
}

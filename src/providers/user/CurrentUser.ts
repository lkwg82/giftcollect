import {Injectable} from "@angular/core";
import {AuthServiceProvider} from "../auth-service/auth-service";
import {UserStore} from "../userstore";
import * as firebase from "firebase/app";
import {Subject} from "rxjs/Subject";

export class State {
  constructor(readonly authenticated: boolean,
              readonly approved: boolean) {
  }
}

/*
 * unclear structure, wh y do I need this?
 */
@Injectable()
export class CurrentUser {
  name: string;
  userApproved: boolean;
  private _user: firebase.User;
  state: Subject<State> = new Subject<State>();

  constructor(private _auth: AuthServiceProvider,
              private _store: UserStore) {
    this.init();
  }

  init() {
    console.debug("init");

    this._auth.state.subscribe((user: firebase.User) => {
      this._user = user;
      if (user) {
        this.handleUser(user);
      } else {
        this.state.next(new State(false, false));
        console.debug("user not logged in", user);
      }
    });
  }

  private handleUser(user: firebase.User) {
    console.debug("current user ", user);
    if (user.displayName) {
      this.name = user.displayName;
    }
    this._store
        .isApproved()
        .then(approved => {
          this.userApproved = approved;
          this.state.next(new State(true, approved));
          if (!approved) {
            this._store
                .requestApproval()
                .catch(e => console.error("request approval", e));
          }
        })
        .catch(error => console.error(error));
  }

  signOut(): void {
    this._auth
        .signOut()
        .catch(e => console.error(e));
  }
}

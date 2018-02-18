import {Component} from '@angular/core';
import {UserCandidate, UserStore} from "../../providers/userstore";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";

@Component({
             selector: 'page-candidates',
             templateUrl: 'candidates.html',
           })
export class CandidatesPage {
  candidates: UserCandidate[];

  constructor(private _userStore: UserStore,
              private _auth: AuthServiceProvider) {
  }

  ionViewDidLoad() {
    console.log("loaded CandidatePAges");
    this._userStore.changes.candidates()
        .takeUntil(this._auth.signedOut)
        .subscribe((candidates) => this.candidates = candidates);
  }

  accept(candidate: UserCandidate) {
    this._userStore
        .acceptCandidate(candidate)
        .then(() => {
          console.log("candidate accepted");
        })
        .catch((reason) => console.error(reason));
  }

  deny(candidate: UserCandidate) {
    this._userStore
        .denyCandidate(candidate)
        .then(() => {
          console.log("candidate denied");
        })
        .catch((reason) => console.error(reason));
  }
}

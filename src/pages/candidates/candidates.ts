import {Component} from '@angular/core';
import {UserCandidate} from "../../providers/storage/firestoreDriver";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {UserService} from "../../providers/user/userService";

@Component({
             selector: 'page-candidates',
             templateUrl: 'candidates.html',
           })
export class CandidatesPage {
  candidates: UserCandidate[];

  constructor(private _userService: UserService,
              private _auth: AuthServiceProvider) {
  }

  ionViewDidLoad() {
    console.log("loaded CandidatePAges");
    this._userService.changes.candidates()
        .takeUntil(this._auth.signedOut)
        .subscribe((candidates) => this.candidates = candidates);
  }

  accept(candidate: UserCandidate) {
    this._userService
        .acceptCandidate(candidate)
        .then(() => {
          console.log("candidate accepted");
        })
        .catch((reason) => console.error(reason));
  }

  deny(candidate: UserCandidate) {
    this._userService
        .denyCandidate(candidate)
        .then(() => {
          console.log("candidate denied");
        })
        .catch((reason) => console.error(reason));
  }
}

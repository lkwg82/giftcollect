import {Component} from '@angular/core';
import {UserCandidate, UserStore} from "../../providers/userstore";

@Component({
             selector: 'page-candidates',
             templateUrl: 'candidates.html',
           })
export class CandidatesPage {
  candidates: UserCandidate[];

  constructor(private _userStore: UserStore) {
  }

  ionViewDidLoad() {
    this._userStore.candidateValueChanges().subscribe((candidates) => this.candidates = candidates);
  }

  accept(candidate: UserCandidate) {
    this._userStore
        .acceptCandidate(candidate)
        .then(() => {
          console.log("candidate accepted");
        })
        .catch((reason) => console.error(reason));
  }
}

import {Component} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {UserCandidate, UserStore} from "../../providers/userstore";

@Component({
  selector: 'page-candidates',
  templateUrl: 'candidates.html',
})
export class CandidatesPage {
  candidates: UserCandidate[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _userStore: UserStore) {
  }

  ionViewDidLoad() {
    this._userStore.candidateValueChanges().subscribe((candidates) => this.candidates = candidates);
  }

  accept(candidate: UserCandidate) {
    console.log("click", event)
  }
}

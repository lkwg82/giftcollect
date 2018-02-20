import {Component} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";

@Component({
             selector: 'hint',
             templateUrl: 'hint.html'
           })
export class HintComponent {
  hint: string = "";

  constructor(private viewCtrl: ViewController,
              private _navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GiftDeleteYesnoPage');
    if (this._navParams.data.hasOwnProperty("hint")) {
      this.hint = this._navParams.get("hint") as string;
    }
  }

  ok() {
    this.viewCtrl.dismiss();
  }
}

import {Component} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {Gift} from "../../app/domain/gift";

@Component({
             selector: 'page-gift-delete-yesno',
             templateUrl: 'gift-delete-yesno.html',
           })
export class GiftDeleteYesnoPage {
  private gift = new Gift("dummy");

  constructor(private viewCtrl: ViewController,
              private _navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GiftDeleteYesnoPage');
    if (this._navParams.data.hasOwnProperty("gift")) {
      this.gift = this._navParams.get("gift") as Gift;
    }
  }

  yes() {
    this.dismiss(true);
  }

  no() {
    this.dismiss(false);
  }

  private dismiss(decision: boolean) {
    this.viewCtrl.dismiss(decision);
  }

}

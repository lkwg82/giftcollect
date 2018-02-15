import {Component} from '@angular/core';
import {GiftStore} from "../../providers/giftstore";
import {NavController} from "ionic-angular";
import {GiftPage} from "../gift/gift";
import {Gift} from "../../app/domain/gift";

@Component({
             selector: 'page-home',
             templateUrl: 'home.html'
           })
export class HomePage {
  gifts: Gift[] = [];

  constructor(public giftStore: GiftStore,
              private _navCtr: NavController) {
  }

  ionViewDidLoad() {
    console.log("homepage loaded");
    this.giftStore.valueChanges().subscribe((gifts) => this.gifts = gifts);
  }

  addGift() {
    this._navCtr.push(GiftPage);
  }

  itemSelected(gift: Gift) {
    this._navCtr.push(GiftPage, {"gift": gift})
  }
}

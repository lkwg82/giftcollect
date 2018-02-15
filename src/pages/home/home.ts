import {Component} from '@angular/core';
import {GiftStore} from "../../providers/giftstore";
import {NavController} from "ionic-angular";
import {GiftPage} from "../gift/gift";
import {Gift} from "../../app/domain/gift";
import {CurrentUser} from "../../providers/user/CurrentUser";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  gifts: Gift[] = [];

  constructor(public currentUser: CurrentUser,
              public giftStore: GiftStore,
              private _navCtr: NavController) {
  }

  ionViewDidLoad() {
    console.log("homepage loaded");
  }

  ionViewWillEnter() {
    if (this.currentUser.userApproved) {
      this.giftStore.list().subscribe((gifts) => this.gifts = gifts);
    }
  }

  addGift() {
    this._navCtr.push(GiftPage);
  }

  itemSelected(gift: Gift) {
    this._navCtr.push(GiftPage, {"gift": gift})
  }
}

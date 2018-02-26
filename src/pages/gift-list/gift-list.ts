import {Component} from '@angular/core';
import {GiftStore} from "../../providers/giftstore";
import {NavController} from "ionic-angular";
import {GiftPage} from "../gift/gift";
import {Gift} from "../../app/domain/gift";
import {Subject} from "rxjs/Subject";

@Component({
             selector: 'page-gift-list',
             templateUrl: 'gift-list.html'
           })
export class GiftListPage {
  private stop$: Subject<void> = new Subject<void>();

  gifts: Gift[] = [];

  constructor(public giftStore: GiftStore,
              private _navCtrl: NavController) {
  }

  ionViewDidLoad() {
    console.log("homepage loaded");
    this.giftStore
        .valueChanges()
        .takeUntil(this.stop$)
        .subscribe((gifts: Gift[]) => {
          gifts.sort((a, b) => a.title.localeCompare(b.title));
          this.gifts = gifts
        });
  }

  ionViewDidLeave() {
    this.stop$.complete();
  }

  addGift() {
    this._navCtrl.push(GiftPage);
  }

  edit(gift: Gift) {
    this._navCtrl.push(GiftPage, {"gift": gift})
  }
}

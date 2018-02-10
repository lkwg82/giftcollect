import {Component} from '@angular/core';
import {Camera} from '@ionic-native/camera';
import {NavController, NavParams} from "ionic-angular";
import {Gift} from "../../app/domain/gift";
import {GiftStore} from "../../providers/giftstore";


@Component({
  selector: 'page-new-gift',
  templateUrl: 'new-gift.html',
})
export class NewGiftPage {
  public base64Image: string;

  gift: Gift = new Gift();
  changing: boolean = false;

  constructor(private camera: Camera,
              private _nav: NavController,
              private _navParams: NavParams,
              private giftStore: GiftStore) {
    this.base64Image = "";
    if (_navParams.data.hasOwnProperty("gift")) {
      this.gift = _navParams.get("gift") as Gift;
      this.changing = true;
    }
  }

  takePicture() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 10,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }

  addGift() {
    if (this.changing) {
      this.giftStore.update(this.gift);
    } else {
      this.giftStore.add(this.gift);
    }
    this._nav.pop();
  }
}


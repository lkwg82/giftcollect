import {Component} from '@angular/core';
import {Camera} from '@ionic-native/camera';
import {NavController, NavParams} from "ionic-angular";
import {Gift} from "../../app/domain/gift";
import {GiftStore} from "../../providers/giftstore";


@Component({
  selector: 'page-gift',
  templateUrl: 'gift.html',
})
export class GiftPage {
  public base64Image: string = "";

  gift: Gift = new Gift("");
  public changing: boolean = false;

  constructor(private camera: Camera,
              private _nav: NavController,
              private _navParams: NavParams,
              private giftStore: GiftStore) {
  }

  ionViewDidLoad() {
    if (this._navParams.data.hasOwnProperty("gift")) {
      this.gift = this._navParams.get("gift") as Gift;
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

  addOrUpdateGift() {
    this.giftStore.addOrUpdate(this.gift)
      .then(() => {
        this._nav.pop();
      })
      .catch((reason) => {
        console.error("failed to add gift: " + reason);
        this._nav.pop();
      })
  }
}


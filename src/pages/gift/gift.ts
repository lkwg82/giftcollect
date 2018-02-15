import {Component, ViewChild} from '@angular/core';
import {Camera} from '@ionic-native/camera';
import {NavController, NavParams, TextInput} from "ionic-angular";
import {Gift} from "../../app/domain/gift";
import {GiftStore} from "../../providers/giftstore";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";


@Component({
             selector: 'page-gift',
             templateUrl: 'gift.html',
           })
export class GiftPage {
  @ViewChild('title') title: TextInput;
  public base64Image: string = "";

  gift: Gift = new Gift("");
  public changing: boolean = false;

  constructor(private camera: Camera,
              private _nav: NavController,
              private _navParams: NavParams,
              private _giftStore: GiftStore,
              private _auth: AuthServiceProvider) {
  }

  ionViewDidLoad() {
    if (this._navParams.data.hasOwnProperty("gift")) {
      this.gift = this._navParams.get("gift") as Gift;
      this.changing = true;
    }
    this.gift.owner = this._auth.uid;
    this.title.setFocus();
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
    this._giftStore.addOrUpdate(this.gift);
    this._nav.pop();
  }

  delete(gift: Gift) {
    this._giftStore.delete(gift);
    this._nav.pop();
  }
}


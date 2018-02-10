import {Component} from '@angular/core';
import {Camera} from '@ionic-native/camera';
import {NavController} from "ionic-angular";
import {Gift} from "../../app/domain/gift";


@Component({
  selector: 'page-new-gift',
  templateUrl: 'new-gift.html',
})
export class NewGiftPage {
  public base64Image: string;

  gift: Gift = new Gift();

  constructor(private camera: Camera, private _nav: NavController) {
    this.base64Image = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewGiftPage');
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
    console.log("name: ", this.gift);
    // this._nav.setRoot(HomePage);
  }
}


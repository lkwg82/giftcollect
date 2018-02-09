import {Component} from '@angular/core';
import {Camera} from '@ionic-native/camera';

// const options: CameraOptions = {
//   quality: 100,
//   destinationType: this.camera.DestinationType.DATA_URL,
//   encodingType: this.camera.EncodingType.JPEG,
//   mediaType: this.camera.MediaType.PICTURE
// };

@Component({
  selector: 'page-new-gift',
  templateUrl: 'new-gift.html',
})
export class NewGiftPage {
  public base64Image: string;

  constructor(private camera: Camera) {
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
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }
}

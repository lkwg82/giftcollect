import {Injectable} from "@angular/core";
import {ToastController} from "ionic-angular";

@Injectable()
export class NoticeController {

  constructor(private _toastCtrl: ToastController) {
  }

  notice(text: string, dismissTimeout: number = 1000): Promise<void> {

    let opts = {
      message: text,
      duration: dismissTimeout,
      position: 'middle'
    };
    return this._toastCtrl.create(opts).present();
  }
}

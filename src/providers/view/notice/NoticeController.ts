import {Injectable} from "@angular/core";
import {AlertController} from "ionic-angular";

@Injectable()
export class NoticeController {

  constructor(private _alert: AlertController) {
  }

  notice(text: string, dismissTimeout: number = 500): Promise<void> {
    let alert = this._alert.create({subTitle: text});
    return alert.present()
                .then(() => {
                  setTimeout(() => alert.dismiss(), dismissTimeout);
                  return Promise.resolve();
                })
                .catch(e => Promise.reject(e));
  }
}

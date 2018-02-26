import {Component, ViewChild} from '@angular/core';
import {Camera} from '@ionic-native/camera';
import {AlertController, NavController, NavParams} from "ionic-angular";
import {Gift} from "../../app/domain/gift";
import {GiftStore} from "../../providers/giftstore";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {NoticeController} from "../../providers/view/notice/NoticeController";


@Component({
             selector: 'page-gift',
             templateUrl: 'gift.html',
           })
export class GiftPage {
  @ViewChild('title') title: any;

  public base64Image: string = "";

  gift: Gift = new Gift("");
  public changing: boolean = false;

  constructor(private camera: Camera,
              private _nav: NavController,
              private _navParams: NavParams,
              private _giftStore: GiftStore,
              private _auth: AuthServiceProvider,
              private _alertCtrl: AlertController,
              private _noticeCtrl: NoticeController) {
  }

  ionViewDidLoad() {
    if (this._navParams.data.hasOwnProperty("gift")) {
      this.gift = this._navParams.get("gift") as Gift;
      this.changing = true;
    }
    this.gift.owner = this._auth.uid;
  }

  ngOnInit() {
    setTimeout(() => {
      this.title.setFocus();
    }, 150);
  }

  ionViewWillLeave() {
    this._giftStore.addOrUpdate(this.gift);
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

  delete(gift: Gift) {

    let options = {
      title: 'Geschenk löschen',
      message: 'Möchtest du "' + gift.title + '" löschen?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Löschen',
          handler: () => {
            this._giftStore.delete(gift)
                .then(() => this._noticeCtrl.notice("Geschenk gelöscht"));
            this._nav.pop();
          }
        }
      ]
    };
    this._alertCtrl.create(options).present();
  }

  save(gift: Gift) {
    if (gift.title.length == 0) {
      this._noticeCtrl.notice("Titel darf nicht leer bleiben");
    } else {
      this._nav.pop()
          .then(() => this._giftStore
                          .addOrUpdate(gift)
                          .then(() => this._noticeCtrl.notice("Geschenk gespeichert"))
          )
    }
  }

  showDescription() {
    this.gift.description = "deine Beschreibung";
  }

  showEstimatedPrice() {
    this.gift.estimatedPrice = 10;
  }
}


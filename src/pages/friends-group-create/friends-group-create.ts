import {Component} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";

/**
 * Generated class for the FriendsGroupCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
             selector: 'page-friends-group-create',
             templateUrl: 'friends-group-create.html',
           })
export class FriendsGroupCreatePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsGroupCreatePage');
  }

}

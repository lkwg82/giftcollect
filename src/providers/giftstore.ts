import {Injectable} from "@angular/core";

import {Gift} from "../app/domain/gift";
import {AuthServiceProvider} from "./auth-service/auth-service";
import uuid from 'uuid/v4'
import {AngularFirestore} from "angularfire2/firestore";

@Injectable()
export class GiftStorage {

  constructor(private auth: AuthServiceProvider,
              private database: AngularFirestore) {
  }


  get userKey(): string {
    return "user-" + this.auth.userId
  }

  getGiftById(id: string): Promise<Gift> {
    console.log("id" + id);
    return null;//this.storage.get(key);
  }

  insert(gift: Gift): void {
    gift.id = uuid();
    gift.owner = this.userKey;

    let gifts = this.database.collection("/gifts");
    gifts.add(this.asData(gift)).then((data) => {
      console.log("data: ", data);
    });
  }

  // see https://github.com/firebase/firebase-js-sdk/issues/311
  private asData(gift: Gift): object {
    return JSON.parse(JSON.stringify(gift));
  }

  list(): Gift[] {
    // let baseKey = this.userKey + "-gift-";

    let gifts: Gift[] = [];
    this.database.collection("/gifts").ref
      .where("owner", "==", this.auth.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          console.log(doc);
          gifts.push(<Gift>doc.data());
        })
      }).catch((error) => {
      console.error("Error getting documents: ", error);
    });
    return gifts;
  }
}

@Injectable()
export class GiftStore {

  constructor(private store: GiftStorage) {
    console.log("started giftstore");
  }

  addOrUpdate(gift: Gift): void {
    this.store.insert(gift);
    // this.store.getGiftById(gift.id).then(function (found: Gift) {
    //   let g = {...gift};
    //   if (found == null) {
    //     g.id = uuid();
    //   }
    //   this.store.insert(g.id, g)
    //     .catch((reason) => {
    //       console.log('Handle rejected promise (' + reason + ') here.');
    //     });
    // }).catch((reason) => {
    //   console.log('Handle rejected promise (' + reason + ') here.');
    // });
  }

  list(): Gift[] {
    return this.store.list();
  }
}


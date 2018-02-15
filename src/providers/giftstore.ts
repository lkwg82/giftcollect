import {Injectable} from "@angular/core";

import {Gift} from "../app/domain/gift";
import {AuthServiceProvider} from "./auth-service/auth-service";
import {AngularFirestore} from "angularfire2/firestore";
import {Observer} from "rxjs/Observer";
import {Observable} from "rxjs/Observable";

@Injectable()
export class GiftStorage {
  private readonly setOptions = {merge: true};

  constructor(private auth: AuthServiceProvider,
              private database: AngularFirestore) {
  }

  update(gift: Gift): Promise<void> {
    return this.database.collection("/gifts")
               .doc(this.auth.uid)
               .ref
               .collection("gifts")
               .doc(gift.id)
               .set(this.asData(gift), this.setOptions);
  }

  // see https://github.com/firebase/firebase-js-sdk/issues/311
  private asData(gift: Gift): object {
    return JSON.parse(JSON.stringify(gift));
  }

  list(): Observable<Gift[]> {
    return Observable.create((observer: Observer<Gift[]>) => {
      this.database.collection("/gifts")
          .doc(this.auth.uid)
          .collection("gifts")
          .ref
          .orderBy("title")
          .get()
          .then((snapshot) => {
            let gifts: Gift[] = [];
            snapshot.forEach((doc) => {
              // console.log(doc.id, " => ", doc.data());
              console.debug(doc);
              gifts.push(<Gift>doc.data());
            });
            observer.next(gifts);
            observer.complete();
          })
          .catch((error) => {
            observer.error("Error getting documents: " + error);
          });
    });
  }
}

@Injectable()
export class GiftStore {

  constructor(private storage: GiftStorage) {
    console.debug("started giftstore");
  }

  addOrUpdate(gift: Gift): Promise<void> {
    return this.storage.update(gift);
  }

  list(): Observable<Gift[]> {
    return this.storage.list();
  }
}


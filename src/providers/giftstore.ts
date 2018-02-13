import {Injectable} from "@angular/core";

import {Gift} from "../app/domain/gift";
import {AuthServiceProvider} from "./auth-service/auth-service";
import uuid from 'uuid/v4'
import {AngularFirestore} from "angularfire2/firestore";
import * as firebase from "firebase/app";
import {Observer} from "rxjs/Observer";
import {Observable} from "rxjs/Observable";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

@Injectable()
export class GiftStorage {

  constructor(private auth: AuthServiceProvider,
              private database: AngularFirestore) {
  }

  getGiftById(id: string): Observable<Gift> {
    console.log("id" + id);

    let querySnapshotPromise = this.database
      .collection("/gifts")
      .ref
      .doc(id)
      .get();

    return Observable.create((observer: Observer<Gift>) => {
      querySnapshotPromise.then((snapshot: DocumentSnapshot) => {
        observer.next(<Gift>snapshot.data());
        observer.complete();
      }).catch((error) => {
        observer.error("Error getting documents: " + error);
      });
    });
  }

  update(gift: Gift): Promise<void> {
    return this.database.collection("/gifts")
      .doc(gift.id)
      .set(this.asData(gift));
  }

  // see https://github.com/firebase/firebase-js-sdk/issues/311
  private asData(gift: Gift): object {
    return JSON.parse(JSON.stringify(gift));
  }

  list(): Observable<Gift[]> {
    return Observable.create((observer: Observer<Gift[]>) => {
      this.database.collection("/gifts").ref
        .where("owner", "==", this.auth.userId)
        .get()
        .then((snapshot) => {
          let gifts: Gift[] = [];
          snapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            console.log(doc);
            gifts.push(<Gift>doc.data());
          });
          observer.next(gifts);
          observer.complete();
        })
        .catch((error) => {
          observer.error("Error getting documents: " + error);
        });
    })
  }
}

@Injectable()
export class GiftStore {

  constructor(private auth: AuthServiceProvider,
              private storage: GiftStorage) {
    console.log("started giftstore");
  }

  addOrUpdate(gift: Gift): Promise<void> {
    if (gift.id == null) {
      gift.id = uuid();
      gift.owner = this.auth.userId;
    }
    return this.storage.update(gift);
  }

  list(): Observable<Gift[]> {
    return this.storage.list();
  }
}


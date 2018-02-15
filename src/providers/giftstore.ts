import {Injectable} from "@angular/core";

import {Gift} from "../app/domain/gift";
import {AuthServiceProvider} from "./auth-service/auth-service";
import {AngularFirestore} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";

@Injectable()
export class GiftStorage {
  private readonly setOptions = {merge: true};
  private readonly col_gifts = "/gifts";

  constructor(private auth: AuthServiceProvider,
              private database: AngularFirestore) {
  }

  update(gift: Gift): Promise<void> {
    return this._docRef(gift)
               .set(Gift.asData(gift), this.setOptions);
  }

  delete(gift: Gift): Promise<void> {
    if (gift.owner == this.auth.uid) {

      gift.deleted = true;
      gift.deletedAt = Date.now();

      return this._docRef(gift)
                 .set(gift, this.setOptions)
                 .then(() => {
                   console.log("deleted", gift);
                   return Promise.resolve();
                 })
                 .catch((reason) => {
                   console.error(reason);
                   return Promise.reject(reason);
                 });
    } else {
      return Promise.reject("this gift is not owned by you, not allowed to delete");
    }
  }

  valueChanges(): Observable<Gift[]> {
    return Observable.create((observer: Observer<Gift[]>) => {
      this._myGifts()
          .valueChanges()
          .subscribe(gifts => {
            let filtered = gifts.filter(g => g.deleted == undefined);
            observer.next(filtered);
          });
    });
  }

  private _myGifts() {
    return this.database.collection(this.col_gifts)
               .doc(this.auth.uid)
               .collection<Gift>("gifts");
  }

  private _docRef(gift: Gift) {
    return this._myGifts().doc(gift.id);
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

  valueChanges(): Observable<Gift[]> {
    return this.storage.valueChanges();
  }

  delete(gift: Gift): Promise<void> {
    return this.storage.delete(gift);
  }
}


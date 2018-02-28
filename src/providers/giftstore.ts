import {Injectable} from "@angular/core";

import {Gift} from "../app/domain/gift";
import {AuthServiceProvider} from "./auth-service/auth-service";
import {AngularFirestore} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import {Storage} from '@ionic/storage';
import {AngularFireStorage, AngularFireUploadTask} from "angularfire2/storage";
import uuid from "uuid/v4";
import * as firebase from "firebase/app";
import {HttpClient} from "@angular/common/http";
import UploadMetadata = firebase.storage.UploadMetadata;

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
          .takeUntil(this.auth.signedOut)
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

class OfflineBlob<T> {
  constructor(readonly uploaded: boolean,
              readonly data: T,
              readonly deleted: boolean = false) {
  }
}

class OfflineBlobStorage {
  readonly prefix: string = "images";

  constructor(private storage: Storage,
              private afs: AngularFireStorage,
              private http: HttpClient) {
  }

  save(gift: Gift, image: GiftImage): Promise<void> {
    let key = this.prefix + "_" + image.id;
    return this.existKey(key)
               .then(x => {
                 console.log("x", x);
                 console.log("already saved", image.id);
                 return Promise.resolve();
               })
               .catch(() => this.trySaveOnline(key, image, gift))
  }

  private existKey(key: string): Promise<string> {
    return this.storage
               .keys()
               .then((keys: string[]) => {
                 let found = keys.find(value => value === key);
                 return found ? Promise.resolve(found) : Promise.reject("not found");
               });
  }

  private trySaveOnline(key: string, image: GiftImage, gift: Gift): Promise<void> {
    return this.saveLocal(key, new OfflineBlob<GiftImage>(false, image))
               .then(() => {
                 console.log("synced offline " + image.id);
                 return this.uploadImage(gift, image);
               })
               .then(() => {
                 this.saveLocal(key, new OfflineBlob<GiftImage>(true, image))
                     .then(() => console.log("synced online " + image.id))
                     .catch(e => console.error("sync failed " + image.id, e))
               })
               .catch(e => Promise.reject(e));
  }

  private saveLocal(key: string, blob: OfflineBlob<any>) {
    return this.storage.set(key, blob);
  }

  private uploadImage(gift: Gift, image: GiftImage): AngularFireUploadTask {
    let ref = this.afs.ref("images/" + image.id);
    let metadata: UploadMetadata = {
      contentType: "image/jpeg",
      customMetadata: {
        owner: gift.owner,
        gift: gift.id,
      }
    };
    return ref.put(image.data, metadata)
  }

  deleteImagesFor(gift: Gift): Promise<void> {
    if (gift.imageUUIDs) {

      let remove = (id: string): Promise<any> => {
        let key = this.prefix + "_" + id;
        return this.existKey(key)
                   .then(() => this.storage.get(key))
                   .then(blob => {
                           let blobForDeletion = new OfflineBlob(blob.uploaded, blob.data, true);
                           return this.storage.set(key, blobForDeletion)
                         }
                   )
                   .then(() => this.afs.ref("images/" + id).delete().toPromise())
                   .then(() => this.storage.remove(key))
      };

      let count = gift.imageUUIDs.length;
      let okCount = 0;
      let errCount = 0;

      return new Promise<void>((ok, _) => {
        gift.imageUUIDs.forEach(id => {
          remove(id).then(() => {
            console.log("removed online ", id);
            okCount++;
            if ((okCount + errCount) === count) {
              ok();
            }
          }).catch(e => {
            if ((okCount + errCount) === count) {
              console.log("removed with error : " + e, id);
              ok();
            }
          });
        });

      });
    } else {
      return Promise.resolve();
    }
  }

  retrieveImage(uuid: string): Promise<GiftImage> {
    let key = this.prefix + "_" + uuid;
    let promise = new Promise<GiftImage>((ok, error) => {
      this.storage
          .get(key)
          .then((blob: OfflineBlob<GiftImage>) => {
            if (blob) {
              ok(new GiftImage(blob.data.id, blob.data.data));
            } else {
              console.log("image '" + uuid + "' not found in local storage");
              this.afs.ref("images/" + uuid)
                  .getDownloadURL()
                  .subscribe(downloadUrl => {
                    console.log("url:" + downloadUrl);
                    this.http.get(downloadUrl, {responseType: 'blob'})
                        .subscribe(blob => {
                          console.log("data", blob);
                          let arrayBuffer: ArrayBuffer = new ArrayBuffer(1);
                          let fileReader = new FileReader();
                          fileReader.onload = function () {
                            arrayBuffer = this.result;
                          };
                          fileReader.onloadend = () => {
                            let giftImage = new GiftImage(uuid, new Uint8Array(arrayBuffer));
                            let offlineBlob = new OfflineBlob<GiftImage>(true, giftImage);
                            this.storage.set(key, offlineBlob).then(() => ok(giftImage));
                          };
                          fileReader.readAsArrayBuffer(blob);
                        })
                  })
            }
          })
          .catch(e => {
            console.error(e);
            error(e);
          })
    });
    return promise
      .then(image => Promise.resolve(image))
      .catch(e => Promise.reject(e))
  }
}

@Injectable()
export class GiftStore {
  private blobStorage: OfflineBlobStorage;

  constructor(private giftStorage: GiftStorage,
              private storage: Storage,
              private afs: AngularFireStorage,
              private http: HttpClient) {
    console.debug("started giftstore");
    this.blobStorage = new OfflineBlobStorage(storage, afs, http);
  }


  addOrUpdate(gift: Gift, images: GiftImage[]): Promise<void> {
    return this.giftStorage.update(gift)
               .then(() => images.forEach(image => this.blobStorage.save(gift, image)))
  }

  valueChanges(): Observable<Gift[]> {
    return this.giftStorage.valueChanges();
  }

  delete(gift: Gift): Promise<void> {
    return this.giftStorage.delete(gift)
               .then(() => this.blobStorage.deleteImagesFor(gift));
  }

  retrieveImage(uuid: string): Promise<GiftImage> {
    return this.blobStorage.retrieveImage(uuid);
  }
}

export class GiftImage {
  constructor(readonly id: string,
              readonly data: Uint8Array) {
  }

  static createFromBase64(base64: string): GiftImage {
    let uint8Array = GiftImage.convertBase64ToUintArray(base64);
    let key = uuid();
    return new GiftImage(key, uint8Array);
  }

  get base64(): string {
    return GiftImage.convertUint8aToBase64(this.data)
  }

  private static convertBase64ToUintArray(base64: string) {

    let raw = window.atob(base64);
    let rawLength = raw.length;
    let array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  private static convertUint8aToBase64(u8a: Uint8Array): string {
    return btoa(this.Uint8ToString(u8a));
  }

  // https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string
  private static Uint8ToString(u8a: Uint8Array) {
    let CHUNK_SZ = 0x8000;
    let c = [];
    for (let i = 0; i < u8a.length; i += CHUNK_SZ) {
      c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
    }
    return c.join("");
  }
}


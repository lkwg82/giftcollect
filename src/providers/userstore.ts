import {Injectable} from "@angular/core";
import {AuthServiceProvider} from "./auth-service/auth-service";
import {AngularFirestore} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";

class UserCandidate {
  constructor(readonly email: string,
              readonly displayName: string,
              readonly lastRequestTime: number,
              readonly lastRequestTimeReadable: string) {
  }

  // see https://github.com/firebase/firebase-js-sdk/issues/311
  asObject(): object {
    return JSON.parse(JSON.stringify(this));
  }
}

@Injectable()
export class UserStorage {

  private readonly col_user_candidates = "/user_candidates";
  private readonly col_users = "/users";

  constructor(private database: AngularFirestore) {
  }

  isApproved(uid: string, email: string, displayName: string): Promise<boolean> {
    return new Promise((fullfill, error) => {
      this.database.collection(this.col_users)
        .doc(uid).ref
        .get()
        .then((snapShot) => fullfill(snapShot.exists))
        .catch((reason) => {
          console.error(reason);
          error(reason);
        });
    });
  }

  private createUserCandidate(uid: string, email: string, displayName: string): Promise<void> {
    let userCandidate = new UserCandidate("" + email, "" + displayName, Date.now(), new Date().toISOString());

    return this.database.collection(this.col_user_candidates)
      .doc(uid).ref
      .set(userCandidate.asObject())
      .then(ok => console.log("candidate inserted"))
      .catch((reason) => console.error(reason));
  }

  requestApproval(uid: string, email: string, displayName: string): Promise<void> {
    return this.createUserCandidate(uid, email, displayName);
  }

  candidateValueChanges(): Observable<UserCandidate[]> {
    return this.database.collection<UserCandidate>(this.col_user_candidates).valueChanges();
  }
}

@Injectable()
export class UserStore {

  constructor(private _auth: AuthServiceProvider,
              private _storage: UserStorage) {
  }

  isApproved(): Promise<boolean> {
    let uid = this._auth.uid;
    let email = this._auth.email;
    let displayName = this._auth.displayName;
    return this._storage.isApproved(uid, email, displayName);
  }

  requestApproval(): Promise<void> {
    let uid = this._auth.uid;
    let email = this._auth.email;
    let displayName = this._auth.displayName;
    return this._storage.requestApproval(uid, email, displayName);
  }

  candidateValueChanges(): Observable<UserCandidate[]> {
    return this._storage.candidateValueChanges();
  }
}


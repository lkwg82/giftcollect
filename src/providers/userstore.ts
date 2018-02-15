import {Injectable} from "@angular/core";
import {AuthServiceProvider} from "./auth-service/auth-service";
import {AngularFirestore} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";

export class UserCandidate {
  constructor(readonly userId: string,
              readonly email: string,
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

  isApproved(uid: string): Promise<boolean> {
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

  createUserCandidate(candidate: UserCandidate): Promise<void> {
    return this.database.collection(this.col_user_candidates)
      .doc(candidate.userId).ref
      .set(candidate.asObject())
      .then(_ => console.log("candidate inserted"))
      .catch((reason) => console.error(reason));
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
    return this._storage.isApproved(this._auth.uid);
  }

  requestApproval(): Promise<void> {
    let userCandidate = new UserCandidate(
      this._auth.uid,
      this._auth.email || "",
      this._auth.displayName || "",
      Date.now(),
      new Date().toISOString());

    return this._storage.createUserCandidate(userCandidate);
  }

  candidateValueChanges(): Observable<UserCandidate[]> {
    return this._storage.candidateValueChanges();
  }
}


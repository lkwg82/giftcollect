import {Injectable} from "@angular/core";
import {AuthServiceProvider} from "./auth-service/auth-service";
import {AngularFirestore} from "angularfire2/firestore";

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

  constructor(private database: AngularFirestore) {
  }

  isApproved(uid: string, email: string, displayName: string): Promise<boolean> {
    return new Promise((fullfill, error) => {
      this.database.collection("/users")
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

    return this.database.collection("/user_candidates")
      .doc(uid).ref
      .set(userCandidate.asObject())
      .then(ok => console.log("candidate inserted"))
      .catch((reason) => console.error(reason));
  }

  requestApproval(uid: string, email: string, displayName: string): Promise<void> {
    return this.createUserCandidate(uid, email, displayName);
  }

  candidates() {
    return this.database.collection("/user_candidates");
  }
}

@Injectable()
export class UserStore {

  constructor(private auth: AuthServiceProvider,
              private storage: UserStorage) {
  }

  isApproved(): Promise<boolean> {
    let uid = this.auth.uid;
    let email = this.auth.email;
    let displayName = this.auth.displayName;
    return this.storage.isApproved(uid, email, displayName);
  }

  requestApproval(): Promise<void> {
    let uid = this.auth.uid;
    let email = this.auth.email;
    let displayName = this.auth.displayName;
    return this.storage.requestApproval(uid, email, displayName);
  }
}


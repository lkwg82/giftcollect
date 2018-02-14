import {Injectable} from "@angular/core";
import {AuthServiceProvider} from "./auth-service/auth-service";
import {AngularFirestore} from "angularfire2/firestore";

@Injectable()
export class UserStorage {

  constructor(private database: AngularFirestore) {
  }

  isApproved(uid: string, email: string, displayName: string): Promise<boolean> {
    return new Promise((ok, error) => {
      this.database.collection("/users")
        .doc(uid).ref
        .get()
        .then((snapShot) => ok(snapShot.exists))
        .catch((reason) => {
          if (reason.code == "permission-denied") {
            this.createUserCandidate(uid, email, displayName);
            ok(false);
          } else {
            console.error(reason);
            error(reason);
          }
        });
    });
  }

  private createUserCandidate(uid: string, email: string, displayName: string) {
    this.database.collection("/user_candidates")
      .doc(uid).ref
      .set({
        "email": "" + email,
        "displayName": "" + displayName,
        "lastRequestTime": Date.now(),
        "lastRequestTimeReadable": new Date().toISOString()
      })
      .then(ok => {
        console.log("candidate inserted");
      })
      .catch((reason2) => {
        console.error(reason2);
      });
  }

  requestApproval(uid: string, email: string, displayName: string): Promise<void> {
    return this.isApproved(uid, email, displayName).then(approved => {
      console.log("approved")
    })
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


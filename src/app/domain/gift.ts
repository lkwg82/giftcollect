import uuid from "uuid/v4";

export class Gift {
  id: string;
  title: string;
  description: string;
  estimatedPrice: number;
  doNotExceedPrice: boolean;
  doAskBeforeBuy: boolean;
  owner: string;

  constructor(title: string) {
    this.id = uuid();
    this.title = title;
  }

  // see https://github.com/firebase/firebase-js-sdk/issues/311
  asData(): object {
    return JSON.parse(JSON.stringify(this));
  }
}

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
}

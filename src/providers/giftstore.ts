import {Gift} from "../app/domain/gift";

export class GiftStore {
  gifts: Gift[] = [];

  constructor() {
    console.log("started giftstore")

    let gift = new Gift();
    gift.title = "Fahrrad";
    this.gifts.push(gift)
  }

  add(gift: Gift) {
    console.log("name: ", gift);
    this.gifts.push(gift);
  }
}

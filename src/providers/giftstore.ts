import uuid from 'uuid/v1';

import {Gift} from "../app/domain/gift";

export class GiftStore {
  private gifts: Map<string, Gift> = new Map();

  constructor() {
    console.log("started giftstore");

    let gift = new Gift();
    gift.id = uuid();
    gift.title = "Fahrrad";
    this.gifts.set(gift.id, gift);
  }

  addOrUpdate(gift: Gift): Gift {
    let found = this.gifts.get(gift.id);
    if (found == null) {
      let g = {...gift};
      g.id = uuid();
      this.gifts.set(g.id, g);
      return g;
    } else {
      found.title = gift.title;
      found.description = gift.description;
      found.estimatedPrice = gift.estimatedPrice;
      found.doNotExceedPrice = gift.doNotExceedPrice;
      found.doAskBeforeBuy = gift.doAskBeforeBuy;
      return found;
    }
  }

  list(): Gift[] {
    return Array.from(this.gifts.values());
  }
}

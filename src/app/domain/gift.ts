export class Gift {
  public id: string;
  public title: string = "";
  public description: string = "";
  public estimatedPrice: number = 0;
  public doNotExceedPrice: boolean = false;
  public doAskBeforeBuy: boolean = false;
  public owner: string;

  constructor(title?: string) {
    this.title = title;
  }
}

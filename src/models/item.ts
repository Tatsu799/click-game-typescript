export class Item {
  name: string;
  type: string;
  maxQuantity: number | string;
  price: number;
  imgUrl: string;
  unitPrice: string;
  perClick: number;
  perSec: number;
  itemPurchaseCount: number;
  totalPrice: number = 0;

  constructor(
    name: string,
    type: string,
    maxQuantity: number | string,
    price: number,
    imgUrl: string,
    unitPrice: string,
    perClick: number,
    perSec: number,
    itemPurchaseCount: number
  ) {
    this.name = name;
    this.type = type;
    this.maxQuantity = maxQuantity;
    this.price = price;
    this.imgUrl = imgUrl;
    this.unitPrice = unitPrice;
    this.perClick = perClick;
    this.perSec = perSec;
    this.itemPurchaseCount = itemPurchaseCount;
    this.totalPrice = 0;
  }
}

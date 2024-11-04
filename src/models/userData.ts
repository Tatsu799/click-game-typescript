import { Item } from './item';

export class UserData {
  name: string;
  age: number;
  days: number;
  money: number;
  burgers: number;
  items: Item[];
  perClickPrice: number = 25;
  perSecPrice: number = 0;
  totalItemPrice: number = 0;
  constructor(name: string, age: number, days: number, money: number, burgers: number, items: Item[]) {
    this.name = name;
    this.age = age;
    this.days = days;
    this.money = money;
    this.burgers = burgers;
    this.items = items;
    this.perClickPrice = 25;
    this.perSecPrice = 0;
    this.totalItemPrice = 0;
  }
}

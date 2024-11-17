import { config } from '../models/config';
import { displayNone, displayBlock } from '../views/display';
import { Views } from '../views/view';
import { UserData } from '../models/userData';
import { Item } from '../models/item';
import { game } from '../index';

export class Controller {
  private static instance: Controller;
  private setTimer: number = 0;

  private constructor() {}

  static getInstance() {
    if (!Controller.instance) {
      Controller.instance = new Controller();
    }
    return Controller.instance;
  }

  //MainPageへ遷移。
  startGame() {
    Views.startGamePage();
    if (config.mainPage) {
      displayNone(config.mainPage);
    } else {
      throw new Error('要素が取得できません。');
    }

    const newButton = document.getElementById('new-button');
    const loginButton = document.getElementById('login-button');

    if (newButton) {
      newButton.addEventListener('click', () => {
        let userData = game.initialUserData();
        if (userData.name === '') {
          alert('Please put your name');
        } else {
          if (config.mainPage && config.initialPage) {
            displayBlock(config.mainPage);
            displayNone(config.initialPage);
            Views.mainPage(userData);
            game.timeInterval(userData);
          }
        }
      });
    }

    if (loginButton) {
      loginButton.addEventListener('click', () => {
        let userNameEle: HTMLInputElement | null = null;
        let userName: string;
        if (config.initialPage) {
          userNameEle = config.initialPage.querySelector('#yourName');
          if (userNameEle) {
            userName = userNameEle.value;
          } else {
            throw new Error('要素が取得できません。');
          }
        } else {
          throw new Error('要素が取得できません。');
        }

        if (localStorage.getItem(userName) === null) {
          alert('No user data');
        } else {
          if (!userName) {
            alert('User name is required.');
          } else {
            const userData: string = localStorage.getItem(userName)!;
            console.log(userData);

            if (userData !== null) {
              if (config.mainPage) {
                const userInfo = JSON.parse(userData);
                displayBlock(config.mainPage);
                displayNone(config.initialPage);
                Views.mainPage(userInfo);
                game.timeInterval(userInfo);
              }
            }
          }
        }
      });
    }
  }

  private initialUserData() {
    const Items: Item[] = [
      new Item('Flip machine', 'click', 500, 15000, './image/flip-machine-img.png', '$25/click', 25, 0, 0),
      new Item('ETF Stock', 'stock', '∞', 300000, './image/stoks-img.png', '$0.1/sec', 0, 0.1, 0),
      new Item('ETF Bonds', 'stock', '∞', 300000, './image/stoks-img.png', '$0.7/sec', 0, 0.07, 0),
      new Item('Lemonade Stand', 'other', 1000, 30000, './image/lemonade-img.png', '$30/sec', 0, 30, 0),
      new Item('Ice Cream Truck', 'other', 500, 100000, './image/ice-cream-img.png', '$120/sec', 0, 120, 0),
      new Item('House', 'other', 100, 20000000, './image/house-img.png', '$32000/sec', 0, 32000, 0),
      new Item('TownHouse', 'other', 100, 40000000, './image/town-house.png', '$64000/sec', 0, 64000, 0),
      new Item('Mansion', 'other', 20, 250000000, './image/mansion-img.png', '$500000/sec', 0, 500000, 0),
      new Item('Industrial Space', 'other', 10, 1000000000, './image/industrial-space-img.png', '$2200000/sec', 0, 2200000, 0),
      new Item('Hotel Skyscraper', 'other', 5, 10000000000, './image/hotel-skyscraper-img.png', '$25000000/sec', 0, 25000000, 0),
      new Item(
        'Bullet-Speed Sky Railway',
        'other',
        1,
        10000000000000,
        './image/bullet-speed-sky -railway-img.png',
        '$30000000000/sec',
        0,
        30000000000,
        0
      ),
    ];

    let inputName: HTMLInputElement | null = null;
    if (config.initialPage) {
      inputName = config.initialPage.querySelector('input[name="yourName"]');
    } else {
      throw new Error('要素が取得できません。');
    }

    let userData: UserData;
    if (inputName) {
      userData = new UserData(inputName.value, 20, 0, 50000, 0, Items);
    } else {
      throw new Error('要素が取得できません。');
    }
    return userData;
  }

  private timeInterval(userData: UserData) {
    game.setTimer = window.setInterval(function () {
      game.countDays(userData);

      if (userData.perSecPrice > 0) {
        userData.money += userData.perSecPrice;
      }

      game.rewriteUserData(userData);
    }, 1000);
  }

  stopTimer() {
    clearInterval(game.setTimer);
  }

  countDays(userData: UserData) {
    userData.days++;
    if (userData.days % 365 === 0) {
      userData.age++;
    }
  }

  //ユーザーデータの更新
  private rewriteUserData(userData: UserData) {
    if (config.mainPage) {
      const age: HTMLDivElement | null = config.mainPage.querySelector('#age');
      const days: HTMLDivElement | null = config.mainPage.querySelector('#days');
      const money: HTMLDivElement | null = config.mainPage.querySelector('#money');

      if (age && days && money) {
        age.innerHTML = `${userData.age} years old`;
        days.innerHTML = `${userData.days} days`;
        money.innerHTML = `$${userData.money}`;
      }
    }
  }

  //Burgerのクリックデータを更新
  CountClickBurger(userData: UserData) {
    userData.burgers++;
    userData.money += userData.perClickPrice;
    Views.updateBurgersPage(userData);
    Views.updateUserInfoPage(userData);
  }

  //ユーザーデータのリセット
  resetUserData() {
    window.confirm('Reset All Data?');
    let newUser = game.initialUserData();
    if (config.mainPage) {
      config.mainPage.innerHTML = '';
    }
    game.stopTimer();
    Views.mainPage(newUser);
    game.timeInterval(newUser);
  }

  //アイテムの購入の処理
  purchaseItem(userData: UserData, inputNum: number) {
    let indexEle: HTMLElement | null = null;
    let index: string | null = null;
    if (config.mainPage !== null) {
      indexEle = config.mainPage.querySelector('#box-purchase-info');
      if (indexEle) {
        index = indexEle.getAttribute('index');
      }
    }

    let userItem: Item | null = null;
    if (index) {
      userItem = userData.items[+index];
    }

    if (userItem !== null) {
      if (userData.money >= userItem.price * inputNum && inputNum <= +userItem.maxQuantity - userItem.itemPurchaseCount) {
        if (userItem.type === 'click') {
          userItem.itemPurchaseCount += Number(inputNum);
          this.updateBurgerPrice(userData, Number(index), inputNum);
          Views.updateBurgersPage(userData);
        } else {
          userItem.itemPurchaseCount += Number(inputNum);
          this.updateItemsPrice(userData, Number(index), inputNum);
          Views.updateUserInfoPage(userData);
        }
      } else if (userData.money >= userItem.price * inputNum && userItem.type === 'stock') {
        userItem.itemPurchaseCount += Number(inputNum);
        this.updateStocksPrice(userData, Number(index), inputNum);
        Views.updateUserInfoPage(userData);
      } else {
        alert('You can not buy item anymore');
      }
    }
  }

  //Burgerの情報のアップデート処理
  private updateBurgerPrice(userData: UserData, index: number, inputNum: number) {
    const price = Number(userData.items[index].price) * inputNum;
    if (userData.money < price) {
      alert('You have not enough money to buy');
    } else {
      userData.money -= price;
      userData.perClickPrice += userData.items[index].perClick * inputNum;
      Views.updateUserInfoPage(userData);
    }
  }

  //Stockの情報のアップデート処理
  private updateStocksPrice(userData: UserData, index: number, inputNum: number) {
    const price = Number(userData.items[index].price) * inputNum;

    if (userData.money < price) {
      alert('You have not enough money to buy');
    } else if (userData.items[index].name === 'ETF Stock') {
      userData.money -= price;
      userData.items[index].price += userData.items[index].price * 0.1;
      userData.perSecPrice += Math.floor(Number(userData.items[index].price) * userData.items[index].perSec * inputNum);
      Views.updateUserInfoPage(userData);
    } else if (userData.items[index].name === 'ETF Bonds') {
      userData.money -= price;
      userData.perSecPrice += Math.floor(Number(userData.items[index].price) * userData.items[index].perSec * inputNum);
      Views.updateUserInfoPage(userData);
    }
  }

  //その他のアイテムの情報のアップデート処理
  private updateItemsPrice(userData: UserData, index: number, inputNum: number) {
    const price = Number(userData.items[index].price) * inputNum;

    if (userData.money < price) {
      alert('You have not enough money to buy');
    } else {
      userData.money -= price;
      userData.perSecPrice += userData.items[index].perSec * inputNum;
      Views.updateUserInfoPage(userData);
    }
  }

  totalItemPrice(userData: UserData, index: number, inputNum: HTMLInputElement) {
    let totalItemPrice: HTMLElement | null = null;
    if (config.mainPage !== null) {
      totalItemPrice = config.mainPage.querySelector('#totalPrice');
    }

    if (+inputNum.value > 0 && totalItemPrice) {
      userData.totalItemPrice = userData.items[index].price * +inputNum.value;
      totalItemPrice.innerHTML = `total: $${userData.totalItemPrice}`;
    } else {
      userData.totalItemPrice = userData.totalItemPrice;
      if (totalItemPrice) {
        totalItemPrice.innerHTML = `total: ¥0`;
      }
    }
  }
}

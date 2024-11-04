import { config } from '../models/config';
import { displayBlock } from '../views/display';
import { UserData } from '../models/userData';
import { game } from '../index';

export class Views {
  static startGamePage() {
    const container = document.createElement('div');
    container.classList.add('initial-container');

    container.innerHTML = `
    <h2 class="initial-title">Clicker Empire Game</h2>
    <input id="yourName" class="your-name" name="yourName" type="text" placeholder="Your name"/>
    <div class="buttons">
      <button class="new-button" id="new-button">New</button>
      <button class="login-button" id="login-button">Login</button>
    </div>
    `;

    if (config.initialPage !== null) {
      config.initialPage.append(container);
    } else {
      throw new Error('要素が取得できません。');
    }
  }

  static mainPage(userData: UserData) {
    const container: HTMLDivElement = document.createElement('div');
    container.classList.add('mainPage-container');

    container.innerHTML = `
      <div id="burgers-info" class="box-left">
      </div>

      <div class="box-right">
        <div id="userInfo" class="user-info-box">
        </div>
        
        <div id="purchaseItems" class="box-container">
        </div>  

        <div id="resetSaveButton">
        </div>  
      </div>
    `;

    if (config.mainPage !== null) {
      config.mainPage.append(container);
    } else {
      throw new Error('要素が取得できません。');
    }

    const elementList = [
      { element: container.querySelector('#burgers-info') as HTMLDivElement | null, action: Views.burgersInfo },
      { element: container.querySelector('#burgers-info') as HTMLDivElement | null, action: Views.burgerImage },
      { element: container.querySelector('#userInfo') as HTMLDivElement | null, action: Views.userInfo },
      { element: container.querySelector('#purchaseItems') as HTMLDivElement | null, action: Views.boxPurchasePage },
      { element: container.querySelector('#resetSaveButton') as HTMLDivElement | null, action: Views.resetSaveButton },
    ];

    elementList.forEach(({ element, action }) => {
      if (!element) {
        throw new Error('要素が取得できません。');
      } else {
        element.append(action(userData));
      }
    });
  }

  static burgersInfo(userData: UserData) {
    const boxBurger = document.createElement('div');
    boxBurger.classList.add('count-burgers');

    boxBurger.innerHTML = `
      <p id="burgers" class="burgers">${userData.burgers} Burgers</p>
      <p class="burger-price">One click $${userData.perClickPrice}</p>
    `;

    return boxBurger;
  }

  static burgerImage(userData: UserData) {
    const container: HTMLDivElement = document.createElement('div');
    container.classList.add('image-box');

    container.innerHTML = `
    <p>Click me!!!!</p>
    <div id="burger-count" class="image-wrapper">
      <img id="burgers-image" class="click-burger" src="./image/burger-img.png" alt="" />
    </div>  
  `;

    const clickBurger = container.querySelector('#burgers-image');
    if (clickBurger) {
      clickBurger.addEventListener('click', () => {
        game.CountClickBurger(userData);
      });
    }

    return container;
  }

  static userInfo(userData: UserData) {
    const boxRight: HTMLDivElement = document.createElement('div');
    boxRight.classList.add('user-info');

    boxRight.innerHTML = `
      <p class="name">${userData.name}</p>
      <p id="age" class="age">${userData.age} years old</p>
      <p id="days" class="days">${userData.days.toString()} days</p>
      <p id="money" class="money">$${userData.money}</p>
    `;

    return boxRight;
  }

  static boxPurchasePage(userData: UserData): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('box-purchase');
    container.setAttribute('id', 'box-purchase');

    for (let i = 0; i < userData.items.length; i++) {
      container.innerHTML += `
      <div id="purchase-item" class="purchase-item" index="${i}">
        <div class="purchase-img">
          <img src="${userData.items[i].imgUrl}" alt="" />
        </div>
        <div class="purchase-info">
          <div class="items-info">
            <p class="item-name">${userData.items[i].name}</p>
            <p class="item-price">$${userData.items[i].price}</p>
          </div>
          <div class="item-count">
            <p class="Possession">${userData.items[i].itemPurchaseCount}</p>
            <p class="get-money">${userData.items[i].unitPrice}</p>
          </div>
        </div>
      </div>
    `;
    }

    const purchaseItems = container.querySelectorAll('#purchase-item');
    let itemsBox: HTMLElement | null;
    if (config.mainPage) {
      itemsBox = config.mainPage.querySelector('#purchaseItems');
      if (!itemsBox) {
        throw new Error('要素が取得できません。');
      }
    } else {
      throw new Error('要素が取得できません。');
    }

    for (let i = 0; i < purchaseItems.length; i++) {
      purchaseItems[i].addEventListener('click', () => {
        itemsBox.innerHTML = '';
        itemsBox.append(Views.itemInfoPage(userData, i));
      });
    }

    return container;
  }

  static itemInfoPage(userData: UserData, index: number): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('box-purchase-info');
    container.setAttribute('id', 'box-purchase-info');
    container.setAttribute('index', index.toString());

    container.innerHTML = `
      <div class="box-purchase-info-wrapper">
        <div class="purchase-img">
          <img src="${userData.items[index].imgUrl}" alt="" />
        </div>
        <div class="purchase-info">
          <div class="items-info">
            <p class="item-name">${userData.items[index].name}</p>
            <p class="max-purchases">Max purchases: ${userData.items[index].maxQuantity}</p>
            <p class="item-price">$ ${userData.items[index].price}</p>
            <p class="get-per-money">Get ${userData.items[index].unitPrice}</p>
          </div>
        </div>
      </div>
      <div class="select-quantity" id="select-quantity">
        <p class="text">How many would you like to buy?</p>
        <input id="inputNum" class="input-quantity" type="number" placeholder="1"/>
        <p id="totalPrice" class="total-price">total: $${userData.totalItemPrice}</p>
      </div>
      <div class="back-next-buttons">
        <button id="go-back" class="go-back">Go Back</button>
        <button id="purchase" class="purchase">Purchase</button>
      </div>
    `;

    let purchaseItems: HTMLElement | null;
    if (config.mainPage) {
      purchaseItems = config.mainPage.querySelector('#purchaseItems');
      if (!purchaseItems) {
        throw new Error('要素が取得できません。');
      }
    } else {
      throw new Error('要素が取得できません。');
    }
    const goBackButton = container.querySelector('#go-back');
    const inputNum: HTMLInputElement | null = container.querySelector('#inputNum');

    if (inputNum !== null) {
      inputNum.addEventListener('change', function () {
        game.totalItemPrice(userData, index, inputNum);
      });
    } else {
      throw new Error('要素が取得できません。');
    }

    if (goBackButton !== null) {
      goBackButton.addEventListener('click', () => {
        purchaseItems.innerHTML = '';
        purchaseItems.append(this.boxPurchasePage(userData));
      });
    } else {
      throw new Error('要素が取得できません。');
    }

    const purchaseButton = container.querySelector('#purchase');
    if (purchaseButton) {
      purchaseButton.addEventListener('click', () => {
        if (+inputNum.value < 1) {
          alert('put number');
        } else {
          game.purchaseItem(userData, +inputNum.value);
          purchaseItems.innerHTML = '';
          userData.totalItemPrice = 0;
          purchaseItems.append(this.boxPurchasePage(userData));
        }
      });
    } else {
      throw new Error('要素が取得できません。');
    }

    return container;
  }

  static resetSaveButton(userData: UserData): HTMLDivElement {
    const resetSaveButton = document.createElement('div');
    resetSaveButton.classList.add('reset-save-button');

    resetSaveButton.innerHTML = `
      <div id="reset" class="reset-button">
        <img src="./image/reset-icon.png" alt="" />
      </div>
      <div id="save" class="save-button">
        <img src="./image/save-icon.png" alt="" />
      </div>
    `;

    const saveButton: HTMLButtonElement | null = resetSaveButton.querySelector('#save');
    const resetButton: HTMLButtonElement | null = resetSaveButton.querySelector('#reset');

    if (saveButton !== null) {
      saveButton.addEventListener('click', () => {
        let jsonEncoded = JSON.stringify(userData);
        localStorage.setItem(userData.name, jsonEncoded);
        alert('Save your data!! \n Please put your name when your login again.');

        if (config.mainPage && config.initialPage) {
          config.mainPage.innerHTML = '';
          config.initialPage.innerHTML = '';
          displayBlock(config.initialPage);
          game.stopTimer();
          // const game = Controller.getInstance();
          game.startGame();
          // Controller.startGame();
        } else {
          throw new Error('要素が取得できません。');
        }
      });
    }

    if (resetButton !== null) {
      resetButton.addEventListener('click', () => {
        game.resetUserData();
      });
    } else {
      throw new Error('要素が取得できません。');
    }

    return resetSaveButton;
  }

  static updateBurgersPage(userData: UserData) {
    let burgersInfo: HTMLElement | null = null;
    if (config.mainPage) {
      burgersInfo = config.mainPage.querySelector('#burgers-info');
      if (!burgersInfo) {
        throw new Error('要素が取得できません。');
      }
    } else {
      throw new Error('要素が取得できません。');
    }
    burgersInfo.innerHTML = '';
    burgersInfo.append(this.burgersInfo(userData));
    burgersInfo.append(this.burgerImage(userData));
  }

  static updateUserInfoPage(userData: UserData) {
    let userInfo: HTMLElement | null = null;
    if (config.mainPage !== null) {
      userInfo = config.mainPage.querySelector('#userInfo');
      if (!userInfo) {
        throw new Error('要素が取得できません。');
      }
    } else {
      throw new Error('要素が取得できません。');
    }

    userInfo.innerHTML = '';
    userInfo.append(Views.userInfo(userData));
  }
}

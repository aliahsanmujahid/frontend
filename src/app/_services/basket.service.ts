import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../_models/basket';
import { Product } from '../_models/product';
import {v4 as uuid4} from 'uuid';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  delevary = 50;


  constructor(private http: HttpClient,private router: Router,private toastr: ToastrService) { }


  getBasket() {
    const basket: Basket = JSON.parse(localStorage.getItem('basket'));
    if(basket){
    this.basketSource.next(basket);
    this.calculateTotals();
    }
  }

  setBasket(basket: IBasket) {
    this.basketSource.next(basket);
    this.calculateTotals();
    return localStorage.setItem('basket', JSON.stringify(basket));

  }
  getCurrentBasketValue() {
    return this.basketSource.value;
  }
  addItemToBasket(item: Product, quantity = 1) {
    const check = this.getCurrentBasketValue();
    if(check !== null && check.shopId !== item.appUserId){
     this.basketSource.next(null);
     this.basketTotalSource.next(null);
     localStorage.removeItem('basket');
     this.toastr.warning('Basket Deleted','Need To Be Same Shop');
    }
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.shopId = item.appUserId;
    basket.sellername = item.sellerName;
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }
  
  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const item = items.filter(i => i.id === itemToAdd.id);
    if(item.length === 0){
      this.toastr.info('Product Added');
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }else{
      var notsame:Number = 0;
      var notsame2:Number = 1;
      item.forEach( i => {
      if(JSON.stringify(i.color) === JSON.stringify(itemToAdd.color)
      && JSON.stringify(i.size) === JSON.stringify(itemToAdd.size)){
        i.quantity += quantity;
        notsame = 0;
        notsame2 = 0;
        this.toastr.info('Product Added.Quantity: '+i.quantity.toString());
      }else{
        notsame = 1;
      }
      });
      if(notsame == 1 && notsame2 == 1){
        itemToAdd.quantity = quantity;
        items.push(itemToAdd);
        this.toastr.info('Product Added');
      }
      
    }
    
    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket', JSON.stringify(basket));
    return basket;
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const delevary = this.delevary;
    const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + delevary;
    this.basketTotalSource.next({delevary, total, subtotal});
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some(x => x.eachid === item.eachid)) {
      basket.items = basket.items.filter(i => i.eachid !== item.eachid);
      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.router.navigateByUrl('');
        this.deleteBasket(); 
      }
    }
  }
  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.eachid === item.eachid);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.eachid === item.eachid);
    if (basket.items[foundItemIndex].quantity > 1) {
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    }
    // else {
    //   this.removeItemFromBasket(item);
    // }
  }

  deleteBasket() {
    localStorage.removeItem('basket');
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
  }

  private mapProductItemToBasketItem(item: Product, quantity: number): IBasketItem {
    return {
      eachid: uuid4(),
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.image1,
      quantity,
      color : item.colors,
      size : item.sizes,
    }
  }
  
}

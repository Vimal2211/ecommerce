import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private wishlistArraySource = new BehaviorSubject<number>(this.getWishlist().length);
  wishlistCount$ = this.wishlistArraySource.asObservable();

  
  products: any[] = [
    {
      id: 1,
      name: 'Product 1',
      price: 29.99,
      description: 'Description for Product 1',
      quantity: 1,
      imageUrl: '../assets/1722004334_5839977.jpg',
      fileName: 'p1'
    },
    {
      id: 2,
      name: 'Product 2',
      price: 49.99,
      description: 'Description for Product 2',
      quantity: 1,
      imageUrl: '../assets/1711019155_9426074.webp',
      fileName: 'p2'
    },
    {
      id: 3,
      name: 'Product 3',
      price: 19.99,
      description: 'Description for Product 3',
      quantity: 1,
      imageUrl: '../assets/1713943206_9376927.webp',
      fileName: 'p3'
    },
    {
      id: 4,
      name: 'Product 3',
      price: 10.99,
      description: 'Description for Product 3',
      quantity: 1,
      imageUrl: '../assets/1731403405_1302137.webp',
      fileName: 'p4'
    },
  ];

  addToCartData: any = [];
  private dataArraySource = new BehaviorSubject<any[] | null>(null);
  currentDataArray: Observable<any[] | null> = this.dataArraySource.asObservable();

  constructor() {
    // localStorage.removeItem('key')
  }


  setDate(data: any[]) {
    if (data.length != 0) {
      let string = JSON.stringify(data)
      localStorage.setItem("key", string)
    } else {

    }
  }

  getData() {
    return localStorage.getItem("key")
  }


  setAnotherData(value: any) {
    this.dataArraySource.next(value)
    let shareData = JSON.stringify(this.dataArraySource.value)
    localStorage.setItem("share", shareData)
  }
  getAnotherData() {
    return localStorage.getItem("share")
  }

  setAddToCart(item: any) {
    console.log(item);
  
    let cart = JSON.parse(localStorage.getItem("cart") || '[]');
    const existingItemIndex = cart.findIndex((x: any) => x.id === item.id);
    if (existingItemIndex !== -1) {
      const existingItem = cart[existingItemIndex];
      existingItem.selectedQuantity = item.selectedQuantity;
      existingItem.totalPrice = existingItem.selectedQuantity * existingItem.price;
    } else {
      item.totalPrice = item.price * item.selectedQuantity;
      cart.push(item);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
      this.dataArraySource.next(cart.length);
  }
  

  getAddToCart() {
    return JSON.parse(localStorage.getItem("cart") || '[]');
  }

  getlength(){
    return this.dataArraySource.asObservable();

  }

  /** Add Item to Wishlist */
  setWishlist(item: any) {
    console.log(item);

    let wishlist = JSON.parse(localStorage.getItem("wishlist") || '[]');
    const existingItemIndex = wishlist.findIndex((x: any) => x.id === item.id);
    
    if (existingItemIndex === -1) {
      wishlist.push(item);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    this.wishlistArraySource.next(wishlist.length); // Update Wishlist Count
  }

  /** Get Wishlist Items */
  getWishlist() {
    return JSON.parse(localStorage.getItem("wishlist") || '[]');
  }

  /** Get Wishlist Count */
  getWishlistLength() {
    return this.wishlistCount$;
  }

  /** Remove Item from Wishlist */
  removeFromWishlist(itemId: number) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || '[]');
    wishlist = wishlist.filter((x: any) => x.id !== itemId);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    this.wishlistArraySource.next(wishlist.length); // Update Wishlist Count
  }

}

import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SharedService } from '../services/shared.service';
import {  Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-selected-product',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './selected-product.component.html',
  styleUrl: './selected-product.component.scss'
})
export class SelectedProductComponent implements OnInit {
  receivedArray: any;
  selectedQuantity:any = 0;
  productArray: any[] = [];
  product: any;
  disableIncrement = false;
  disableDecrement = false;
  disablAddToCard =false
  products: any[] = [
    {
      id: 1,
      name: 'Product 1',
      price: 29.99,
      description: 'Description for Product 1',
      quantity: 1,
      imageUrl: '../assets/1722004334_5839977.jpg'
    },
    {
      id: 2,
      name: 'Product 2',
      price: 49.99,
      description: 'Description for Product 2',
      quantity: 1,
      imageUrl: '../assets/1711019155_9426074.webp'
    },
    {
      id: 3,
      name: 'Product 3',
      price: 19.99,
      description: 'Description for Product 3',
      quantity: 1,
      imageUrl: '../assets/1713943206_9376927.webp'
    },
    {
      id: 4,
      name: 'Product 3',
      price: 10.99,
      description: 'Description for Product 3',
      quantity: 1,
      imageUrl: '../assets/1731403405_1302137.webp'
    },

  ];
  productForm!: FormGroup;

  data: any = []
  constructor(private dataService: SharedService, private route: Router, private fb: FormBuilder) {

    this.productForm = this.fb.group({
      id: [''],
      name: [''],
      price: [''],
      description: [''],
      quantity: [0],
      imageUrl: [''],
      fileName: [''],
      selectedQuantity:[0]
    })

  }
  selectedValue: any = []
  ngOnInit(): void {
    this.dataService.getAnotherData()
    const jsonVal = this.dataService.getAnotherData()
    if (jsonVal) {
      this.selectedValue.push(JSON.parse(jsonVal))
      this.productForm.patchValue(this.selectedValue[0])
    }
  
    const cart = JSON.parse(localStorage.getItem('cart')||'[]');
    const existingItemIndex = cart.findIndex((x: any) => x.id ===  this.productForm.get('id')?.value);
    console.log(existingItemIndex)
    if(existingItemIndex!= undefined){
      this.selectedQuantity = cart[existingItemIndex]?.selectedQuantity | 0;
      if(this.selectedQuantity >= this.selectedValue[0].quantity){
        this.disableIncrement = true
        this.disablAddToCard = true
      }
    }

  }


  incrementQuantity(index: number): void {
    if (this.selectedQuantity < this.selectedValue[index].quantity) {
        this.selectedQuantity += 1;
        this.productForm.get('selectedQuantity')?.setValue(this.selectedQuantity);
        this.productForm.get('totalPrice')?.setValue(this.selectedQuantity * this.selectedValue[index].price);
    }
    this.updateButtonStates(index);
}

decrementQuantity(index: number): void {
    if (this.selectedQuantity > 0) {
        this.selectedQuantity -= 1;
        this.productForm.get('selectedQuantity')?.setValue(this.selectedQuantity);
        this.productForm.get('totalPrice')?.setValue(this.selectedQuantity * this.selectedValue[index].price);
    }
    this.updateButtonStates(index);
}

private updateButtonStates(index: number): void {
    const maxQuantity = this.selectedValue[index].quantity;
    const quantity = this.selectedQuantity;

    this.disableIncrement = quantity >= maxQuantity;
    this.disableDecrement = quantity <= 0;

    this.disablAddToCard = quantity >= maxQuantity;
    console.log(' this.disablAddToCard: ',  this.disablAddToCard);
}


  addtoCart() {
    this.dataService.setAddToCart(this.productForm.value);
    this.route.navigateByUrl('/addtocart')
  }

  backTo(){
    this.route.navigateByUrl('/product-list')
  }
}

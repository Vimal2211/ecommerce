import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addtocart',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  providers:[NavbarComponent],
  templateUrl: './addtocart.component.html',
  styleUrl: './addtocart.component.scss'
})
export class AddtocartComponent {
  cart: any = [];
  length: any



  constructor(private dataService: SharedService,private nav:NavbarComponent,private router: Router) {
    this.dataService.getAddToCart();
    this.cart = this.dataService.getAddToCart()
    console.log('this.cart: ', this.cart);
    this.length = this.dataService.getlength()
    this.calculateTotalPrice()
  }

  remove(data: any) {
    this.cart = this.cart.filter((item: any) => item !== data);
    let string = JSON.stringify(this.cart)
    localStorage.setItem("cart", string);
    // this.nav.addTocart();
    window.location.reload();
  }

  calculateTotalPrice(): number {
    return this.cart.reduce((sum: any, product: any) => sum + product.totalPrice, 0);
  }

  placeOrder() {
    const orderText = this.generateOrderMessage();
    const encodedMessage = encodeURIComponent(orderText);
    const whatsappURL = `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');
  }

  backtoHome(){
    this.router.navigate(['product-list'])
  }


  private generateOrderMessage(): string {
    const itemsText = this.cart
      .map((item: any) => `${item.quantity} x ${item.name} @ $${item.price}`)
      .join('\n');
    return `Hello, I would like to place an order:\n\n${itemsText}\n\nTotal: $${this.calculateTotalPrice()}`;
  }

} 

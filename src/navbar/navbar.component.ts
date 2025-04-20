import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  length: any = 0
  cart: any = [];
  constructor(private route: Router, private dataService: SharedService) {

  }

  isDropdownOpen: boolean = false;
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  ngOnInit() {
    this.dataService.getWishlistLength().subscribe(count => {
      this.wishlistCount = count;
    });

    this.dataService.getlength().subscribe(data => {
      this.length = data
    })
    
    this.cart = this.dataService.getAddToCart()
    this.length = this.cart.length
  }
  gotoadd() {
    this.route.navigateByUrl('add')
  }

  home() {
    this.route.navigateByUrl('product-list')
  }

  addTocart() {
    this.route.navigateByUrl('addtocart')
  }

  logOut(){
    localStorage.removeItem('username');
    localStorage.removeItem('pass');
    this.route.navigateByUrl('')
  }

  search() {
    console.log("Search Clicked");
  }
  
  profile() {
    this.route.navigateByUrl('profile');
  }

  order() {
    this.route.navigateByUrl('orders')
    console.log('orders');
  }
  
  wishlist() {
    this.route.navigateByUrl('wishlist')
    console.log('wishlist');
  }

  isSearchVisible = false;
  wishlistCount = 0;
  cartCount = 0;

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
    console.log('this.isSearchVisible: ', this.isSearchVisible);
  }

  performSearch(event: any) {
    console.log('event: ', event);
    const query = event.target.value;
    // Implement search functionality here
  }
  

}

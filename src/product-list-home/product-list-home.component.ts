import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-product-list-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list-home.component.html',
  styleUrl: './product-list-home.component.scss'
})
export class ProductListHomeComponent {
  @Input() products: any[] = [];
  // products: any = []
  constructor(private router: Router, private shared: SharedService) {

    const storedData = localStorage.getItem('key');
    let existingProducts: any[] = [];
    if (storedData) {
      existingProducts = JSON.parse(storedData);
      this.products = [...existingProducts]
    }
  }

  ngOnInit() {
    this.loadProducts(); // Load products and sync wishlist status
  }

  gotopage(data: any) {
    this.shared.setAnotherData(data)
    this.router.navigate(['selected-product'])

  }

  // toggleWishlist(product: any) {
  //   console.log('product: ', product);
  //   product.isWishlist = !product.isWishlist;  // Toggle the heart icon highlight
  //   if (product.isWishlist) {
  //     product.wishlistCount++;  // Increment the wishlist count
  //     this.shared.setWishlist(product);

  //   } else {
  //     product.wishlistCount--;  // Decrement the wishlist count
  //   this.shared.removeFromWishlist(product.id);

  //   }
  // }

  toggleWishlist(product: any) {
    console.log('Product: ', product);
    
    let wishlist = this.shared.getWishlist(); // Get wishlist from localStorage
    const index = wishlist.findIndex((item: any) => item.id === product.id);
  
    if (index === -1) {
      // Item is not in wishlist, add it
      product.isWishlist = true;
      product.wishlistCount++;  // Increment count
      wishlist.push(product);
      this.shared.setWishlist(product);
    } else {
      // Item exists, remove it
      product.isWishlist = false;
      product.wishlistCount--;  // Decrement count
      wishlist.splice(index, 1);
      this.shared.removeFromWishlist(product.id);
    }
  
    localStorage.setItem("wishlist", JSON.stringify(wishlist)); // Update localStorage
  }

  loadProducts() {
    let wishlist = this.shared.getWishlist(); // Fetch wishlist from localStorage
  
    this.products = this.products.map(product => {
      // Check if the product exists in wishlist
      const isWishlisted = wishlist.some((item: any) => item.id === product.id);
      return { ...product, isWishlist: isWishlisted };
    });
  }
  

  
}

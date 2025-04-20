import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { SelectedProductComponent } from '../selected-product/selected-product.component';
import { ProductListHomeComponent } from '../product-list-home/product-list-home.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SelectedProductComponent, ProductListHomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [SharedService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  products: any[] = [
    {
      id: 1,
      name: 'Solids: Camel Brown',
      price: 29.99,
      description: '96% Cotton 4% Lycra1 Machine Wash',
      quantity: 8,
      imageUrl: '../assets/1722004334_5839977.jpg',
      fileName: 'p1'
    },
    {
      id: 2,
      name: 'TSS Originals: Immortal',
      price: 49.99,
      description: 'Premium Heavy Gauge Fabric 100% Cotton ',
      quantity: 3,
      imageUrl: '../assets/1711019155_9426074.webp',
      fileName: 'p2'
    },
    {
      id: 3,
      name: 'Wanderlust',
      price: 19.99,
      description: 'This garment has undergone a special process that results in variations of shading and colour.',
      quantity: 4,
      imageUrl: '../assets/1713943206_9376927.webp',
      fileName: 'p3'
    },
    {
      id: 4,
      name: 'Supimas: Peach',
      price: 10.99,
      description: '100% Supima Cotton Machine Wash',
      quantity: 5,
      imageUrl: '../assets/1731403405_1302137.webp',
      fileName: 'p4'
    },
  ];

  constructor(private router: Router, private shared: SharedService) {
    // this.shared.setDate(this.products)
    if (this.shared.getData() == null){
      this.shared.setDate(this.products)
    }
      const storedData = localStorage.getItem('key');
    let existingProducts: any[] = [];
    if (storedData) {
      existingProducts = JSON.parse(storedData);
      this.products = [...existingProducts]
    }
  }
  gotopage(data: any) {
    this.shared.setAnotherData(data)
    this.router.navigate(['selected-product'])

  }
}

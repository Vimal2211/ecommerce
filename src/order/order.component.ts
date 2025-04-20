import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  orders: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const storedOrders = localStorage.getItem('orders');
    this.orders = storedOrders ? JSON.parse(storedOrders) : [
      {
        id: 'ORD12345',
        name: 'Supimas: Peach',
        image: 'assets/1731403405_1302137.webp',
        price: 799,
        status: 'Shipped',
        address: '123 Street, New York, USA',
        date: '2025-03-15',
        deliveryDate: '2025-03-20',
        description: 'A premium cotton T-shirt with a soft touch.',
        showDetails: false
      },
      {
        id: 'ORD67890',
        name: 'Wanderlust',
        image: 'assets/1713943206_9376927.webp',
        price: 1299,
        status: 'Processing',
        address: '456 Avenue, Los Angeles, USA',
        date: '2025-03-16',
        deliveryDate: '2025-03-22',
        description: 'A stylish hoodie made with breathable fabric.',
        showDetails: false
      },
      {
        id: 'ORD54321',
        name: 'TSS Originals: Immortal',
        image: 'assets/1711019155_9426074.webp',
        price: 2499,
        status: 'Delivered',
        address: '789 Boulevard, Chicago, USA',
        date: '2025-03-12',
        deliveryDate: '2025-03-18',
        description: 'Classic denim jacket with a timeless design.',
        showDetails: false
      }
    ];
    this.updateLocalStorage();
  }

  toggleDetails(index: number) {
    this.orders[index].showDetails = !this.orders[index].showDetails;
    console.log('this.orders[index].showDetails: ', this.orders[index].showDetails);
    console.log('this.orders: ', this.orders);

  }

  cancelOrder(index: number) {
    this.orders[index].status = 'Cancelled';
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Processing': return 'bg-warning text-dark';
      case 'Shipped': return 'bg-info text-dark';
      case 'Delivered': return 'bg-success text-white';
      case 'Cancelled': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }

  goToHome() {
    this.router.navigate(['/product-list']);
  }
}

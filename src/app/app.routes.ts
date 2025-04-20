import { Routes } from '@angular/router';
import { LoginPageComponent } from '../login-page/login-page.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { SelectedProductComponent } from '../selected-product/selected-product.component';
import { AddProductComponent } from '../add-product/add-product.component';
import { AddtocartComponent } from '../addtocart/addtocart.component';
import { LoginComponent } from '../login/login.component';
import { WhishlistComponent } from '../whishlist/whishlist.component';
import { ProfileComponent } from '../profile/profile.component';
import { OrderComponent } from '../order/order.component';

export const routes: Routes = [
    {
        path: '', component: LoginComponent
    },
    {
        path: 'product-list', component: ProductListComponent
    },
    {
        path: 'selected-product', component: SelectedProductComponent
    },
    {
        path: 'add', component: AddProductComponent
    },
    {
        path: 'addtocart', component: AddtocartComponent
    },

    // {
    //     path: 'login', component: LoginComponent
    // },
    {
        path: 'wishlist', component: WhishlistComponent
    },
    {
        path: 'profile', component: ProfileComponent
    },
    {
        path: 'orders', component: OrderComponent
    },
];

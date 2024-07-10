import { Routes } from '@angular/router';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SuccessComponent } from './components/success/success.component';

export const routes: Routes = [
  {
  path:'checkout',
  component: CheckoutComponent
  },
  {
    path:'success',
    component: SuccessComponent
    },
  {
    path:'',
    component: ProductListComponent
    }
];

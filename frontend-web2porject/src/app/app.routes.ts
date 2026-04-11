import { Routes } from '@angular/router';
import { Products } from './pages/products-list/products-list';
import { ProductDetails } from './pages/product-details/product-details';
import { ProductForm } from './pages/product-form/product-form';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ShoppingCart } from './pages/shopping-cart/shopping-cart';
import { Orders } from './pages/orders/orders';
import { authGuard } from './services/auth-guard';
import { OrderDetails } from './pages/order-details/order-details';
import { adminGuard } from './services/admin-guard';
import { AdminProductsList } from './pages/admin-products-list/admin-products-list';
import { PaymentSuccess } from './pages/payment-success/payment-success';
import { PaymentCancel } from './pages/payment-cancel/payment-cancel';

export const routes: Routes = [
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: 'products', component: Products, title: 'Store page' },
  {path: 'admin/products', component: AdminProductsList, canActivate: [adminGuard], title: 'Store Products' },
  {path: 'admin/products/create', component: ProductForm, canActivate: [adminGuard],  title: 'Product form' },
  {path: 'products/:id', component: ProductDetails, canActivate: [authGuard], title: 'Product details' },
  {path: 'register', component: Register },
  {path: 'login', component: Login},
  {path: 'cart', component: ShoppingCart, canActivate: [authGuard], title: "Shopping Cart"},
  {path: 'orders', component: Orders, canActivate: [authGuard]},
  {path: 'orders/:id', component: OrderDetails,canActivate: [authGuard], title: 'Order details' },
  {path: 'payment-success', component: PaymentSuccess, canActivate: [authGuard],  title: 'Payment success' },
  {path: 'payment-cancel', component: PaymentCancel,canActivate: [authGuard],  title: 'Payment cancel' },
];

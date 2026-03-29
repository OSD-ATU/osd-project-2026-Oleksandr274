import { Component, inject, numberAttribute, OnInit } from '@angular/core';
import { UserCartService } from '../../services/user-cart.service';
import { AsyncPipe, CurrencyPipe, } from '@angular/common';
import { CartItem } from '../../models/cartItem.interface';
import { Observable } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.interface';
import { CheckoutService } from '../../services/checkout.service';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-shopping-cart',
  imports: [MatButton, MatIcon, CurrencyPipe, ReactiveFormsModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatIconModule, MatRadioModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.scss',
})
export class ShoppingCart implements OnInit {
  private cartService = inject(UserCartService);
  private productService = inject(ProductService)
  private orderService = inject(OrderService)
  private checkoutService = inject(CheckoutService)

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  cartItems?: CartItem[];
  products: Product[] = [];
  orderForm: FormGroup;


  constructor() {
    this.orderForm = this.fb.group({
      shippingAddress1: ['', [Validators.required]],
      shippingAddress2: [''],
      city: ['', [Validators.required]],
      eircode: ['',],
      phone: ['', [Validators.required, Validators.pattern('^\\+(353)\\d{9}$')]]
    })
  }


  ngOnInit() {
    this.cartService.getUserCart().subscribe({
      next: data => {
        this.cartItems = data

        this.cartItems?.forEach(item => {
          this.productService.getProductById(item.productId).subscribe({
            next: product => {
              this.products?.push(product)
            }
          })
        })
      },
      error(err) {
        console.log(err)
      },
    })
  }

  getCartProduct(id: string) {
    return this.products?.find(p => p._id == id)
  }

  onCheckout() {
    this.checkoutService.checkout(this.cartItems!).subscribe(
      async (res) => {
        await this.placeOrder(this.orderForm.value)
        console.log(res);
        window.location.href = res.url; //redirect
      },
      (err) => {
        console.log('err:' + err.message);
      }
    )

  }

  placeOrder(orderInfo: any) {
    if (this.cartItems && this.cartItems.length > 0) {
      const order: Order = {
        items: this.cartItems,
        shippingAddress1: orderInfo['shippingAddress1'],
        shippingAddress2: orderInfo['shippingAddress2'],
        city: orderInfo['city'],
        eircode: orderInfo['eircode'],
        phone: orderInfo['phone']
      }
      this.orderService.createOrder(order).subscribe(
        (res) => {

        },
        (err: Error) => {
          console.log(err.message);
          this.openErrorSnackBar(err.message);

        })
    }
  }

  get shippingAddress1() {
    return this.orderForm.get('shippingAddress1');
  }
  get shippingAddress2() {
    return this.orderForm.get('shippingAddress2');
  }
  get city() {
    return this.orderForm.get('city');
  }
  get eircode() {
    return this.orderForm.get('eircode');
  }
  get phone() {
    return this.orderForm.get('phone');
  }

  openErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 15000,
    });
  }

  openSuccessSnackBar(message: string): void {
    this.snackBar.open(message, 'Ok', {
      duration: 15000,
    });
  }

}

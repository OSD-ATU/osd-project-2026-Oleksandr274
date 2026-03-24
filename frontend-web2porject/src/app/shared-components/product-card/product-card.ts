import { Component, inject, input } from '@angular/core';
import { Product } from '../../models/product.interface';
import { MatCardActions } from "@angular/material/card";
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { UserCartService } from '../../services/user-cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, MatButton, CurrencyPipe, MatIcon],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  private cartService = inject(UserCartService)
  private snackBar = inject(MatSnackBar);


  product = input.required<Product>();

  onAddToCart() {

    this.cartService.addToCart(this.product()._id!!).subscribe({
      next: res => {
        let message = "Product was added to your cart";
        this.openSuccessSnackBar(message);
      },
      error: (err: Error) => {
        this.openErrorSnackBar(err.message);
      }
    })
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

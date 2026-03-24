import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../models/product.interface';
import { AsyncPipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { ConfirmDialog } from '../../shared-conponents/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIcon } from "@angular/material/icon";
import { User } from '../../models/user.interface';
import { AuthCustomService } from '../../services/auth-custom.service';
import { UserCartService } from '../../services/user-cart.service';


@Component({
  selector: 'app-product-details',
  imports: [AsyncPipe, MatButton, MatSnackBarModule, TitleCasePipe, CurrencyPipe, MatIcon],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails {

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private authService = inject(AuthCustomService);
  private cartService = inject(UserCartService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  id: string = "";
  product$: Observable<Product> | undefined
  currentUser$: BehaviorSubject<User | null>

  constructor() {
    this.currentUser$ = this.authService.currentUser$
  }

  quantityForCart: number = 1;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || "";

    if (this.id) {
      this.product$ = this.productService.getProductById(this.id)

    }
  }

  onAddToCart() {

    this.cartService.addToCart(this.id).subscribe({
      next: res => {
        let message = "Product was added to your cart";
        this.openSuccessSnackBar(message);
      },
      error: (err: Error) => {
        this.openErrorSnackBar(err.message);
      }
    })
  }

  deleteProduct(): void {

    if (this.id) {
      this.productService.deleteProduct(this.id)
        .subscribe({
          next: response => {
            let message = 'Product has been deleted'
            this.openSuccessSnackBar(message);
            this.router.navigateByUrl('/products')
          },
          error: (message) => {
            console.log(message);
            this.openErrorSnackBar(message);
          }
        })
    }
  }

  openConfirmDeleteDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '450px',
      data: {
        title: "Delete Product ",
        message: "Are you sure you want to delete a product"
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deleteProduct();
      }
    });

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

  addQuantity():void{
    this.quantityForCart += 1;
  }
  removeQuantity():void{
    if(this.quantityForCart > 0){
      this.quantityForCart -= 1;
    }
  }



}

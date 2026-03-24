import { Component, inject, signal } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../models/order.interface';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { MatButton } from '@angular/material/button';
import { ConfirmDialog } from '../../shared-components/confirm-dialog/confirm-dialog';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/user.interface';
import { AuthCustomService } from '../../services/auth-custom.service';
import { UpdateOrderDialog } from '../../shared-components/update-order-dialog/update-order-dialog';

@Component({
  selector: 'app-order-details',
  imports: [CurrencyPipe, MatButton, MatSnackBarModule,],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss',
})
export class OrderDetails {

  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private authService = inject(AuthCustomService)
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  private status = signal('');

  currentUser$: BehaviorSubject<User | null>
  id: string = "";
  order?: Order

  orderProducts?: Product[] = []

  constructor() {
    this.currentUser$ = this.authService.currentUser$
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || "";

    if (this.id) {
      // this.order$ = this.orderService.getOrderById(this.id)
      this.orderService.getOrderById(this.id).subscribe({
        next: data => {
          this.order = data
          this.status.set(this.order.status ?? '')

          if (this.order.items) {
            this.order.items.forEach(item => {
              this.productService.getProductById(item.productId).subscribe({

                next: productData => {
                  this.orderProducts?.push(productData)
                }
              })
            })
          }
        },
        error(err) {
          console.log(err)
        },
      });
    }
  }

  getOrderProduct(id: string) {
    return this.orderProducts?.find(p => p._id == id)
  }

  deleteOrder() {
    if (this.id) {
      this.orderService.deleteOrder(this.id)
        .subscribe({
          next: response => {
            let message = 'Order has been deleted'
            this.openSuccessSnackBar(message);
            this.router.navigateByUrl('/orders')
          },
          error: (message) => {
            console.log(message);
            this.openErrorSnackBar(message);
          }
        })
    }
  }

  updateOrder() {
    if (this.id) {
      this.orderService.updateOrder(this.id, this.status())
        .subscribe({
          next: response => {
            this.order = response
            let message = 'Order was updated'
            this.openSuccessSnackBar(message);
            this.router.navigateByUrl(`/orders/${this.id}`)
          },
          error: (message) => {
            console.log(message);
            this.openErrorSnackBar(message);
          }
        })
    }
  }

  openUpdateOrderDialog(): void {
    const dialogRef = this.dialog.open(UpdateOrderDialog, {
      data: { status: this.status() },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.status.set(result);
        console.log(this.status())
        this.updateOrder()
      }
    });
  }

  openConfirmDeleteDialog(): void {

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '450px',
      data: {
        title: "Delete Order ",
        message: "Are you sure you want to delete this order"
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deleteOrder();
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
}

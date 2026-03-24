import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../../models/user.interface';
import { AuthCustomService } from '../../services/auth-custom.service';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-admin-products-list',
  imports: [AsyncPipe, CurrencyPipe, MatFormField, MatLabel, MatSelect, MatOption, RouterLink],
  templateUrl: './admin-products-list.html',
  styleUrl: './admin-products-list.scss',
})
export class AdminProductsList {
  private productService = inject(ProductService)
  private authService = inject(AuthCustomService)
  private userService = inject(UserService)
  private route = inject(ActivatedRoute);
  products$!: Observable<Product[]>;
  currentUser$: BehaviorSubject<User | null>
  users$?: Observable<User[]>

  selectedUser = signal<string>(''); //default

  constructor() {
    this.currentUser$ = this.authService.currentUser$
  }

  ngOnInit(): void {

    this.users$ = this.userService.getAllUsers()
    this.products$ = this.productService.getProducts('');

    this.route.queryParamMap.subscribe(params => {
      const userIdParam = params.get('userId');
      if (userIdParam) {
        this.selectedUser.set(userIdParam);
      } else {
        this.selectedUser.set('');
      }
    })

  }

  userEffect = effect(() => {
    if (this.currentUser$.getValue()?.role === 'admin') {
      this.getListOfProducts()
    }
  });

  getListOfProducts(): void {
      this.products$ = this.productService.getProducts('');
  }
}

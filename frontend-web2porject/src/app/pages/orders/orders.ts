import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Order } from '../../models/order.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthCustomService } from '../../services/auth-custom.service';
import { User } from '../../models/user.interface';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatSelect, MatOption } from "@angular/material/select";
import { UserService } from '../../services/user.service';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [AsyncPipe, CurrencyPipe, MatFormField, MatLabel, MatSelect, MatOption, RouterLink, RouterLinkActive],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders implements OnInit {
  private orderService = inject(OrderService)
  private authService = inject(AuthCustomService)
  private userService = inject(UserService)
  private route = inject(ActivatedRoute);
  orders$!: Observable<Order[]>;
  currentUser$: BehaviorSubject<User | null>
  users$?: Observable<User[]>


  selectedUser = signal<string>(''); //default
  noTotalOrders = signal<number>(0);
  noPlacedOrders = signal<number>(0);
  noShippedOrders = signal<number>(0);
  noDeliveredOrders = signal<number>(0);

  constructor() {
    this.currentUser$ = this.authService.currentUser$
  }

  ngOnInit(): void {
    if (this.currentUser$.getValue()?.role === 'admin') {
      this.users$ = this.userService.getAllUsers()
      this.orders$ = this.orderService.getAllOrders();
      this.orderService.getOrderStats().subscribe(
        (res) => {
          this.noTotalOrders.set(res.body.noTotalOrders);
          this.noPlacedOrders.set(res.body.noPlacedOrders);
          this.noShippedOrders.set(res.body.noShippedOrders);
          this.noDeliveredOrders.set(res.body.noDeliveredOrders);
        }
      )

      this.route.queryParamMap.subscribe(params => {
        const userIdParam = params.get('userId');
        if (userIdParam) {
          this.selectedUser.set(userIdParam);
        } else {
          this.selectedUser.set('');
        }
      })
    } else {
      this.orders$ = this.orderService.getUserOrders();
    }
  }

  userEffect = effect(() => {
    if(this.currentUser$.getValue()?.role === 'admin'){
      this.getListOfOrders()
    }
  });

  getListOfOrders(): void {
    if (this.selectedUser() != '' && this.selectedUser() != undefined) {
      this.orders$ = this.orderService.getUserOrders(this.selectedUser());
    } else {
      this.orders$ = this.orderService.getAllOrders()
    }
  }

}

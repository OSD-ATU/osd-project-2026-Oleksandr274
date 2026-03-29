import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { Router } from '@angular/router';
import { UserCartService } from '../../services/user-cart.service';

@Component({
  selector: 'app-payment-success',
  imports: [MatIconModule, MatButton, MatIcon],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.scss',
})
export class PaymentSuccess implements OnInit{
  router = inject(Router);
  private cartService = inject(UserCartService);

  goHome() {
    this.router.navigate(['/']);
  }


  ngOnInit() {
    this.cartService.emptyUserCart().subscribe()
  }
}

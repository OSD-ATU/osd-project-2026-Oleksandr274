import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-cancel',
  imports: [MatIconModule, MatButton, MatIcon],
  templateUrl: './payment-cancel.html',
  styleUrl: './payment-cancel.scss',
})
export class PaymentCancel {
  router = inject(Router);
  
  goHome() {
    this.router.navigate(['/']);
  }
}

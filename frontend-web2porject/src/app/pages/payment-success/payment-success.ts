import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  imports: [MatIconModule, MatButton, MatIcon],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.scss',
})
export class PaymentSuccess {
  router = inject(Router);
  
  goHome() {
    this.router.navigate(['/']);
  }

}

import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthCustomService } from '../../services/auth-custom.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/user.interface';
import { BehaviorSubject } from 'rxjs';
import { UserCartService } from '../../services/user-cart.service';
import { CartItem } from '../../models/cartItem.interface';
import {initDropdowns} from 'flowbite';

@Component({
  selector: 'app-header-actions',
  imports: [MatButton, MatIconButton, MatIcon, MatBadgeModule, RouterLink],
  templateUrl: './header-actions.html',
  styleUrl: './header-actions.scss',
})
export class HeaderActions implements OnInit {
  private authService = inject(AuthCustomService)
  public cartService = inject(UserCartService)
  private router = inject(Router);
  currentUser$: BehaviorSubject<User | null>
  isAuthenticated: boolean = false;

  userCart: CartItem[] = [];

  constructor() {
    this.currentUser$ = this.authService.currentUser$
  }

  ngOnInit(): void {
    initDropdowns();
    this.authService.isAuthenticated$.subscribe((status) => {
      this.isAuthenticated = status
    })

    if(this.isAuthenticated){
      this.cartService.getUserCart();      
    }
  }

  onLogOut() {
    this.authService.logout()
    console.log('user logged out')
    this.router.navigateByUrl('/');
  }

}

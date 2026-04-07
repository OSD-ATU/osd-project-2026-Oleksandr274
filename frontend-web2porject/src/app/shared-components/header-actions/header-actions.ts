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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-actions',
  imports: [CommonModule, MatButton, MatIconButton, MatIcon, MatBadgeModule, RouterLink],
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

  isDropdownOpen: boolean = false;

  constructor() {
    this.currentUser$ = this.authService.currentUser$
    this.cartService.getUserCart().subscribe();
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((status) => {
      this.isAuthenticated = status
    })

    if (this.isAuthenticated) {
      this.cartService.getUserCart();
    }
  }

  onLogOut() {
    this.toggleDropdown()
    this.authService.logout()
    console.log('user logged out')
    this.router.navigateByUrl('/');
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

}

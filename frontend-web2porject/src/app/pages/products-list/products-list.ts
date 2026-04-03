import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../models/product.interface';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { ProductCard } from "../../shared-components/product-card/product-card";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList, MatListItem, MatListItemTitle } from '@angular/material/list'
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthCustomService } from '../../services/auth-custom.service';
import { User } from '../../models/user.interface';


@Component({
  selector: 'app-products',
  imports: [AsyncPipe, ProductCard, RouterLink, MatSidenavModule, MatNavList, MatListItem, MatListItemTitle, TitleCasePipe],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class Products {

  private productService = inject(ProductService)
  private route = inject(ActivatedRoute);
  private authService = inject(AuthCustomService)
  private router = inject(Router);
  currentUser$: BehaviorSubject<User | null>
  adminRedirectUrl = '/admin/products'

  products$!: Observable<Product[]>;

  // products = signal<Observable<Product[]>[]>([this.service.getProducts()]);

  category = signal<string>(''); //default

  categories = signal<string[]>(['sport', 'formal', 'casual', 'headgear'])

  constructor() {
    this.currentUser$ = this.authService.currentUser$

    if(this.currentUser$.getValue()?.role === "admin") this.router.navigateByUrl(this.adminRedirectUrl);
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const categoryParam = params.get('category');
      if (categoryParam) {
        this.category.set(categoryParam);
      } else {
        this.category.set('');
      }
    })

  }

  categoryEffect = effect(() => {
    this.getListOfProducts()
  });

  getListOfProducts(): void {
    this.products$ = this.productService.getProducts(this.category());
  }

}


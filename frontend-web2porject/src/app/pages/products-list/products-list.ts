import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.interface';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { ProductCard } from "../../shared-components/product-card/product-card";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList, MatListItem, MatListItemTitle } from '@angular/material/list'
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthCustomService } from '../../services/auth-custom.service';


@Component({
  selector: 'app-products',
  imports: [AsyncPipe, ProductCard, RouterLink, MatSidenavModule, MatNavList, MatListItem, MatListItemTitle, TitleCasePipe],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class Products {

  private productService = inject(ProductService)
  private route = inject(ActivatedRoute);


  products$!: Observable<Product[]>;

  // products = signal<Observable<Product[]>[]>([this.service.getProducts()]);

  category = signal<string>(''); //default

  categories = signal<string[]>(['sport', 'formal', 'casual', 'headgear'])

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


import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../models/order.interface';
import { CartItem } from '../models/cartItem.interface';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private http = inject(HttpClient);

  private checkoutUri = `${environment.apiUri}/checkout`

  checkout(items: CartItem[]) {
    return this.http.post<any>(this.checkoutUri, { items: items });
  }

}

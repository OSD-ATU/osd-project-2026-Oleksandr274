import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.interface';
import { CartItem } from '../models/cartItem.interface';

@Injectable({
  providedIn: 'root',
})
export class UserCartService {
  private http = inject(HttpClient);

  private cartUri = `${environment.apiUri}/cart`

  userCart$ = signal<CartItem[]>([]);

  getUserCart(): Observable<any> {
    return this.http.get<any>(this.cartUri)
      .pipe(
        map((data) => {
          this.userCart$.set(data.cartData)
          return data.cartData as CartItem[];
        }),
        catchError(this.handleError)
      )
  }

  addToCart(productId: string): Observable<any> {
    return this.http.post<any>(`${this.cartUri}/${productId}`,{})
      .pipe(
        map((data) => {
          this.userCart$.set(data.cartData)
          return;
        }),
        catchError(this.handleError)
      );
  }

  emptyUserCart(): Observable<any> {
    return this.http.delete<any>(this.cartUri)
      .pipe(
        map((data) => {
          this.userCart$.set(data.cartData)
          return;
        }),
        catchError(this.handleError)
      );
  }
  
  total  = computed( ()=> {
    return this.userCart$().reduce((sum, item) => sum + item.quantity, 0)
  });


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.status === 404) {
      errorMessage = 'User not found (404)';
    } else if (error.status === 500) {
      errorMessage = 'Server error (500). Please try again later.';
    } else if (error.status === 400) {
      errorMessage = 'Request could not be read properly.';
    } else if (error.status == 401 || error.status == 403) {
      errorMessage = 'You are not authorised for that action';
    }
    else if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error.message}`;
    }

    console.error('API Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}

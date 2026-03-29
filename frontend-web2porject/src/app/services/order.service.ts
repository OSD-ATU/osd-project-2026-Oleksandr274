import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { CartItem } from '../models/cartItem.interface';
import { catchError, Observable, throwError } from 'rxjs';
import { Order } from '../models/order.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  private orderUri = `${environment.apiUri}/orders`;
  private orderLambdaUri = `${environment.lambdaUri}`

  createOrder(orderData: Order): Observable<any> {
    return this.http.post<any>(this.orderUri, orderData)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllOrders(): Observable<any> {
    return this.http.get<any>(this.orderUri)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserOrders(userId?: string): Observable<any> {
    let params = new HttpParams();

    if (userId != undefined && userId != '') {
      params = params.append('userId', userId);
    }

    return this.http.get<any>(`${this.orderUri}/user`, { params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.orderUri}/${id}`)
  }

  updateOrder(id: string, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.orderUri}/${id}`, {status: status})
  }
  
  deleteOrder(id: string): Observable<Order> {
    return this.http.delete<Order>(`${this.orderUri}/${id}`)
  }

  getOrderStats(){
    return this.http.get<any>(this.orderLambdaUri)
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.status === 404) {
      errorMessage = 'Order not found (404)';
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

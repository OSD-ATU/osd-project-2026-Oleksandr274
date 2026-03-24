import { HttpClient, HttpErrorResponse, HttpParams  } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product.interface';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http =  inject(HttpClient);

  private productUri = `${environment.apiUri}/products`

  getProducts(categoryName: string): Observable<Product[]> {
    let params = new HttpParams();
    
    if(categoryName != undefined || categoryName != ''){
      params = params.append('category', categoryName);
    }

    return this.http.get<Product[]>(this.productUri, { params: params }).pipe(
      retry(3),
      catchError(this.handleError)
    )
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.productUri}/${id}`)
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.productUri, product)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteProduct(id: string): Observable<Product> {
    return this.http.delete<Product>(`${this.productUri}/${id}`).pipe(
      catchError(this.handleError)
    )
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.status === 404) {
      errorMessage = 'Product not found (404)';
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

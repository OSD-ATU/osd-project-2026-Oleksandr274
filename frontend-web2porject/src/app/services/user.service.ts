import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private userUri = `${environment.apiUri}/users`

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.userUri, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.userUri)
      .pipe(
        catchError(this.handleError)
      );
  }


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

import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../models/user.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthCustomService {
  private authUri = `${environment.apiUri}/auth`

  readonly currentUser$: BehaviorSubject<User | null>;
  readonly isAuthenticated$: BehaviorSubject<boolean>;

  private http = inject(HttpClient)
  authenticateTimeout: number | undefined;

  constructor() {

    this.currentUser$ = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('user') || '{}'));

    const token = localStorage.getItem('accessToken') || '';

    // if there is a token we need to check if it has expired.
    if (token != "") {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expires = payload.exp * 1000
      if (expires > Date.now()) {
        this.isAuthenticated$ = new BehaviorSubject<boolean>(true)
        this.startAuthenticateTimer(expires);
      } else {
        this.isAuthenticated$ = new BehaviorSubject<boolean>(false)
      }

    } else {
      this.isAuthenticated$ = new BehaviorSubject<boolean>(false)
    }
  }

  public login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.authUri, { email, password })
      .pipe(
        map((data) => {
          const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
          const expires = payload.exp * 1000
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('user', JSON.stringify(payload));
          this.currentUser$.next(payload as User);
          this.isAuthenticated$.next(true);
          this.startAuthenticateTimer(expires);
          return;
        }),
        catchError(this.handleError)
      );
  }

  public logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    this.currentUser$.next(null);
    this.isAuthenticated$.next(false);
    clearTimeout(this.authenticateTimeout);
  }

  private startAuthenticateTimer(expires: number) {

    // set a timeout to re-authenticate with the api one minute before the token expires

    const timeout = expires - Date.now() - (60 * 1000);

    this.authenticateTimeout = setTimeout(() => {
      if (this.isAuthenticated$.value) {

        // refresh tokens are not implmented yet so we logout instead.

        //this.getNewAccessToken().subscribe();
        this.logout();
      }
    }, timeout);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.status === 404) {
      errorMessage = 'User not found (404)';
    } else if (error.status === 500) {
      errorMessage = 'Server error (500). Please try again later.';
    } else if (error.status === 400) {
      errorMessage = 'Request could not be read properly.';
    } else if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error.message}`;
    }

    console.error('API Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

}

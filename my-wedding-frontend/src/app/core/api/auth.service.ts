import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Authenticate } from '../model/authenticate.mode';
import { Authenticated } from '../model/authenticated.model';
import { ENV } from '../../../env/environment.';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public ACCESS_TOKEN: string = 'access_token';
  public REFRESH_TOKEN: string = 'refresh_token';
  public TIMESTAMP: string = 'timestamp';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {}

  authenticate(credentials: Authenticate): Observable<boolean> {
    return this.httpClient.post<Authenticated>(`${ENV.apiUrl}/api/v1/auth/login`, credentials).pipe(
      tap((authenticated) => {
        sessionStorage.setItem(
          this.ACCESS_TOKEN,
          `${authenticated.token_type} ${authenticated.access_token}`,
        );
        sessionStorage.setItem(
          this.REFRESH_TOKEN,
          `${authenticated.token_type} ${authenticated.refresh_token}`,
        );
        sessionStorage.setItem(this.TIMESTAMP, authenticated.date_time.getDate().toString());
      }),
      map(() => true),
      catchError((error) => {
        if (ENV.production) {
          console.error('Authentication failed', error);
        }
        return throwError(() => error.error || error);
      }),
    );
  }

  // refreshToken() : Observable<boolean> {

  // }

  logout() {
    sessionStorage.removeItem(this.ACCESS_TOKEN);
    sessionStorage.removeItem(this.REFRESH_TOKEN);
    this.router.navigate(['/login']);
  }
}

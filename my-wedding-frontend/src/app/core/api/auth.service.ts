import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../model/auth.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Authenticated } from '../model/authenticated.mode';
import { API } from '../env/env.dev';
import { HttpClient } from '@angular/common/http';
import { ServerException } from '../exception/server.exception';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private accessToken = 'access_token';
  private refreshToken = 'refresh_token';
  private sessionDateTime = 'session_datetime';
  private tokenType = 'token_type';

  authenticate(auth: Auth): Observable<Date> {
    return this.http.post<Authenticated>(`${API.baseUrl}/api/v1/auth/login`, auth).pipe(
      tap((authenticated) => this.saveTokens(authenticated)),
      map((authenticated) => {
        return authenticated.date_time;
      }),
      catchError((error) => throwError(() => new ServerException(error))),
    );
  }

  refreshAuthentication(): Observable<Authenticated> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<Authenticated>(`${API.baseUrl}/api/v1/auth/refresh`, { refreshToken })
      .pipe(
        tap((tokens) => this.saveTokens(tokens)),
        catchError((error) => {
          this.logout();
          return throwError(() => new ServerException(error));
        }),
      );
  }

  logout(): void {
    this.clearTokens();
    this.router.navigate(['/app/login']);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.accessToken);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.refreshToken);
  }

  private saveTokens(authenticated: Authenticated) {
    sessionStorage.setItem(this.accessToken, authenticated.access_token);
    sessionStorage.setItem(this.refreshToken, authenticated.refresh_token);
    sessionStorage.setItem(this.sessionDateTime, authenticated.date_time.toString());
    sessionStorage.setItem(this.tokenType, authenticated.token_type);
  }

  private clearTokens() {
    sessionStorage.removeItem(this.accessToken);
    sessionStorage.removeItem(this.refreshToken);
    sessionStorage.removeItem(this.sessionDateTime);
    sessionStorage.removeItem(this.tokenType);
  }
}

import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../model/auth.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Authenticated } from '../model/authenticated.mode';
import { URL } from '../env/env.dev';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ResponseServer } from '../model/response.mode';
import { ServerException } from '../exception/server.exception';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private accessToken = 'access_token';
  private refreshToken = 'refresh_token';
  private sessionDateTime = 'session_datetime';
  private tokenType = 'token_type';

  authenticate(auth: Auth): Observable<Date | ResponseServer> {
    return this.http.post<Authenticated>(`${URL.baseUrl}/api/v1/login`, auth).pipe(
      tap((authenticated) => this.saveTokens(authenticated)),
      map((authenticated) => {
        return authenticated.date_time;
      }),
      catchError(this.handleError),
    );
  }

  private saveTokens(authenticated: Authenticated) {
    sessionStorage.setItem(this.accessToken, authenticated.access_token);
    sessionStorage.setItem(this.refreshToken, authenticated.refresh_token);
    sessionStorage.setItem(this.sessionDateTime, authenticated.date_time.toString());
    sessionStorage.setItem(this.tokenType, authenticated.token_type);
  }

  private handleError(error: HttpErrorResponse): Observable<ResponseServer> {
    let errorCode = error.error.code;
    let errorPhrase = error.error.phrase;
    let errorMessage = error.error.message;
    let errorContent = error.error.content;

    if (errorMessage == null) {
      errorCode = 500;
      errorMessage = 'Error desconocido, contacta con soporte para investigación';
    }

    const errorServer: ResponseServer = {
      code: errorCode,
      phrase: errorPhrase,
      message: errorMessage,
      content: errorContent,
    };

    return throwError(() => new ServerException(errorServer));
  }
}

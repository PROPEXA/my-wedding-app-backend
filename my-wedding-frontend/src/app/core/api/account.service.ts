import { inject, Inject, Injectable } from '@angular/core';
import { Account } from '../model/account.model';
import { HttpClient } from '@angular/common/http';
import { API } from '../env/env.dev';
import { catchError, Observable, throwError } from 'rxjs';
import { ServerException } from '../exception/server.exception';
import { ResponseServer } from '../model/response.mode';
import { ConfirmAccount } from '../model/confirm-account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private httpClient = inject(HttpClient);

  /**
   * Register a new account using the provided account data
   * @param account Account information including email, password, user details, and preferred language
   * @returns  Observable<ResponseServer> containing the server response after attempting to create the account
   */
  postNewAccount(account: Account): Observable<ResponseServer> {
    return this.httpClient
      .post<ResponseServer>(`${API.baseUrl}/api/v1/accounts`, account)
      .pipe(catchError((error) => throwError(() => new ServerException(error))));
  }

  /**
   * Confirm account using the provided token and verification code
   * @param token Confirmation token received from the URL to identify the account
   * @param code Confirmation code entered by the user to verify their account
   */
  postConfirmAccount(token: string, code: string): Observable<ResponseServer> {
    const payload: ConfirmAccount = { token, code };
    return this.httpClient
      .post<ResponseServer>(`${API.baseUrl}/api/v1/accounts/confirm`, payload)
      .pipe(catchError((error) => throwError(() => new ServerException(error))));
  }
}

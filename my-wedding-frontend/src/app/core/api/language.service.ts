import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Language } from '../model/language.model';
import { API } from '../env/env.dev';
import { ServerException } from '../exception/server.exception';

/**
 * LanguageService is an Angular service that provides methods to interact with the language-related API endpoints.
 * It includes methods to retrieve a list of languages and to get details of a specific language by its ISO 639-1 code.
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private httpClient = inject(HttpClient);

  getLanguages(): Observable<Language[]> {
    return this.httpClient
      .get<Language[]>(`${API.baseUrl}/api/v1/languages`)
      .pipe(catchError((error) => throwError(() => new ServerException(error))), retry(2));
  }

  getLanguageByIso6391(iso6391: string): Observable<Language> {
    return this.httpClient.get<Language>(`${API.baseUrl}/api/v1/languages/${iso6391}`).pipe(
      catchError((error) => throwError(() => new ServerException(error))),
      retry(2),
    );
  }
}

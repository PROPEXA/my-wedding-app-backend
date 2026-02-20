import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Wedding } from '../model/wedding.model';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { ResponseServer } from '../model/response.mode';
import { API } from '../env/env.dev';
import { ServerException } from '../exception/server.exception';

@Injectable({
  providedIn: 'root',
})
export class WeddingService {
  private httpClient = inject(HttpClient);

  /**
   * Create a new wedding using the provided wedding data
   * @param wedding  Wedding information including details about the wedding, such as date, location, and participants
   * @returns  Observable<ResponseServer> containing the server response after attempting to create the wedding
   */
  postNewWedding(wedding: Wedding): Observable<ResponseServer> {
    return this.httpClient
      .post<ResponseServer>(`${API.baseUrl}/api/v1/weddings`, wedding)
      .pipe(catchError((error) => throwError(() => new ServerException(error))));
  }

  /**
   * Update an existing wedding using the provided wedding data
   * @param wedding  Wedding information including updated details about the wedding, such as date, location, and participants. The wedding object should include an identifier to specify which wedding to update.
   * @returns  Observable<ResponseServer> containing the server response after attempting to update the wedding
   */
  putExistingWedding(wedding: Wedding): Observable<ResponseServer> {
    return this.httpClient
      .put<ResponseServer>(`${API.baseUrl}/api/v1/weddings`, wedding)
      .pipe(catchError((error) => throwError(() => new ServerException(error))));
  }

  /**
   * Retrieve all weddings associated with the authenticated user
   * @returns  Observable<Wedding[]> containing the list of weddings retrieved from the server. The observable will emit an array of Wedding objects representing the weddings associated with the authenticated user. If an error occurs during the retrieval process, a ServerException will be thrown.
   */
  getAllMyWeddings(): Observable<Wedding[]> {
    return this.httpClient.get<Wedding[]>(`${API.baseUrl}/api/v1/weddings`).pipe(
      catchError((error) => throwError(() => new ServerException(error))),
      retry(2),
    );
  }

  /**
   * Delete a wedding by its identifier
   * @param weddingId Identifier of the wedding to be deleted. This should be a unique identifier that corresponds to the wedding you want to remove from the server.
   * @returns  Observable<ResponseServer> containing the server response after attempting to delete the wedding. The observable will emit a ResponseServer object that indicates the success or failure of the deletion operation. If an error occurs during the deletion process, a ServerException will be thrown.
   */
  deleteWeddingById(weddingId: number): Observable<ResponseServer> {
    return this.httpClient
      .delete<ResponseServer>(`${API.baseUrl}/api/v1/weddings/${weddingId}`)
      .pipe(catchError((error) => throwError(() => new ServerException(error))));
  }

  getWeddingById(weddingId: number): Observable<Wedding> {
    return this.httpClient.get<Wedding>(`${API.baseUrl}/api/v1/weddings/${weddingId}`).pipe(
      catchError((error) => throwError(() => new ServerException(error))),
      retry(2),
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { WeddingEvent } from '../model/wedding-event.model';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { ResponseServer } from '../model/response.mode';
import { API } from '../env/env.dev';
import { ServerException } from '../exception/server.exception';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private httpClient = inject(HttpClient);

  /**
   * Create a new wedding event using the provided event data
   * @param event Wedding event information including details about the event, such as date, location, and type.
   * The event object should include all necessary information to create a new wedding event on the server.
   * @returns Observable<ResponseServer> containing the server response after attempting to create the wedding event.
   * The observable will emit a ResponseServer object that indicates the success or failure of the creation operation.
   * If an error occurs during the creation process, a ServerException will be thrown.
   */
  postNewWeddingEvent(event: WeddingEvent): Observable<ResponseServer> {
    return this.httpClient
      .post<ResponseServer>(`${API.baseUrl}/api/v1/wedding-events`, event)
      .pipe(catchError((error) => throwError(() => new ServerException(error))));
  }

  /**
   * Update an existing wedding event using the provided event data
   * @param event Wedding event information including updated details about the event, such as date, location, and type.
   *  The event object should include an identifier to specify which wedding event to update.
   * @returns Observable<ResponseServer> containing the server response after attempting to update the wedding event.
   * The observable will emit a ResponseServer object that indicates the success or failure of the update operation.
   * If an error occurs during the update process, a ServerException will be thrown.
   */
  putExistingWeddingEvent(event: WeddingEvent): Observable<ResponseServer> {
    return this.httpClient
      .put<ResponseServer>(`${API.baseUrl}/api/v1/wedding-events`, event)
      .pipe(catchError((error) => throwError(() => new ServerException(error))));
  }

  /**
   * Retrieve all wedding events associated with a specific wedding by its identifier
   * @param weddingId Identifier of the wedding for which to retrieve the associated events. This should be a unique
   *  identifier that corresponds to the wedding whose events you want to fetch from the server.
   * @returns Observable<WeddingEvent[]> containing the list of wedding events retrieved from the server. The observable will emit
   * an array of WeddingEvent objects representing the events associated with the specified wedding. If an error occurs during
   * the retrieval process, a ServerException will be thrown.
   */
  getAllWeddingEventsByWeddingId(weddingId: number): Observable<WeddingEvent[]> {
    return this.httpClient
      .get<
        WeddingEvent[]
      >(`${API.baseUrl}/api/v1/wedding-events`, { params: { wedding_id: weddingId } })
      .pipe(
        catchError((error) => throwError(() => new ServerException(error))),
        retry(2),
      );
  }

  /**
   * Retrieve a specific wedding event by its identifier
   * @param eventId Identifier of the wedding event to be retrieved. This should be a unique identifier that corresponds to the
   * wedding event you want to fetch from the server.
   * @returns Observable<WeddingEvent> containing the wedding event retrieved from the server. The observable will emit a WeddingEvent
   * object representing the details of the requested wedding event. If an error occurs during the retrieval process, a ServerException
   * will be thrown.
   */
  getWeddingEventById(eventId: number): Observable<WeddingEvent> {
    return this.httpClient
      .get<WeddingEvent>(`${API.baseUrl}/api/v1/wedding-events/${eventId}`)
      .pipe(
        catchError((error) => throwError(() => new ServerException(error))),
        retry(2),
      );
  }

  /**
   * Delete a wedding event by its identifier
   * @param eventId Identifier of the wedding event to be deleted. This should be a unique identifier that corresponds to the wedding event
   * you want to remove from the server.
   * @returns Observable<ResponseServer> containing the server response after attempting to delete the wedding event. The observable
   * will emit a ResponseServer object that indicates the success or failure of the deletion operation.
   * If an error occurs during the deletion process, a ServerException will be thrown.
   */
  deleteWeddingEventById(eventId: number): Observable<ResponseServer> {
    return this.httpClient
      .delete<ResponseServer>(`${API.baseUrl}/api/v1/wedding-events/${eventId}`)
      .pipe(catchError((error) => throwError(() => new ServerException(error))));
  }
}

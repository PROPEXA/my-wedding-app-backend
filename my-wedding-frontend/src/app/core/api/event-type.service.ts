import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { EventType } from '../model/event-type.model';
import { API } from '../env/env.dev';
import { ServerException } from '../exception/server.exception';

@Injectable({
  providedIn: 'root',
})
export class WeddingEventTypeService {
  private httpClient = inject(HttpClient);

  /**
   * Retrieve all event types available for wedding events
   * @returns Observable<EventType[]> containing the list of event types retrieved from the server. The observable will emit
   * an array of EventType objects representing the different types of events that can be associated with wedding events. If
   * an error occurs during the retrieval process, a ServerException will be thrown.
   */
  getAllEventTypes(): Observable<EventType[]> {
    return this.httpClient.get<EventType[]>(`${API.baseUrl}/api/v1/wedding-events/types`).pipe(
      catchError((error) => throwError(() => new ServerException(error))),
      retry(2),
    );
  }

  /**
   * Retrieve a specific event type by its identifier
   * @param typeId Identifier of the event type to be retrieved. This should be a unique identifier that corresponds to the
   * event type you want to fetch from the server.
   * @returns Observable<EventType> containing the event type retrieved from the server. The observable will emit an EventType
   * object representing the details of the requested event type. If an error occurs during the retrieval process, a ServerException
   * will be thrown.
   */
  getEventTypeById(typeId: number): Observable<EventType> {
    return this.httpClient
      .get<EventType>(`${API.baseUrl}/api/v1/wedding-events/types/${typeId}`)
      .pipe(
        catchError((error) => throwError(() => new ServerException(error))),
        retry(2),
      );
  }
}

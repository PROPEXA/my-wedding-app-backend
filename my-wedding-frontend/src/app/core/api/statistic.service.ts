import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Statistic } from '../model/statistic.mode';
import { ServerException } from '../exception/server.exception';
import { API } from '../env/env.dev';

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  private httpClient = inject(HttpClient);

  /**
   * Obtain wedding statistics by wedding ID
   * @param weddingId Identifier of the wedding for which to retrieve statistics.
   * @returns Observable<Statistic> containing the wedding statistics retrieved from the server.
   */
  getWeddingStatisticByWeddingId(weddingId: number): Observable<Statistic> {
    return this.httpClient
      .get<Statistic>(`${API.baseUrl}/api/v1/statistics/weddings/${weddingId}`)
      .pipe(
        catchError((error) => throwError(() => new ServerException(error))),
        retry(2),
      );
  }

  /**
   * Obtain event statistics by event ID
   * @param weddingId Identifier of the wedding for which to retrieve event statistics.
   * @returns Observable<Statistic[]> containing the event statistics retrieved from the server for the specified wedding.
   */
  getAllEventsStatisticByWeddingId(weddingId: number): Observable<Statistic[]> {
    return this.httpClient
      .get<Statistic[]>(`${API.baseUrl}/api/v1/statistics/weddings/${weddingId}/events`)
      .pipe(
        catchError((error) => throwError(() => new ServerException(error))),
        retry(2),
      );
  }

  /**
   * Obtain event statistics by event ID
   * @param eventId Identifier of the event for which to retrieve statistics.
   * @returns Observable<Statistic> containing the event statistics retrieved from the server for the specified event.
   */
  getEventStatisticByEventId(eventId: number): Observable<Statistic> {
    return this.httpClient
      .get<Statistic>(`${API.baseUrl}/api/v1/statistics/weddings/events/${eventId}`)
      .pipe(
        catchError((error) => throwError(() => new ServerException(error))),
        retry(2),
      );
  }
}

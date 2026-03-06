import { inject, Injectable } from '@angular/core';
import { Invitation } from '../model/invitation.model';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { ResponseServer } from '../model/response.mode';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API } from '../env/env.dev';
import { ServerException } from '../exception/server.exception';
import { ConfirmInvitation } from '../model/confirm-invitation.model';

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  private httpClient = inject(HttpClient);

  postNewInvitation(invitation: Invitation): Observable<ResponseServer> {
    return this.httpClient
      .post<ResponseServer>(`${API.baseUrl}/api/v1/invitations`, invitation)
      .pipe(catchError((error) => throwError(() => new ServerException(error))));
  }

  getInvitationById(id: number): Observable<Invitation> {
    return this.httpClient.get<Invitation>(`${API.baseUrl}/api/v1/invitations/${id}`).pipe(
      catchError((error) => throwError(() => new ServerException(error))),
      retry(2),
    );
  }

  deleteInvitationById(id: number): Observable<ResponseServer> {
    return this.httpClient
      .delete<ResponseServer>(`${API.baseUrl}/api/v1/invitations/${id}`)
      .pipe(catchError((error) => throwError(() => new ServerException(error))));
  }

  getInvitationByToken(id: number, token: string): Observable<Invitation> {
    const params = new HttpParams().set('uuid', token);
    return this.httpClient
      .get<Invitation>(`${API.baseUrl}/api/v1/invitations/${id}/public`, { params })
      .pipe(
        catchError((error) => throwError(() => new ServerException(error))),
        retry(2),
      );
  }

  getAllInvitationsByEventId(
    eventId: number,
    pageable: { page: number; size: number },
  ): Observable<Invitation[]> {
    const params = new HttpParams()
      .set('event_id', eventId)
      .set('page', pageable.page)
      .set('size', pageable.size);
    return this.httpClient
      .get<Invitation[]>(`${API.baseUrl}/api/v1/invitations/props`, { params })
      .pipe(
        catchError((error) => throwError(() => new ServerException(error))),
        retry(2),
      );
  }

  getAllInvitationsByWeddingId(
    weddingId: number,
    pageable: { page: number; size: number },
  ): Observable<Invitation[]> {
    const params = new HttpParams()
      .set('wedding_id', weddingId)
      .set('page', pageable.page)
      .set('size', pageable.size);
    return this.httpClient
      .get<Invitation[]>(`${API.baseUrl}/api/v1/invitations/props`, { params })
      .pipe(
        catchError((error) => throwError(() => new ServerException(error))),
        retry(2),
      );
  }

  putConfirmInvitation(confirm: ConfirmInvitation): Observable<ResponseServer> {
    return this.httpClient
      .put<ResponseServer>(`${API.baseUrl}/api/v1/invitations/confirm/public`, confirm)
      .pipe(catchError((error) => throwError(() => new ServerException(error))));
  }
}

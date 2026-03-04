import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Relation } from '../model/relation.mode';
import { API } from '../env/env.dev';
import { ServerException } from '../exception/server.exception';

@Injectable({
  providedIn: 'root',
})
export class RelationService {
  private httpClient = inject(HttpClient);

  getAllRelations(): Observable<Relation[]> {
    return this.httpClient.get<Relation[]>(`${API.baseUrl}/api/v1/relations`).pipe(
      catchError((error) => throwError(() => new ServerException(error))),
      retry(2),
    );
  }

  getRelationById(id: number): Observable<Relation> {
    return this.httpClient.get<Relation>(`${API.baseUrl}/api/v1/relations/${id}`).pipe(
      catchError((error) => throwError(() => new ServerException(error))),
      retry(2),
    );
  }
}

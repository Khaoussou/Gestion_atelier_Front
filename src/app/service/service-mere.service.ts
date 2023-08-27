import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response } from '../modele/Response';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ServiceMereService<T> {
  protected url = environment.localhost;
  constructor(protected http: HttpClient) {}
  protected Uri!: string;
  getAll(): Observable<Response<T>> {
    return this.http.get<Response<T>>(this.url + this.Uri + '/');
  }

  add<U>(body: U): Observable<Response<T>> {
    return this.http.post<Response<T>>(this.url + this.Uri + '/', body);
  }

  update<U>(id: number, body: U): Observable<Response<T>> {
    return this.http.post<Response<T>>(this.url + this.Uri + '/' + id, body);
  }

  getById(id: number): Observable<Response<T>> {
    return this.http.get<Response<T>>(this.url + this.Uri + '/' + id);
  }

  delete(id: number): Observable<Response<T>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };
    return this.http.delete<Response<T>>(
      this.url + this.Uri + '/' + id,
      options
    );
  }
}

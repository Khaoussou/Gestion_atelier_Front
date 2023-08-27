import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categorie } from '../modele/Categorie';
import { Response } from '../modele/Response';
import { ServiceMereService } from './service-mere.service';

@Injectable({
  providedIn: 'root',
})
export class CategorieService extends ServiceMereService<Categorie> {
  protected override Uri: string = 'categories';
  searchCategorie(categorie: string): Observable<Response<Categorie>> {
    return this.http.get<Response<Categorie>>(this.url + 'search/' + categorie);
  }
  deleteCategorie(ids: number[]): Observable<Response<Categorie>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers, body: { id: ids } };
    return this.http.delete<Response<Categorie>>(this.url + 'delete/', options);
  }
  updateCat<U>(id: number, body: U): Observable<Response<Categorie>> {
    return this.http.put<Response<Categorie>>(this.url + this.Uri + '/' + id, body);
  }
}

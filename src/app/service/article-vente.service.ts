import { Injectable } from '@angular/core';
import { ServiceMereService } from './service-mere.service';
import { Article } from '../modele/Article';

@Injectable({
  providedIn: 'root',
})
export class ArticleVenteService extends ServiceMereService<Article> {
  protected override Uri: string = 'articleVentes';
}

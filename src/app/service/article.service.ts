import { Injectable } from '@angular/core';
import { Article } from '../modele/Article';
import { ServiceMereService } from './service-mere.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleService extends ServiceMereService<Article> {
  protected override Uri: string = 'articles';
}

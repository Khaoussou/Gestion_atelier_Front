import { Injectable } from '@angular/core';
import { ServiceMereService } from './service-mere.service';
import { ArticleConfection } from '../modele/Article-confection';

@Injectable({
  providedIn: 'root',
})
export class ArticleService extends ServiceMereService<ArticleConfection> {
  protected override Uri: string = 'articles';
}

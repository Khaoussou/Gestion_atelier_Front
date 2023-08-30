import { Injectable } from '@angular/core';
import { ServiceMereService } from './service-mere.service';
import { ArticleVente } from '../modele/Article-vente';

@Injectable({
  providedIn: 'root',
})
export class ArticleVenteService extends ServiceMereService<ArticleVente> {
  protected override Uri: string = 'articleVentes';
}

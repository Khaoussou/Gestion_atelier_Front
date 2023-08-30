import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArticleVente } from 'src/app/modele/Article-vente';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css'],
})
export class ListeComponent {
  @Input() articleVentes: ArticleVente[] = [];
  public itemsPerPage: number = 3;
  public p: number = 1;

  @Output() articleDelete: EventEmitter<ArticleVente> =
    new EventEmitter<ArticleVente>();
  @Output() articleUpdate: EventEmitter<ArticleVente> =
    new EventEmitter<ArticleVente>();

  deleteArt(article: ArticleVente) {
    this.articleDelete.emit(article);
  }

  updateArt(article: ArticleVente) {
    this.articleUpdate.emit(article);
  }
}

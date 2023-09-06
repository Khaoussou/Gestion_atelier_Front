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
  public down: boolean = false;

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

  choix(event: Event) {
    let target: any = event.target;
    this.itemsPerPage = target.value;
  }

  trie() {
    this.down = !this.down;
    if (this.down) {
      this.articleVentes = this.articleVentes.sort(
        (a: ArticleVente, b: ArticleVente) => {
          let libA = a.libelle.toLowerCase();
          let libB = b.libelle.toLowerCase();
          if (libA < libB) {
            return 1;
          }
          if (libA > libB) {
            return -1;
          }
          return 0;
        }
      );
    } else {
      this.articleVentes = this.articleVentes.sort(
        (a: ArticleVente, b: ArticleVente) => {
          let libA = a.libelle.toLowerCase();
          let libB = b.libelle.toLowerCase();
          if (libA < libB) {
            return -1;
          }
          if (libA > libB) {
            return 1;
          }
          return 0;
        }
      );
    }
    console.log(this.articleVentes);
  }

  filter(event: Event) {
    let target: HTMLInputElement = event.target as HTMLInputElement;
    this.articleVentes = this.articleVentes.filter((item) =>
      item.libelle.toLowerCase().includes(target.value.toLowerCase())
    );
    console.log(target.value);
    console.log(this.articleVentes);
  }
}

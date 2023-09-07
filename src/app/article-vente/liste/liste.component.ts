import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArticleConfection } from 'src/app/modele/Article-confection';
import { ArticleVente } from 'src/app/modele/Article-vente';
import { Categorie } from 'src/app/modele/Categorie';
import { Confection } from 'src/app/modele/Confection';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css'],
})
export class ListeComponent {
  @Input() articleVentes: ArticleVente[] = [];
  @Input() ventes: ArticleVente[] = [];
  @Input() cateConfs: Categorie[] = [];
  @Input() articleConfs: ArticleConfection[] = [];
  public itemsPerPage: number = 3;
  public p: number = 1;
  public down: boolean = false;
  public libelleCategories: string[] = [];
  public idArticleConfs: number[] = [];
  public articleSearchs: ArticleConfection[] = [];
  public confections: any;

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
    if (target.value === '') {
      this.articleVentes = [...this.ventes];
    } else {
      this.articleVentes = this.ventes.filter((item) =>
        item.libelle.toLowerCase().includes(target.value.toLowerCase())
      );
    }
  }

  itemSelected(event: Categorie[]) {
    let yes!: ArticleConfection[];
    let articleVenteFiltrer: ArticleVente[] = [];
    this.articleSearchs = [];
    this.libelleCategories = event.map((libelle) => libelle.libelle);
    this.libelleCategories.forEach((libelle) => {
      yes = this.articleConfs.filter((article) => article.categorie == libelle);
      this.articleSearchs.push(...yes);
    });
    this.idArticleConfs = this.articleSearchs.map((id) => id.id) as number[];
    let bap: ArticleVente[] = [];
    this.idArticleConfs.forEach((id) => {
      articleVenteFiltrer = this.articleVentes.filter((articles) =>
        articles.confection.some((confection) => confection.article.id == id)
      );
      bap.push(...articleVenteFiltrer);
    });
    console.log(bap);
    if (event.length === 0) {
      this.articleVentes = [...this.ventes];
    } else {
      bap = bap.filter((article, index, bap) => {
        return bap.findIndex((art) => art.id === article.id) === index;
      });
      this.articleVentes = bap;
    }
    console.log(bap);
    console.log(this.articleVentes);
  }
}

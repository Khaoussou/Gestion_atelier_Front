import { Component, OnInit } from '@angular/core';
import { Categorie } from '../modele/Categorie';
import { Article } from '../modele/Article';
import { ArticleService } from '../service/article.service';
import { Fournisseur } from '../modele/Fournisseur';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent implements OnInit {
  public categories: Categorie[] = [];
  public articles: Article[] = [];
  public article: Article[] = [];
  public id!: number;
  public fournisseurs: Fournisseur[] = [];
  public message: string = '';
  public valuBtn: any;

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.all();
  }

  all() {
    this.articleService.getAll().subscribe((response) => {
      if (
        'categories' in response.data &&
        'articles' in response.data &&
        'fournisseurs' in response.data
      ) {
        this.categories = response.data.categories as Categorie[];
        this.articles = response.data.articles as Article[];
        this.fournisseurs = response.data.fournisseurs as Fournisseur[];
      }
    });
  }

  valid(event: string) {
    this.valuBtn = event;
    console.log(event);
  }

  valueIdUpdate(id: number) {
    this.article = this.articles.filter((article: Article) => article.id == id);
    this.id = this.article[0].id as number;
  }

  addOrUpdateArticle(event: FormData) {
    console.log(this.id);
    if (this.valuBtn.innerText == 'Edit') {
      this.articleService
        .update<FormData>(this.id, event)
        .subscribe((response) => {
          console.log(response.data[0]);

          this.message = response.message;
          setTimeout(() => {
            this.message = '';
          }, 5000);
          this.valuBtn.innerText = 'Ajouter';
          this.articles.splice(
            this.articles.indexOf(this.article[0]),
            1,
            response.data[0]
          );
        });
    } else {
      console.log(event);
      this.articleService.add<FormData>(event).subscribe((response) => {
        console.log(response);
        this.message = response.message;
        setTimeout(() => {
          this.message = '';
        }, 5000);
        this.articles.unshift(response.data[0]);
      });
    }
  }

  valueId(id: number) {
    this.articleService.delete(id).subscribe((response) => {
      this.message = response.message;
      setTimeout(() => {
        this.message = '';
      }, 5000);
      this.all();
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ArticleVenteService } from '../service/article-vente.service';
import { ArticleVente } from '../modele/Article-vente';
import { Categorie } from '../modele/Categorie';
import { Article } from '../modele/Article';

@Component({
  selector: 'app-article-vente',
  templateUrl: './article-vente.component.html',
  styleUrls: ['./article-vente.component.css'],
})
export class ArticleVenteComponent implements OnInit {
  public articleVentes: ArticleVente[] = [];
  public articleVente!: ArticleVente;
  public articleConfs: Article[] = [];
  public categorieVentes: Categorie[] = [];
  public message!: string;
  constructor(private articleVenteService: ArticleVenteService) {}
  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.articleVenteService.getAll().subscribe(
      (response) => {
        if (
          'articleVentes' in response.data &&
          'categories' in response.data &&
          'articleConfs' in response.data
        ) {
          this.articleVentes = response.data.articleVentes as ArticleVente[];
          this.articleConfs = response.data.articleConfs as Article[];
          this.categorieVentes = response.data.categories as Categorie[];
        }
        console.log(response.data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addOrUpdate(event: ArticleVente) {
    console.log(event);
    this.articleVenteService.add(event).subscribe((response) => {
      this.message = response.message;
      setTimeout(() => {
        this.message = '';
      }, 5000);
      if (response.message == 'Insertion réussie !') {
        this.articleVentes.unshift(response.data[0]);
      }
    });
  }

  deleteArt(event: ArticleVente) {
    let id: number = event.id as number;
    if (confirm('Etes vous sure de vouloir supprimer cet article ?')) {
      console.log(this.articleVentes);
      this.articleVenteService.delete(id).subscribe((response) => {
        let index = this.articleVentes.indexOf(response.data[0]);
        this.getAll();
        console.log(index);
        console.log(this.articleVentes);
      });
    }
  }

  updateArt(event: ArticleVente) {
    this.articleVente = event;
  }
}

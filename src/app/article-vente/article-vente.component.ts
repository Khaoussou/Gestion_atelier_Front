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
  public valueBtn!: string;
  constructor(private articleVenteService: ArticleVenteService) {}
  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    let bap: any
    this.articleVenteService.getAll().subscribe(
      (response) => {
        if (
          'articleVentes' in response.data &&
          'categories' in response.data &&
          'articleConfs' in response.data
        ) {
          this.articleVentes = response.data.articleVentes as ArticleVente[];
          // this.articleVentes.forEach(element => {
          //   bap.push(element)
          // })
          // console.log(bap.sort());
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
    console.log(this.articleVente);

    if (this.valueBtn == 'Save') {
      this.articleVenteService.add(event).subscribe((response) => {
        this.message = response.message;
        setTimeout(() => {
          this.message = '';
        }, 5000);
        if (response.message == 'Insertion réussie !') {
          this.articleVentes.unshift(response.data[0]);
        }
      });
    } else {
      let id: number = this.articleVente.id as number;
      this.articleVenteService.updated(id, event).subscribe((response) => {
        this.message = response.message;
        setTimeout(() => {
          this.message = '';
        }, 5000);
        this.getAll()
      });
      this.valueBtn = 'Save';
    }
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
    console.log(this.articleVente);
  }

  value(event: string) {
    this.valueBtn = event;
  }
}

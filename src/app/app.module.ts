import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategorieComponent } from './categorie/categorie.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ArticleComponent } from './article/article.component';
import { FormComponent } from './article/form/form.component';
import { ListComponent } from './article/list/list.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ItemComponent } from './article/list/item/item.component';
import { ArticleVenteComponent } from './article-vente/article-vente.component';
import { FormulaireComponent } from './article-vente/formulaire/formulaire.component';
import { ListeComponent } from './article-vente/liste/liste.component';

@NgModule({
    declarations: [
        AppComponent,
        CategorieComponent,
        NavBarComponent,
        ArticleComponent,
        FormComponent,
        ListComponent,
        ItemComponent,
        PaginationComponent,
        ArticleVenteComponent,
        FormulaireComponent,
        ListeComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        NgxPaginationModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

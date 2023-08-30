import { Article } from "./Article";

export interface ArticleConfection extends Article {
  fournisseur: string[];
  photo?: File;
}

export interface Article {
  id?: number;
  libelle: string;
  prix: number;
  stock: number;
  categorie: string;
  fournisseur: string[];
  ref?: string;
  photo?: File;
}

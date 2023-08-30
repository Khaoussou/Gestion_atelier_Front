import { Article } from "./Article";
import { Confection } from "./Confection";

export interface ArticleVente extends Article {
    confection: Confection[],
    cout: number,
    marge: number
    image: string,
    promo?: number
}

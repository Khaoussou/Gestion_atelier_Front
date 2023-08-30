import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Article } from 'src/app/modele/Article';
import { ArticleVente } from 'src/app/modele/Article-vente';
import { Categorie } from 'src/app/modele/Categorie';
import { MargeValidator } from './MargeValidator';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.css'],
})
export class FormulaireComponent implements OnChanges {
  @Input() articleVentes: ArticleVente[] = [];
  @Input() articleVente!: ArticleVente;
  @Input() articleConfs: Article[] = [];
  @Input() categorieVentes: Categorie[] = [];
  @Input() message!: string;
  @Output() formgroupValue: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('change') monElementRef!: ElementRef;

  public valueCheckbox: boolean = false;
  public libArticleConf: string[] = [];
  public libArticleConfFilter: string[] = [];
  public targetArticle: any = { value: '' };
  public targetQte: any;
  public index: number = 0;
  public reference: number = 0;
  public couDeFabrication!: number;
  public file!: File;
  public imageUrl: string =
    '../assets/stock-vector-default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo-2086941550.jpg';
  public tabConfection!: FormArray<any>;
  constructor(private formBuilder: FormBuilder) {}

  form = this.formBuilder.group({
    libelle: ['', Validators.required],
    categorie: ['', Validators.required],
    promo: [0, Validators.required],
    marge: [
      0,
      [
        Validators.required,
        MargeValidator.margeValidation(this.couDeFabrication),
      ],
    ],
    cout: [0, Validators.required],
    prix: [0, Validators.required],
    image: ['', Validators.required],
    confection: this.formBuilder.array(
      [
        this.formBuilder.group({
          lib: ['', Validators.required],
          quantite: [0, Validators.required],
        }),
      ],
      [Validators.minLength(3)]
    ),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if ('articleVente' in changes) {
      if (changes['articleVente'].currentValue) {
        this.form.patchValue({
          libelle: changes['articleVente'].currentValue.libelle,
          categorie: changes['articleVente'].currentValue.categorie,
          promo: changes['articleVente'].currentValue.promo,
          marge: changes['articleVente'].currentValue.marge,
          cout: changes['articleVente'].currentValue.cout,
          prix: changes['articleVente'].currentValue.prix,
        });
        if (changes['articleVente'].currentValue.promo != 0) {
          this.valueCheckbox = true;
        } else {
          this.valueCheckbox = false;
        }
        this.imageUrl = changes['articleVente'].currentValue.image;
      }
      if (this.monElementRef) {
        this.monElementRef.nativeElement.innerText = 'Update';
      }
    }
  }

  displayValeurPromo(event: Event) {
    let target: any = event.target;
    if (target.checked) {
      this.valueCheckbox = true;
    } else {
      this.valueCheckbox = false;
    }
  }

  searchArtiConf(event: Event, i: number) {
    this.index = i;
    this.targetArticle = event.target;
    this.libArticleConf = this.articleConfs.map(
      (libelle: Article) => libelle.libelle
    );
    if (this.targetArticle.value.length >= 2) {
      this.libArticleConfFilter = this.libArticleConf.filter((item) =>
        item
          .toLocaleLowerCase()
          .includes(this.targetArticle.value.toLocaleLowerCase())
      );
      console.log(this.libArticleConfFilter);
    } else {
      this.libArticleConfFilter = [];
    }
  }

  refNameCat() {
    this.reference =
      this.articleConfs.filter(
        (categorie: any) => categorie.categorie === this.form.value.categorie
      ).length + 1;
    console.log(this.articleConfs);
  }

  getValuePrix(event: Event) {
    let target: any = event.target;
    let marge: number = +target.value;
    if (target.value.length >= 4) {
      if (marge >= 5000 && marge < this.couDeFabrication / 3) {
        target.style.border = 'none';
        target.style.border = '3px solid green';
        this.form.patchValue({
          prix: this.couDeFabrication + marge,
        });
      } else {
        target.style.border = '3px solid red';
        this.form.patchValue({
          prix: this.couDeFabrication,
        });
        console.log(this.couDeFabrication);
      }
    } else {
      target.style.border = '3px solid red';
      this.form.patchValue({
        prix: this.couDeFabrication,
      });
    }
  }

  updateValueGroup(index: number, attribut: string, value: string | number) {
    const groupToUpdate = this.tabConfection.at(index);
    groupToUpdate.get(attribut)?.setValue(value);
  }

  valueQte(event: Event, i: number) {
    this.targetQte = event.target;
    this.updateValueGroup(i, 'quantite', this.targetQte.value);
    this.form.patchValue({ cout: this.coutDeFabrique() });
    this.couDeFabrication = this.coutDeFabrique();
    console.log(this.targetQte.value);
  }

  onSubmit() {
    this.form.value.image = this.imageUrl;
    this.formgroupValue.emit(this.form.value);
    this.form.reset();
    this.form.patchValue({ promo: 0 });
    this.tabConfection.clear();
    this.reference = 0;
  }

  valueArticle(nom: string) {
    this.tabConfection = this.form.get('confection') as FormArray;
    this.targetArticle.value = nom;
    this.libArticleConfFilter = [];
    console.log(this.coutDeFabrique());
    this.updateValueGroup(this.index, 'lib', this.targetArticle.value);
  }

  addArtConf() {
    this.tabConfection = this.form.get('confection') as FormArray;
    this.tabConfection.push(this.newRow());
    console.log(this.couDeFabrication);
    console.log(this.tabConfection.value);
  }

  newRow() {
    return this.formBuilder.group({
      lib: this.formBuilder.control('', Validators.required),
      quantite: this.formBuilder.control(0, Validators.required),
    });
  }

  deleteArtConf(index: number) {
    this.tabConfection = this.form.get('confection') as FormArray;
    this.confection.removeAt(index);
    this.form.patchValue({ cout: this.coutDeFabrique() });
    this.couDeFabrication = this.coutDeFabrique();
    console.log(this.tabConfection.value);
  }

  get confection() {
    return this.form.get('confection') as FormArray;
  }

  coutDeFabrique() {
    let tabConf: any = this.form.value.confection;
    let libelleArticles: any = tabConf?.map((libelle: any) => libelle.lib);
    let prix: any = [];
    tabConf = tabConf.filter((item: string) => item != '');
    let qte = tabConf?.map((qte: any) => +qte.quantite);
    libelleArticles.forEach((element: string) => {
      prix.push(
        this.articleConfs
          .filter((article: Article) => article.libelle == element)
          .map((prix) => prix.prix)
      );
    });
    console.log(prix);
    console.log(qte);
    let taille = prix.length;
    console.log(taille);
    let coutDeFabrique = 0;
    for (let i = 0; i < taille; i++) {
      coutDeFabrique += prix[i] * qte[i];
    }
    return coutDeFabrique;
  }

  onChange(event: any) {
    this.file = event.target.files[0];

    let fileReader = new FileReader();

    fileReader.readAsDataURL(this.file);

    fileReader.addEventListener('load', () => {
      this.imageUrl = fileReader.result as string;
    });
  }
}

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Article } from 'src/app/modele/Article';
import { ArticleVente } from 'src/app/modele/Article-vente';
import { Categorie } from 'src/app/modele/Categorie';
import { MargeValidator } from './MargeValidator';
import { Confection } from 'src/app/modele/Confection';
import { environment } from 'src/environments/environment.development';

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
  @Output() valueBtn: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('change') monElementRef!: ElementRef;

  public valueCheckbox: boolean = false;
  public libArticleConf: string[] = [];
  public libArticleConfFilter: string[] = [];
  public targetArticle: any = { value: '' };
  public targetQte: any;
  public index: number = 0;
  public reference: number = 0;
  public couDeFabrication!: number;
  public messageLibelle!: string;
  public file!: File;
  public imageUrl: string = environment.url;
  public tabConfection!: FormArray<any>;
  public tabValueArticle: string[] = [];
  public tabActu: string[] = [];
  public marSupp: number = 0;
  public photo!: string;
  public bap: boolean = true;
  constructor(private formBuilder: FormBuilder) {}

  form = this.formBuilder.group({
    libelle: ['', Validators.required],
    categorie: ['', Validators.required],
    promo: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    marge: [
      0,
      [
        Validators.required,
        MargeValidator.margeValidation(this.couDeFabrication),
      ],
    ],
    cout: [0, [Validators.required, Validators.min(0)]],
    prix: [0, [Validators.required, Validators.min(0)]],
    image: ['', Validators.required],
    confection: this.formBuilder.array(
      [
        this.formBuilder.group({
          lib: ['', Validators.required],
          quantite: [0, [Validators.required, Validators.min(0)]],
        }),
      ],
      [Validators.minLength(3)]
    ),
  });

  // get image() {
  //   return this.form.get('image');
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if ('articleVente' in changes) {
      if (changes['articleVente'].currentValue) {
        this.tabConfection = this.form.get('confection') as FormArray;
        console.log(changes['articleVente'].currentValue.image);

        this.form.patchValue({
          libelle: changes['articleVente'].currentValue.libelle,
          categorie: changes['articleVente'].currentValue.categorie,
          promo: changes['articleVente'].currentValue.promo,
          marge: changes['articleVente'].currentValue.marge,
          cout: changes['articleVente'].currentValue.cout,
          prix: changes['articleVente'].currentValue.prix,
          // image: changes['articleVente'].currentValue.image,
        });
        console.log(changes['articleVente'].currentValue);
        console.log(changes['articleVente'].currentValue.image as string);

        let tab: Confection[] = changes['articleVente'].currentValue.confection;
        this.tabConfection.clear();
        tab.forEach((confection) => {
          this.tabConfection.push(
            this.formBuilder.group({
              lib: confection.article.libelle,
              quantite: confection.quantite,
            })
          );
        });
        if (changes['articleVente'].currentValue.promo != 0) {
          this.valueCheckbox = true;
        } else {
          this.valueCheckbox = false;
        }
        this.imageUrl = changes['articleVente'].currentValue.image;
        this.form.patchValue({ image: '' });
      }
      if (this.monElementRef) {
        this.monElementRef.nativeElement.innerText = 'Update';
      }
    }
  }

  displayValeurPromo(event: Event) {
    let target: HTMLInputElement = event.target as HTMLInputElement;
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
    if (this.targetArticle.value.length >= 1) {
      this.libArticleConfFilter = this.libArticleConf.filter((item) =>
        item
          .toLocaleLowerCase()
          .includes(this.targetArticle.value.toLocaleLowerCase())
      );
      const foundItem = this.tabValueArticle.find((item) =>
        this.libArticleConfFilter.includes(item)
      );
      if (foundItem) {
        console.log(
          this.libArticleConfFilter.splice(
            this.libArticleConfFilter.indexOf(foundItem),
            this.tabValueArticle.length
          )
        );
        this.tabActu = this.libArticleConfFilter;
      } else {
        this.tabActu = this.libArticleConfFilter;
      }
      console.log(this.libArticleConfFilter);
      console.log(this.tabActu);
    } else {
      // this.libArticleConfFilter = [];
      this.tabActu = [];
    }
  }

  onValid(event: Event) {
    let target: any = event.target;
    this.valueBtn.emit(target.innerText);
    console.log(target.innerText);
  }

  refNameCat() {
    this.reference =
      this.articleVentes.filter(
        (categorie: any) => categorie.categorie === this.form.value.categorie
      ).length + 1;
    console.log(this.articleVentes);
  }

  get marge() {
    return this.form.get('marge');
  }

  getValuePrix(event: Event) {
    let target: any = event.target;
    let marge: number = +target.value;
    if (target.value.length >= 4) {
      // this.marge?.setValidators(
      //   MargeValidator.margeValidation(this.couDeFabrication)
      // );
      console.log(this.marge?.errors);
      if (marge >= 5000 && marge < this.couDeFabrication / 3) {
        target.style.border = 'none';
        target.style.border = '3px solid green';
        this.form.patchValue({
          prix: this.couDeFabrication + marge,
        });
      } else {
        target.style.border = '3px solid red';
        this.marSupp = this.couDeFabrication / 3;
        this.form.patchValue({
          prix: 0,
        });
      }
    } else {
      target.style.border = '3px solid red';
      this.form.patchValue({
        prix: 0,
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
    this.tabValueArticle = [];
    this.imageUrl = environment.url;
    this.reference = 0;
    this.couDeFabrication = 0;
  }

  valueArticle(nom: string) {
    this.tabConfection = this.form.get('confection') as FormArray;
    this.targetArticle.value = nom;
    console.log(this.targetArticle.value);
    // if (this.targetArticle.value) {
    //   this.bap = false;
    // } else {
    //   this.bap = true;
    // }
    this.tabValueArticle.push(this.targetArticle.value);
    this.tabActu = [];
    console.log(this.coutDeFabrique());
    this.updateValueGroup(this.index, 'lib', this.targetArticle.value);
  }

  addArtConf() {
    console.log(this.index);
    console.log(this.libArticleConfFilter);
    this.tabConfection = this.form.get('confection') as FormArray;
    console.log(this.tabConfection.value);
    console.log(this.libArticleConfFilter.length);
    console.log(this.tabActu.length);

    if (this.targetArticle.value != '') {
      this.bap = false
      console.log(this.targetArticle.value);
    }
    if (this.tabConfection.value.length == 0) {
      this.index = 0;
    }
    if (this.index == 0 && this.tabConfection.value.length == 0) {
      this.tabConfection.push(this.newRow());
    }
    if (
      this.tabConfection.value[this.index].lib != undefined &&
      this.tabConfection.value[this.index].lib != ''
    ) {
      console.log(this.tabConfection.value.length);
      this.index = this.tabConfection.value.length - 1;
      console.log(this.index);
      this.libArticleConfFilter = this.tabConfection.value
      console.log(this.libArticleConfFilter);
      console.log(this.libArticleConfFilter.length);
      console.log(this.targetArticle.value);
      console.log(this.tabConfection.value[this.index].lib);

      if (this.libArticleConfFilter.length == 0) {
        this.messageLibelle = "Cet article n'existe pas !";
        setTimeout(() => {
          this.messageLibelle = '';
        }, 5000);
      } else {
        this.tabConfection.push(this.newRow());
        this.index++;
      }
      console.log(this.tabConfection.value.length);
    } else {
      this.messageLibelle = 'Veuillez remplir le libelle svp !';
      setTimeout(() => {
        this.messageLibelle = '';
      }, 5000);
    }
    console.log(this.index);
  }

  newRow() {
    console.log(this.bap);
    return this.formBuilder.group({
      lib: this.formBuilder.control('', Validators.required),
      quantite: this.formBuilder.control(
        0,
        Validators.required
      ),
    });
  }

  deleteArtConf(index: number) {
    this.index = this.index - 1;
    console.log(this.index);
    this.tabConfection = this.form.get('confection') as FormArray;
    this.confection.removeAt(index);
    this.form.patchValue({ cout: this.coutDeFabrique() });
    this.couDeFabrication = this.coutDeFabrique();
    console.log(this.tabConfection.value);
    console.log(this.libArticleConfFilter.length);
    console.log(this.libArticleConfFilter);
    console.log(this.libArticleConfFilter);
    console.log(this.tabActu);
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
      console.log(this.imageUrl);
    });
  }
}

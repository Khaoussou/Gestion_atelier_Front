import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Categorie } from '../../modele/Categorie';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Article } from 'src/app/modele/Article';
import { Fournisseur } from 'src/app/modele/Fournisseur';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit, OnChanges {
  @Input() message!: string;
  @Input() categories: Categorie[] = [];
  @Input() fournisseurs: Fournisseur[] = [];
  @Input() form: any;
  @Input() articles: Article[] = [];
  @Input() article: Article[] = [];
  @Output() formgroupValue: EventEmitter<FormData> =
    new EventEmitter<FormData>();
  @Output() valid: EventEmitter<string> = new EventEmitter<string>();

  public libelle!: string;
  public libCat!: string;
  public refLib!: string;
  public file!: File;
  public number!: number;
  public formgroup!: FormGroup;
  public reference: number = 0;
  public filterTabFour: string[] = [];
  public tabActu: string[] = [];
  public tabFour: string[] = [];
  public tabInsert: string[] = [];
  public imageUrl: string =
    '../assets/stock-vector-default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo-2086941550.jpg';

  public errorMessage = {
    'libelle.required': 'Le libelle est obligatoire !',
    'prix.required': 'Le prix est obligatoire !',
    'prix.min': 'Le prix doit etre positif !',
    'stock.required': 'Le stock est obligatoire !',
    'stock.min': 'Le stock doit etre positif !',
    'categorie.required': 'La categorie est obligatoire !',
    'fournisseur.required': 'Le fournisseur est obligatoire !',
    'photo.required': 'La photo est obligatoire !',
  };

  constructor() {
    this.formgroup = new FormGroup({
      libelle: new FormControl('', Validators.required),
      prix: new FormControl('', [Validators.required, Validators.min(1)]),
      stock: new FormControl('', [Validators.required, Validators.min(1)]),
      categorie: new FormControl('', Validators.required),
      fournisseur: new FormControl('', Validators.required),
      photo: new FormControl('', Validators.required),
    });
  }

  @ViewChild('change') monElementRef!: ElementRef;
  @ViewChild('ref') monElement!: ElementRef;

  ngOnInit(): void {
    console.log();
  }

  displayErrorMessage(error: ValidationErrors, message: string) {
    console.log(this.errorMessage);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('article' in changes) {
      changes['article'].currentValue.forEach((value: any) => {
        this.formgroup.patchValue({ libelle: value.libelle });
        this.formgroup.patchValue({ prix: value.prix });
        this.formgroup.patchValue({ stock: value.stock });
        this.formgroup.patchValue({ categorie: value.categorie });
        this.tabInsert = value.fournisseur.map(
          (fournisseur: any) => fournisseur.nom_complet
        );

        this.imageUrl =
          'http://127.0.0.1:8000/storage/' + value.photo.split('/')[1];
        this.formgroup.patchValue({ fournisseur: this.tabInsert });
        this.monElementRef.nativeElement.innerText = 'Edit';
      });
      console.log(this.formgroup.value);
    }
  }

  refNameCat() {
    this.reference =
      this.articles.filter(
        (categorie: any) =>
          categorie.categorie === this.formgroup.value.categorie
      ).length + 1;
    console.log(this.articles);
  }

  fourValue() {
    if (this.formgroup.value.fournisseur.length >= 2) {
      this.tabFour = [];
      this.tabFour = this.fournisseurs.map((fournisseur) => fournisseur.nom);
      console.log(this.tabFour);
      console.log(this.tabInsert);
      this.filterTabFour = this.tabFour.filter((item) =>
        item
          .toLowerCase()
          .includes(this.formgroup.value.fournisseur.toLowerCase())
      );
      console.log(this.filterTabFour);
      const foundItem = this.tabInsert.find((item) =>
        this.filterTabFour.includes(item)
      );
      if (foundItem) {
        console.log(
          this.filterTabFour.splice(
            this.filterTabFour.indexOf(foundItem),
            this.tabInsert.length
          )
        );
        this.tabActu = this.filterTabFour;
        console.log(this.filterTabFour);
        console.log(this.tabActu);
      } else {
        this.tabActu = this.filterTabFour;
      }
      console.log(this.filterTabFour);
    }
  }

  onClick(nom: string) {
    const index = this.filterTabFour.indexOf(nom);

    if (index !== -1) {
      this.tabInsert.push(nom);
      this.filterTabFour.splice(index, 1);
    }
    console.log(this.tabInsert);
    console.log(this.tabFour);
    console.log(this.filterTabFour);
  }

  clickOn(nom: string) {
    const index = this.tabInsert.indexOf(nom);

    if (index !== -1) {
      this.filterTabFour.push(nom);
      this.tabInsert.splice(index, 1);
    }
    console.log(this.tabInsert);
    console.log(this.tabFour);
    console.log(this.filterTabFour);
  }

  onSubmit() {
    const formData = new FormData();
    this.formgroup.value.fournisseur = this.tabInsert.reduce(
      (a: string, b: string) => {
        return a + ',' + b;
      }
    );
    console.log(this.formgroup.value.fournisseur);
    formData.append('libelle', this.formgroup.value.libelle);
    formData.append('photo', this.file);
    formData.append('prix', this.formgroup.value.prix);
    formData.append('stock', this.formgroup.value.stock);
    formData.append('categorie', this.formgroup.value.categorie);
    formData.append('fournisseur', this.formgroup.value.fournisseur);
    this.formgroupValue.emit(formData);
    console.log(formData);
    console.log(this.formgroup.value.fournisseur);
    console.log(this.tabInsert);
    this.formgroup.reset()
    
    this.imageUrl = 
    '../assets/stock-vector-default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo-2086941550.jpg';
    this.tabInsert = [];
    this.tabActu = [];
    this.reference = 0
  }

  onValid(event: Event) {
    let target: any = event.target;
    this.valid.emit(target);
    console.log(target);
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

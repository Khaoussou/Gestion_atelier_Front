import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { CategorieService } from '../service/categorie.service';
import { Categorie } from '../modele/Categorie';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.css'],
})
export class CategorieComponent implements OnInit {
  public categories: Categorie[] = [];
  public lib!: string;
  public yes: boolean = true;
  public checkedInput!: boolean;
  public element!: HTMLInputElement;
  public value!: number;
  public updateValue!: number;
  public ids: number[] = [];
  checked: boolean = false;
  name = '';
  disabledInput: boolean = false;
  disabledCheckbox: boolean = true;
  id: boolean = true;
  message: string = '';
  disabledDelete: boolean = true;
  valueBout: boolean = true;
  p: number = 1;
  itemsPerPage: number = 3;
  totalCategories!: number;
  constructor(private categorieService: CategorieService) {}
  ngOnInit(): void {
    this.getCategories();
  }
  @ViewChild('input') monElementRef!: ElementRef;

  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  getCategories() {
    this.categorieService.getAll().subscribe(
      (response) => {
        this.categories = response.data;
        this.totalCategories = response.data.length;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checkAllInput(event: Event) {
    if (event.target && 'checked' in event.target) {
      if (event.target.checked && !this.id) {
        this.disabledDelete = false;
        this.ids = [];
        for (let i = 0; i < this.categories.length; i++) {
          console.log(this.categories[i].id);
          this.ids.push(this.categories[i].id as number);
          console.log(this.ids);
          if (i == 2) {
            return;
          }
          this.inputs.forEach((elementRef: ElementRef<HTMLInputElement>) => {
            this.element = elementRef.nativeElement;
            this.element.checked = true;
          });
        }
      } else if (!event.target.checked || this.id) {
        this.disabledDelete = true;
        this.ids = [];
        console.log(this.ids);
        this.inputs.forEach((elementRef: ElementRef) => {
          const element = elementRef.nativeElement;
          element.checked = false;
        });
      }
    }
  }

  isChecked(event: Event, value: number | string | undefined): void {
    console.log(event);
    if (typeof value == 'number') {
      if (event.target && 'checked' in event.target) {
        if (event?.target.checked && !this.id) {
          this.disabledDelete = false;
          this.ids.push(value);
          if (this.ids.length == 3) {
            this.checkedInput = true;
          }
        } else if (!event.target.checked || this.id) {
          this.checkedInput = event.target.checked as boolean;
          this.ids.splice(this.ids.indexOf(value), 1);
          if (this.ids.length == 0) {
            this.disabledDelete = true;
          }
        }
      }
    }
    if (typeof value == 'string' && !this.id) {
      if (event.target) {
        let target: any = event.target;
        this.updateValue = target.getAttribute('id');
      }
      this.name = value;
      this.disabledInput = false;
    }
  }

  addOrUpdateCategorie(id?: number) {
    if (id == undefined) {
      this.categorieService.add({libelle: this.name}).subscribe(
        (response) => {
          this.message = response.message;
          setTimeout(() => {
            this.message = '';
          }, 5000);
          this.getCategories();
          this.valueBout = true;
        },
        (error) => {
          this.message = error.error.message;
        }
      );
    } else {
      this.categorieService.updateCat(id, {libelle: this.name}).subscribe(
        (response) => {
          this.message = response.message;
          setTimeout(() => {
            this.message = '';
          }, 5000);
          this.getCategories();
          this.valueBout = true;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  deleteCategorie() {
    this.categorieService.deleteCategorie(this.ids).subscribe(
      (response) => {
        this.message = response.message;
        setTimeout(() => {
          this.message = '';
        }, 5000);
        this.getCategories();
        this.checkedInput = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  inputDisabled() {
    if (this.id) {
      this.yes = true;
      this.disabledInput = false;
      this.disabledCheckbox = true;
    } else {
      this.yes = false;
      this.disabledInput = true;
      this.disabledCheckbox = false;
    }
  }

  newCategorie() {
    if (this.id) {
      this.addOrUpdateCategorie();
      this.name = '';
    } else {
      this.addOrUpdateCategorie(this.updateValue);
      this.name = '';
    }
  }

  check() {
    if (this.name.length >= 3) {
      this.categorieService.searchCategorie(this.name).subscribe(
        (response) => {
          if (response.data.length !== 0) {
            this.valueBout = true;
            this.message = response.message;
          } else {
            this.valueBout = false;
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.valueBout = true;
    }
  }
}

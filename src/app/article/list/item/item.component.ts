import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from 'src/app/modele/Article';

@Component({
  selector: '.app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent {
  public itemsPerPage: number = 3;
  public p: number = 1;
  public n: number = 3;
  public target: any;
  public interval: any;
  @Input() articles: Article[] = [];
  @Output() idUpdate: EventEmitter<number> = new EventEmitter<number>();
  @Output() idDelete: EventEmitter<number> = new EventEmitter<number>();

  delete(event?: Event) {
    this.target = event?.target;
    if (this.target.textContent?.includes('Supprimer')) {
      this.interval = setInterval(() => {
        this.n = this.n - 1;
        this.target!.textContent = `OK(${this.n})`;
        if (this.n === 0) {
          clearInterval(this.interval);
          this.n = 3;
          this.target!.textContent = 'Supprimer';
        }
      }, 1000);
    } else if (this.target.textContent?.includes('OK')) {
      this.idDelete.emit(this.target.getAttribute('id'));
      this.target.textContent = 'Supprimer';
    }
  }

  update(event: Event) {
    let target: any = event.target;
    this.idUpdate.emit(target.getAttribute('id'));
  }
}

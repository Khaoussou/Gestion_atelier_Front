import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from 'src/app/modele/Article';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent {
  @Input() articles: Article[] = [];
  @Output() idDelete: EventEmitter<number> = new EventEmitter<number>();
  @Output() idUpdate: EventEmitter<number> = new EventEmitter<number>();
  getIdDelete(id: number) {
    this.idDelete.emit(id);
  }
  getIdUpdate(id: number) {
    this.idUpdate.emit(id);
  }
}

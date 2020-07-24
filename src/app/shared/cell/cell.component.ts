import {Component, Input, OnInit} from '@angular/core';
import {Cell} from '../cell.model';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {

  @Input() cell: Cell;

  constructor() { }

  ngOnInit(): void {
  }

  public get class(): string {
    const base = `color-${this.cell.value}`;
    if (this.cell.value === null) {
      return 'empty';
    }
    if (this.cell.wasMerged) {
      return `${base} merged`;
    }
    return base;
  }

}

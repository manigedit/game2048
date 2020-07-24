import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {Movement} from './movement.enum';
import {Cell} from './cell.model';
import {MOTION_HANDLER} from './motion-handler';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  cells: Cell[] = Array(16).fill(null).map(e => new Cell());
  rows: Cell[][] = [];
  columns: Cell[][] = [];
  score = 0;

  constructor() {
    this.initializeGame();
  }

  hasMoves() {

    const column1 = this.columns[0];
    const column2 = this.columns[1];
    const column3 = this.columns[2];
    const column4 = this.columns[3];
    // tslint:disable-next-line:max-line-length
    const hasColumnMoves = this.areSameValueCells(column1[0], column1[1]) || this.areSameValueCells(column1[1], column1[2]) || this.areSameValueCells(column1[2], column1[3]) ||
      // tslint:disable-next-line:max-line-length
      this.areSameValueCells(column2[0], column2[1]) || this.areSameValueCells(column2[1], column2[2]) || this.areSameValueCells(column2[2], column2[3]) ||
      // tslint:disable-next-line:max-line-length
      this.areSameValueCells(column3[0], column3[1]) || this.areSameValueCells(column3[1], column3[2]) || this.areSameValueCells(column3[2], column3[3]) ||
      // tslint:disable-next-line:max-line-length
      this.areSameValueCells(column4[0], column4[1]) || this.areSameValueCells(column4[1], column4[2]) || this.areSameValueCells(column4[2], column4[3]);

    if (hasColumnMoves) {
      return true;
    }
    const row1 = this.rows[0];
    const row2 = this.rows[1];
    const row3 = this.rows[2];
    const row4 = this.rows[3];

    const hasRowMoves =
      this.areSameValueCells(row1[0], row1[1]) || this.areSameValueCells(row1[1], row1[2]) || this.areSameValueCells(row1[2], row1[3]) ||
      this.areSameValueCells(row2[0], row2[1]) || this.areSameValueCells(row2[1], row2[2]) || this.areSameValueCells(row2[2], row2[3]) ||
      this.areSameValueCells(row3[0], row3[1]) || this.areSameValueCells(row3[1], row3[2]) || this.areSameValueCells(row3[2], row3[3]) ||
      this.areSameValueCells(row4[0], row4[1]) || this.areSameValueCells(row4[1], row4[2]) || this.areSameValueCells(row4[2], row4[3]);

    return hasRowMoves;
  }

  getEmptyCells(): Cell[] {
    console.log('form get emptycell of service')
    return this.cells.reduce((acc: Cell[], cell) => {
      if (cell.isEmpty) {
        acc.push(cell);
      }
      return acc;
    }, []);
  }

  get isGameOver(): boolean {
    return !this.hasMoves() && this.getEmptyCells().length === 0;
  }

  restart() {
    this.cells = Array(16).fill(null).map(_ => new Cell());
    this.score = 0;
    this.initializeGame();
  }


  initializeGame() {
    this.columns = [
      [this.cells[0], this.cells[4], this.cells[8], this.cells[12]],
      [this.cells[1], this.cells[5], this.cells[9], this.cells[13]],
      [this.cells[2], this.cells[6], this.cells[10], this.cells[14]],
      [this.cells[3], this.cells[7], this.cells[11], this.cells[15]],
    ];

    this.rows = [
      [this.cells[0], this.cells[1], this.cells[2], this.cells[3]],
      [this.cells[4], this.cells[5], this.cells[6], this.cells[7]],
      [this.cells[8], this.cells[9], this.cells[10], this.cells[11]],
      [this.cells[12], this.cells[13], this.cells[14], this.cells[15]],
    ];
  }

  move(direction: Movement): Observable<any> {
    console.log('From the move function of service', direction, Movement.Left);
    return MOTION_HANDLER[direction](direction === Movement.Left || direction === Movement.Right ? this.columns : this.rows).
      pipe(map((mergeScore) => {
        this.score += mergeScore;
        console.log('from move fn , score is', this.score, mergeScore)
        return this.score;
    }));
  }



  randomize() {
    const emptyCell: Cell[] = this.getEmptyCells();
    if (emptyCell.length === 0) {
      return;
    }
    const randIndex = this.randomIntFromInterval(0, emptyCell.length - 1);
    const randValue = this.randomIntFromInterval(1, 2) === 1 ? 2 : 4;
    emptyCell[randIndex].value = randValue;
  }


  randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  areSameValueCells(cell1: Cell, cell2: Cell) {
    return cell1.value === cell2.value;
  }

}

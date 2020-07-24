import { Movement } from './movement.enum';
import { Cell } from './cell.model';

import { Observable, of, from } from 'rxjs';
import { map, delay, mergeMap, pairwise,  } from 'rxjs/operators';

/**
 * @param {Cell[]} cellGroup1 First row / column of cells as array containing 4 cells
 * @param {Cell[]} cellGroup2 Second row / column of cells as array conataning 4 cells
 */
function operation(cellGroup1: Cell[], cellGroup2: Cell[] ): number {
    let mergeScore = 0;
    if (cellGroup1[0].merge(cellGroup2[0])) {
      console.log('int the first statement')
         mergeScore += cellGroup1[0].value;
        }
    if (cellGroup1[1].merge(cellGroup2[1])) {
      console.log('int the  statement 2')
            mergeScore += cellGroup1[1].value;
        }
    if (cellGroup1[2].merge(cellGroup2[2])) {
      console.log('int the 3 statement')
            mergeScore += cellGroup1[2].value;
        }
    if (cellGroup1[3].merge(cellGroup2[3])) {
      console.log('int the 4 statement')
            mergeScore += cellGroup1[3].value;
        }

    console.log('oprands', cellGroup1, cellGroup2)

    console.log('from the motion handler operator mergescore', mergeScore)
    return mergeScore;


}

function mergeBoardCells(operands: Cell[][][]): Observable<any> {
  return from( operands ).pipe(
    mergeMap( operand => {
      let delaTime = 0;
      return from(operand).pipe(pairwise(), mergeMap(pair => {
        delaTime += 50;
        return of(pair).pipe(delay(delaTime));
      }));
    } ) , map(([operand1, operand2]) => operation(operand2, operand1))
  );
}


function resetMerge( cellGroups: Cell[][] ) {
  cellGroups.forEach(cellGroup => cellGroup.forEach(cell => cell.resetMerged()));
}

export const MOTION_HANDLER: { [i: number]: (cellGroups: Cell[][]) => Observable<any> } = {
  [Movement.Up] : (rows: Cell[][]) => {
    resetMerge(rows);
    const operands = [[rows[1], rows[0]], [rows[2], rows[1], rows[0]], [rows[3], rows[2], rows[1], rows[0]]];
    console.log('operands from up event handler',operands)
    return mergeBoardCells(operands);
  },
  [Movement.Down] : (rows: Cell[][]) => {
    resetMerge(rows);
    const operands = [[rows[2], rows[3]], [rows[1], rows[2], rows[3]], [rows[0], rows[1], rows[2], rows[3]]];
    return mergeBoardCells(operands);
  },
  [Movement.Left] : (columns: Cell[][]) => {
    resetMerge(columns);
    const operands = [[columns[1], columns[0]], [columns[2], columns[1], columns[0]], [columns[3], columns[2], columns[1], columns[0]]];
    return mergeBoardCells(operands)
  },
  [Movement.Right] : (columns: Cell[][]) => {
    resetMerge(columns);
    const operands = [[columns[2], columns[3]], [columns[1], columns[2], columns[3]], [columns[0], columns[1], columns[2], columns[3]]];
    return mergeBoardCells(operands);
  }
};

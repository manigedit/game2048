import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellComponent } from './cell/cell.component';
import { BoardComponent } from './board/board.component';
import {GameService} from './game.service';



@NgModule({
  declarations: [CellComponent, BoardComponent],
  imports: [
    CommonModule
  ],
  exports: [
    CellComponent,
    BoardComponent
  ],
  providers: [
    GameService
  ]
})
export class SharedModule { }

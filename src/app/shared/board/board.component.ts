import {Component, HostListener, OnInit} from '@angular/core';
import {Movement} from '../movement.enum';
import {Cell} from '../cell.model';
import {GameService} from '../game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  constructor(private game: GameService) { }

  CONTROLS_MAP: any = {
    38: Movement.Up,
    39: Movement.Right,
    40: Movement.Down,
    37: Movement.Left
  };

  cells: Cell[];
  gameOver = false;
  score = -1;
  completed = false;
  highScoreStorageKey = 'high-scores-for-2048';
  highScores = [];

  defaultTouch = { x: 0, y: 0, time: 0 };

  ngOnInit(): void {
    this.initializeGame();
    this.initializeHighScores();
  }

  handleBoardSwipe(direction : any) {
    let moveSuccessful = false;
    if (this.gameOver || direction === undefined) {
      return;
    }
    this.game.move(direction).subscribe((mergeScore: number) => {
      moveSuccessful = moveSuccessful || this.score < mergeScore;
    }, console.error, () => {
      if (this.gameOver) {
        return;
      }
      if (moveSuccessful) {
        this.game.randomize();
        console.log('from move successful function');
      }
      this.score = this.game.score;
      this.gameOver = this.game.isGameOver;
    });
  }


  @HostListener('window:keyup', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {
    const direction = this.CONTROLS_MAP[event.keyCode];
    this.handleBoardSwipe(direction)

  }

  @HostListener('mousedown', ['$event'])
  @HostListener('mouseup', ['$event'])
  handleMouse(event) {

    let touch = { pageX: event.clientX, pageY: event.clientY };
    if (event.type === 'mousedown') {
      this.defaultTouch.x = touch.pageX;
      this.defaultTouch.y = touch.pageY;
      this.defaultTouch.time = +new Date();
    } else if (event.type === 'mouseup') {
      let deltaX = event.pageX - this.defaultTouch.x;
      let deltaY = event.pageY - this.defaultTouch.y;
      let deltaTime = (+new Date()) - this.defaultTouch.time;

      if (deltaTime < 500) {
        // touch movement lasted less than 500 ms
        if (Math.abs(deltaX) > 60) {

          if (deltaX > 0) {
            // right swipe
            this.handleBoardSwipe(Movement.Right);
          } else {
            // left swipe
            // this.doSwipeLeft(event);
            this.handleBoardSwipe(Movement.Left);
          }
        }

        if (Math.abs(deltaY) > 60) {

          if (deltaY > 0) {
            // Down Swipe
            this.handleBoardSwipe(Movement.Down);
          } else {
            // up swipe
            this.handleBoardSwipe(Movement.Up)
          }
        }
      }
    }

  }


  initializeGame() {
    this.cells = this.game.cells;
    this.gameOver = this.completed = false;
    this.game.randomize();
    this.game.randomize();
    this.cells.map(cell => cell.success.subscribe(this.successHandler));
  }

  restart() {
    this.setHighScore(this.score);
    this.score = 0;
    this.game.restart();
    this.initializeGame();
  }

  successHandler = () => {
    this.completed = true;
    this.gameOver = true;
    localStorage.setItem('score-for-2048', this.score.toString())
  }

  initializeHighScores() {
    const previousHighScores = JSON.parse(localStorage.getItem(this.highScoreStorageKey));
    if (previousHighScores) {
      this.highScores.push(...JSON.parse(previousHighScores));
    }
  }

  setHighScore(currentScore: number){
      this.highScores.push(currentScore);
      this.highScores =  this.highScores.sort().reverse();
      this.highScores = this.highScores.slice(0, Math.min(10, this.highScores.length));
      localStorage.setItem(this.highScoreStorageKey, JSON.stringify(this.highScores));
  }


}

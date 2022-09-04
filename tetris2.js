/* 
Referenced: Michael Karen's Tetris game
https://github.com/melcor76/js-tetris.git
*/

import { "tetris-config" as config } from './config.js';
import { "user-info" as user } from './user.js';
import { GameBoard } from './gameBoard.js';

class Tetris {
  constructor() {
    this.canvas = document.getElementById('game-board');
    this.nextCanvas = document.getElementById('next-shape');
    this.ctx = this.canvas.getContext('2d');
    this.nextCtx = this.nextCanvas.getContext('2d');
    this.gameBoard = new GameBoard(this.ctx, this.nextCtx);
    this.setup();
  }

  setup() {
    document.addEventListener(
      'keydown', 
      this.keyEventHandler.bind(this)
    );
    window.addEventListener(
      'resize', 
      this.resizeEventHandler.bind(this)
    );
    document.getElementById('btn-restart')?.addEventListener(
      'click', 
      this.restartEventHandler.bind(this)
    );
    document.querySelector('.game-control-container')?.addEventListener(
      'click',
      this.keyControlEventHandler.bind(this)
    );
  }

  start() {
    this.lastRender = 0;
    this.initUser();
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    let progress = time - this.lastRender;
  
    if (progress > config.levels[user.level]) { 
      if (!this.gameBoard.move(-1)) { // for saving to boardArray when it hits others
              this.gameOver();
              return;
      }
      this.gameBoard.draw();
      this.updateGameInfo();
      this.lastRender = time;
    }   
    this.gameBoard.requestId = requestAnimationFrame(this.animate.bind(this)); 
  }

  initUser() {
    user.level = 0;
    user.lines = 0;
    user.score = 0;
  }

  keyEventHandler(e) {
    if (this.gameBoard.requestId > -1) {  // -1 means gameOver
      if (Object.values(config.keys).includes(e.keyCode)) {
        this.move(e.keyCode);
        e.stopPropagation();
      }
    }
  }

  move(direction) {
    this.gameBoard.move(direction);
    this.gameBoard.draw();
  }

  resizeEventHandler(e) {
    this.gameBoard.resize();
    this.gameBoard.nextPiece.draw();
    this.gameBoard.draw();
    if (this.gameBoard.requestId === -1) {       //display game over
      this.gameOver(); 
    }
  }

  restartEventHandler(e) {
    this.gameBoard.init();
    this.gameBoard.initBoard();
    this.gameBoard.draw();
    this.lastRender = 0;
    requestAnimationFrame(this.animate.bind(this));
  }
  
  keyControlEventHandler(e) {
    let controlId;
    if (e.target.className === 'controlBtn') {
      controlId = e.target.id;
    } else {
      return;
    }
    
    if (this.gameBoard.requestId === -1) {
      return;
    }

    if (Object.keys(config.controlBtn).includes(controlId)) {
      this.move(config.controlBtn[controlId]);
    }
    e.stopPropagation();
  }

  gameOver() {
    cancelAnimationFrame(this.gameBoard.requestId);
    this.gameBoard.requestId = -1; // initialize for checking gameOver
    this.showMessage('GAME OVER');
  }

  showMessage(message) {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(1, 8, 8, 2); 
    this.ctx.font = '1.2px Arial'
    this.ctx.fillStyle = 'red';
    this.ctx.fillText(message, 1.4, 9.4);
  }

  updateGameInfo() {
    document.getElementById('game-level').innerText = user.level + 1;
    document.getElementById('game-score').innerText = user.score;
    document.getElementById('total-lines').innerText = user.lines;
  }
}

new Tetris().start();
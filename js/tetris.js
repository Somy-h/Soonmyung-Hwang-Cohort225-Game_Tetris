/* 
Referenced: Michael Karen's Tetris game
https://github.com/melcor76/js-tetris.git
*/
import { User } from './user.js';
import { GameBoard } from './gameBoard.js';
import { GameSound } from './gameSound.js';

class Tetris {
  constructor() {
    this.canvas = document.getElementById('game-board');
    this.nextCanvas = document.getElementById('next-shape');
    this.ctx = this.canvas.getContext('2d');
    this.nextCtx = this.nextCanvas.getContext('2d');
    this.gameBoard = new GameBoard(this.ctx, this.nextCtx);
    this.isStarted = false;
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
    document.querySelector(".game-play-buttons")?.addEventListener(
      'click',
      this.playBtnEventHandler.bind(this)
    );
    document.querySelector('.game-control-container')?.addEventListener(
      'click',
      this.controlBtnEventHandler.bind(this)
    );
  }

  firstScreen() {
    this.initSounds();
    this.initUser();
    this.showMessage("START GAME");
  }

  start() {
    this.setGameState(1);
    this.lastRender = 0;
    this.sound.play('background');
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    if (gameState.play === 0) { // pause
      return;
    }
    let progress = time - this.lastRender;

    if (progress > config.levels[this.user.level]) { 
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
 
  initSounds() {
    this.sound = new GameSound();
    this.gameBoard.setSound(this.sound);
  }

  initUser() {
    this.user = new User(this.sound);
    this.gameBoard.setUser(this.user);
  }

  keyEventHandler(e) {
    if (!this.isStarted) {
      this.isStarted = true;
      this.start();
      return;
    }
    if ((this.gameBoard.requestId > -1) // -1 means gameOver
        && (gameState.play === 1)
        ) {  
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

  playBtnEventHandler(e) {
    let buttonId;
    let targetNode;
    if (e.target.closest('.ctrl-play-ico')) {
      targetNode = e.target.closest('.ctrl-play-ico');
      buttonId = targetNode.id;

      if (buttonId === 'btn-play') {
        this.playToggle(targetNode);
        return;
      }
      if (buttonId === 'btn-restart') {
        this.restart();
        return;
      }
      if (buttonId === 'btn-sound') {
        this.soundToggle(targetNode);
        return;
      }
    } else {
      return;
    }
  }

  playToggle(btnNode) {
    btnNode.classList.toggle('on');
    if (btnNode.classList.contains('on')) {
      this.replay();
    } else {
      this.pause();
    }
  }

  soundToggle(btnNode) {
    btnNode.classList.toggle('on');
    this.sound.toggleSounds();
  }

  replay() {
    gameState.play = 1; // play
    this.lastRender = 0;
    this.sound.play('background');
    requestAnimationFrame(this.animate.bind(this));
  }
  
  pause() {
    cancelAnimationFrame(this.requestId);
    gameState.play = 0; // pause
    this.sound.pause('background');
    this.showMessage('PAUSED');
  }

  restart() {
    this.gameBoard.init();
    this.gameBoard.initBoard();
    this.gameBoard.draw();
    this.lastRender = 0;
    this.setGameState(1);
    this.sound.play('background');
    requestAnimationFrame(this.animate.bind(this));
  }

  setGameState(state) { // 1: play, 0: pause
    state 
      ? document.getElementById('btn-play')?.classList.add('on')
      : document.getElementById('btn-play')?.classList.remove('on');
    gameState.play = state;
  }
  
  controlBtnEventHandler(e) {
    let controlId;
    if (e.target.className === 'controlBtn') {
      controlId = e.target.id;
    } else if (e.target.closest('.controlBtn')) {
      controlId = e.target.closest('.controlBtn').id;
    } else return;
    
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
    this.sound.play('gameOver');
    this.sound?.pause('background');
    this.showMessage('GAME OVER');
  }

  showMessage(message) {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(1, 8, 8.2, 2); 
    this.ctx.font = '1.2px Arial'
    this.ctx.fillStyle = 'red';

    let messageOffsetX = (8.3 - (message.length * 0.8)) /2 + 1;
    this.ctx.fillText(message, messageOffsetX, 9.4);
  }
 
  updateGameInfo() {
    document.getElementById('game-level').innerText = this.user.level + 1;
    document.getElementById('game-score').innerText = this.user.score;
    document.getElementById('total-lines').innerText = this.user.lines;
    document.getElementById('total-hearts').innerText = this.user.hearts;
  }
}

new Tetris().firstScreen();
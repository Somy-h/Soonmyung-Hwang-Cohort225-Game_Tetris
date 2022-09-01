/* 
Referenced: Michael Karen's Tetris game
https://github.com/melcor76/js-tetris.git
*/

import {
  "tetis-config" as config
} from './config.js';



import {
  GameBoard
} from './gameBoard.js';

const canvas = document.getElementById('game-board');
const nextCanvas = document.getElementById('next-shape');
const ctx = canvas.getContext('2d');
const nextCtx = nextCanvas.getContext('2d');


const User = {
  level: 0, // level 0-9 : display 1-10
  score: 0,
  lines: 0   // # of lines cleared      
};

let lastRender;
let gameBoard;
function addEventListeners() {
  document.addEventListener('keydown', keyEventHandler);
  window.addEventListener('resize', resizeEventHandler);
  document.getElementById('btn-restart')?.addEventListener('click', restartEventHandler);

  document.querySelector('.game-control-container')?.addEventListener('click', (event) => {
    let controlId;
    if (event.target.className == 'controlBtn') {
      controlId = event.target.id;
    } else if (event.target.closest('.controlBtn')) {
      controlId = event.target.closest('.controlBtn').id;
    } else {
      return;
    }
    if (gameBoard.requestId !== -1) {
      switch (controlId) {
        case 'btn-left' :
          moveShapeHandler(config.keys.LEFT);
          break;
        case 'btn-up' :
          moveShapeHandler(config.keys.UP);
          break;
        case 'btn-right' :
          moveShapeHandler(config.keys.RIGHT);
          break;
        case 'btn-hard-drop' :
          moveShapeHandler(config.keys.SPACE);
          break;
        case 'btn-soft-drop' :
          moveShapeHandler(config.keys.DOWN);
          break;
      }
    }
    event.preventDefault();
  });
}

function resizeEventHandler(event) {
  gameBoard.reSizeBoard();
  gameBoard.nextPiece.draw();
  gameBoard.draw();
  if (gameBoard.requestId === -1) {       //display game over
    gameOver(); 
  }
}

// NEXT ****** Using object for lookups
// change switch to object literal
function keyEventHandler(event) {  
  if (gameBoard.requestId > -1) {         // If not "Game Over"  
    switch(event.keyCode) {
      case config.keys.SPACE:
      case config.keys.LEFT:
      case config.keys.RIGHT:
      case config.keys.UP:
      case config.keys.DOWN:
        moveShapeHandler(event.keyCode);
        event.preventDefault();
        break;
    }
  }
}

function restartEventHandler(event) {
  gameBoard.init();
  gameBoard.initBoard();
  gameBoard.draw();
  lastRender = 0;
  requestAnimationFrame(animate);
}

function moveShapeHandler(direction) {        
  gameBoard.setMovePosition(direction);
  gameBoard.draw();
}

function animate(timestamp) {
  let progress = timestamp - lastRender;
  
  if (progress > config.levels[User.level]) { 
    if (!gameBoard.setMovePosition(-1)) { // for saving to boardArray when it hits others
            gameOver();
            return;
    }
    gameBoard.draw();
    updateGameInfo();
    lastRender = timestamp;
  }   
  
  gameBoard.requestId = requestAnimationFrame(animate);
}

function gameOver() {
  //console.log("game over");
  cancelAnimationFrame(gameBoard.requestId);
  gameBoard.requestId = -1; // initialize for checking gameOver
  ctx.fillStyle = 'black';
  ctx.fillRect(1, 6, 8, 1.4);  //scale * 60(UNIT_SIZE)
  ctx.font = '1px Arial'
  ctx.fillStyle = 'red';
  ctx.fillText('GAME OVER', 2, 7);
}

function updateGameInfo() {
  document.getElementById('game-level').innerText = User.level + 1;
  document.getElementById('game-score').innerText = User.score;
  document.getElementById('total-lines').innerText = User.lines;
}

function startGame() {
  lastRender = 0;
  initUser();
  gameBoard = new GameBoard(ctx, nextCtx);
  gameBoard.draw();
  addEventListeners();
  requestAnimationFrame(animate);
}

function initUser() {
  User.level = 0;
  User.lines = 0;
  User.score = 0;
}

startGame();


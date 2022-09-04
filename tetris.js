/* 
Referenced: Michael Karen's Tetris game
https://github.com/melcor76/js-tetris.git
*/

import { "tetris-config" as config } from './config.js';
import { "user-info" as user } from './user.js';
import { GameBoard } from './gameBoard.js';

const canvas = document.getElementById('game-board');
const nextCanvas = document.getElementById('next-shape');
const ctx = canvas.getContext('2d');
const nextCtx = nextCanvas.getContext('2d');


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
  gameBoard.resize();
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
  
  if (progress > config.levels[user.level]) { 
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
  //const unitSize = ctx.width / config.cols;
  showMessage('GAME OVER');
}

function showMessage(message) {
  ctx.fillStyle = 'black';
  ctx.fillRect(1, 8, 8, 2);  //scale * 60(UNIT_SIZE)
  ctx.font = '1.2px Arial'
  ctx.fillStyle = 'red';
  ctx.fillText(message, 1.4, 9.4);
}

function updateGameInfo() {
  document.getElementById('game-level').innerText = user.level + 1;
  document.getElementById('game-score').innerText = user.score;
  document.getElementById('total-lines').innerText = user.lines;
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
  user.level = 0;
  user.lines = 0;
  user.score = 0;
}

startGame();


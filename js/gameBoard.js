import { User } from './user.js';
import { Block } from './block.js';
import { Piece } from './piece.js';

export class GameBoard {
  constructor(ctx, nextCtx) {
    this.ctx = ctx;
    this.nextCtx = nextCtx;
    this.init();
  } 

  init() {                
    this.requestId = -1; 
    this.piece = new Piece(this.ctx);
    this.nextPiece = new Piece(this.nextCtx);
    this.piece.setInitialPosition();
    this.initBoard();
    this.resize();
    this.nextPiece.draw();
  }

  initBoard() {  // setting [config.rows][config.cols] = 0
    this.boardArray = Array.from(
      {length: config.rows}, 
      () => Array(config.cols).fill(0)
    );
  }

  setUser(user) {
    this.user = user;
  }

  setSound(sound) {
    this.sound = sound;
  }

  draw() {
    this.ctx.clearRect(
      0, 
      0, 
      this.ctx.canvas.width, 
      this.ctx.canvas.height
    );
    this.drawBoard();
    this.piece.draw();
  }

  drawBoard() {
    let blockObj = new Block();
    for (let i = 0; i < config.rows; i++) {
      for (let j = 0;  j < config.cols; j++) {
        if (this.boardArray[i][j] > 0) {
          blockObj.draw(
            this.ctx, 
            j, 
            i, 
            config.colors[this.boardArray[i][j]]
          );
        }
      }
    }
  }

  resize() {
    const windowWidth = (window.innerWidth > 992) ? 992 : window.innerWidth;
    const windowHeight = window.innerHeight;
    const mainGameWidth = windowWidth * 0.62; // 62% of the window width
    const unitSize = Math.min(
      Math.floor(mainGameWidth/config.cols), 
      Math.floor(windowHeight*0.95/config.rows)
    );
    this.ctx.canvas.width = config.cols * unitSize;
    this.ctx.canvas.height = config.rows * unitSize;           
    this.nextCtx.canvas.width = 4 * unitSize;
    this.nextCtx.canvas.height = 4 * unitSize;
    this.ctx.scale(unitSize, unitSize);
    this.nextCtx.scale(unitSize, unitSize);
    this.nextCtx.clearRect(
      0, 
      0, 
      this.nextCtx.canvas.width, 
      this.nextCtx.canvas.height
    ); 
  }

  move(direction) {
    
    let testPiece = {...this.piece};  
    direction === config.keys.LEFT ? testPiece.x -= 1
      : direction === config.keys.RIGHT ? testPiece.x += 1
      : direction === config.keys.UP ? testPiece.rotateIdx = ++testPiece.rotateIdx % shapes[this.piece.shapeId].length
      //: direction === config.keys.DOWN ? testPiece.y += 1
      : testPiece.y += 1
       
    if (direction === config.keys.SPACE) { // hard down
      //testPiece.y -= 1; // begin with putting it back
      while (this.isValideMove(testPiece)) {
        this.piece.y = testPiece.y;
        testPiece.y += 1;
      }
      this.sound.play('hardDrop');
      this.user.setLineScore('HARD_DROP');
      return this.processHitBottom();
    } 
    
    if (this.isValideMove(testPiece)) {
      this.piece.x = testPiece.x;
      this.piece.y = testPiece.y;
      this.piece.rotateIdx = testPiece.rotateIdx;
    } else if (direction === -1) { // ready for a new piece
      return this.processHitBottom();
    }
    return true;
  }

  processHitBottom() {
    this.saveShapeintoBoardArray();
    this.checkClearLines();
    if (this.piece.y === 0) {
      // GAME OVER
      return false;
    }
    this.showNextPiece();
    return true;
  }

  /* 
    Referenced: Michael Karen's Tetris game
    https://github.com/melcor76/js-tetris.git
  */
  isValideMove(testPiece) {
    // inside game board, collision check
    const testShape = shapes[testPiece.shapeId][testPiece.rotateIdx];
    return testShape.every((row, j) => {
      return row.every((col, i) => {
        let x = testPiece.x + i;
        let y = testPiece.y + j;
        return col === 0 || (this.isInsideGameBoard(x, y) && this.isNoCollision(x, y));
      });
    });     
  }

  isInsideGameBoard(x, y) {
    return x >= 0 && x < config.cols && y <= config.rows;
  }

  isNoCollision(x, y) {
    return this.boardArray[y] && this.boardArray[y][x] === 0;
  }

  saveShapeintoBoardArray() {
    const shape = shapes[this.piece.shapeId][this.piece.rotateIdx];
    shape.forEach((row, j) => {
      row.forEach((col, i) => {
        if (col > 0) {
          this.boardArray[this.piece.y + j][this.piece.x + i] = col;
        }
      });
    });
  }

  checkClearLines() {
    let clearLines = 0;
    this.boardArray.forEach((row, j) => {
      if (row.every((col) => col > 0)) {
        this.boardArray.splice(j, 1);
        this.boardArray.unshift(Array(config.cols).fill(0));
        this.sound.play('lineClear');
        clearLines++;
      }
    });
    if (clearLines > 0) {
      this.user.update(clearLines);
    } else  {
      this.user.setLineScore(clearLines);
    }
  }

  showNextPiece() {
    this.piece = this.nextPiece;
    this.piece.ctx = this.ctx;
    this.piece.setInitialPosition();
    this.nextPiece = new Piece(this.nextCtx);
    this.nextCtx.clearRect(0, 0, this.nextCtx.canvas.width, this.nextCtx.canvas.height);
    this.nextPiece.draw();
  }
}
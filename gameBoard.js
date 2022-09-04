import { "tetis-config" as config } from './config.js';
import { "user-info" as user } from './user.js';
import { Block } from './block.js';
import { Piece } from './piece.js';
import { "peices-info" as shapes } from './shapes.js';


export class GameBoard {
  constructor(ctx, nextCtx) {
    this.ctx = ctx;
    this.nextCtx = nextCtx;
    this.init();
  } 

  init() {                
    this.resize();
    
    this.requestId = -1; 
    this.shapePiece = new Piece(this.ctx);
    this.shapePiece.setInitialPosition();
    this.nextPiece = new Piece(this.nextCtx);
    this.boardArray = this.initBoard();
    this.nextPiece.draw();
  }

  initBoard() {  // setting [config.rows][config.cols] = 0
    return Array.from({length: config.rows}, 
                      () => Array(config.cols).fill(0));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawBoard();
    this.shapePiece.draw();
  }

  drawBoard() {
    for (let i = 0; i < config.rows; i++) {
      for (let j = 0;  j < config.cols; j++) {
        if (this.boardArray[i][j] > 0) {
          // this.shapePiece.drawBorder(j, i, 1, 1); 
          // this.ctx.fillStyle = config.colors[this.boardArray[i][j]];
          // this.ctx.fillRect(j, i, 1, 1);
          new Block().draw(this.ctx, j, i, config.colors[this.boardArray[i][j]])
        }
      }
    }
  }

  resize() {
    const windowWidth = (window.innerWidth > 992) ? 992 : window.innerWidth;
    const windowHeight = window.innerHeight;
    const mainGameWidth = windowWidth * 0.62; // 62% of the window width
    const unitSize = Math.min(Math.floor(mainGameWidth/config.cols), Math.floor(windowHeight*0.95/config.rows));
    this.ctx.canvas.width = config.cols * unitSize;
    this.ctx.canvas.height = config.rows * unitSize;           
    this.nextCtx.canvas.width = 4 * unitSize;
    this.nextCtx.canvas.height = 4 * unitSize;
    this.ctx.scale(unitSize, unitSize);
    this.nextCtx.scale(unitSize, unitSize);
    this.nextCtx.clearRect(0, 0, this.nextCtx.canvas.width, this.nextCtx.canvas.height); 
  }
 
  setMovePosition(direction) {
    let testPieceBeforeMove = {...this.shapePiece};
    if (direction === config.keys.LEFT) {  // move left
      testPieceBeforeMove.x -= 1;
    } else if (direction === config.keys.RIGHT) {   // move right
      testPieceBeforeMove.x += 1;
    } else if (direction === config.keys.UP) {   // rotate
      testPieceBeforeMove.rotateIdx = ++testPieceBeforeMove.rotateIdx % shapes[this.shapePiece.shapeId].length;
    } else if (direction === config.keys.DOWN) { // soft down
      testPieceBeforeMove.y += 1;

    } else if (direction === config.keys.SPACE) {    // hard down
      while (this.isValideMove(testPieceBeforeMove)) {
        this.shapePiece.y = testPieceBeforeMove.y;
        testPieceBeforeMove.y += 1;
      }
      return this.processHitBottom();
    } else {
      testPieceBeforeMove.y += 1;     // otherwise drop
    }
    
    if (this.isValideMove(testPieceBeforeMove)) {
      this.shapePiece.x = testPieceBeforeMove.x;
      this.shapePiece.y = testPieceBeforeMove.y;
      this.shapePiece.rotateIdx = testPieceBeforeMove.rotateIdx;
    }else if (direction === -1) { // ready for a new piece
      return this.processHitBottom();
    }
    return true;
  }

  processHitBottom() {
    this.saveShapeintoBoardArray();
    this.checkClearLines();
    if (this.shapePiece.y === 0) {
      // GAME OVER
      return false;
    }
    this.showNextPiece();
    return true;
  }

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
    const shape = shapes[this.shapePiece.shapeId][this.shapePiece.rotateIdx];
    shape.forEach((row, j) => {
      row.forEach((col, i) => {
        if (col > 0) {
          this.boardArray[this.shapePiece.y + j][this.shapePiece.x + i] = col;
        }
      });
    });
  }

  checkClearLines() {
    let clearLineNum = 0;
    this.boardArray.forEach((row, j) => {
      if (row.every((col) => col > 0)) {
        //remove the line
        this.boardArray.splice(j, 1);
        this.boardArray.unshift(Array(config.cols).fill(0));
        clearLineNum++;
        //debugger;
      }
    });
    if (clearLineNum > 0) {
      this.setClearLinePoint(clearLineNum);
    } 
  }

  showNextPiece() {
    this.shapePiece = this.nextPiece;
    this.shapePiece.ctx = this.ctx;
    this.shapePiece.setInitialPosition();
    this.nextPiece = new Piece(this.nextCtx);
    this.nextCtx.clearRect(0, 0, this.nextCtx.canvas.width, this.nextCtx.canvas.height);
    this.nextPiece.draw();
  }

  setClearLinePoint(lines) {
    switch(lines) {
      case 1: user.score += config.points.LINE;
        break;
      case 2: user.score +=  config.points.DOUBLE;
        break;
      case 3: user.score += config.points.TRIPLE;
        break;
      case 4: user.score += config.points.QUADRUPLE;
        break;
    }
    user.lines += lines;
    user.level = Math.floor(user.lines / config.levelUpLineNumbers); // level up: every 15 lines 
    user.level = (Math.floor(user.lines / config.levelUpLineNumbers) >= config.levels.length) ? config.levels.length : user.level;
  }
}
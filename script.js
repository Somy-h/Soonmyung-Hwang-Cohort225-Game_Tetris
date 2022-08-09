/* 
I referenced Michael Karen's Tetris game
https://github.com/melcor76/js-tetris.git
*/



const canvas = document.getElementById('game-board');
const nextCanvas = document.getElementById('next-shape');
const ctx = canvas.getContext('2d');
const nextCtx = nextCanvas.getContext('2d');

const COLS = 10;
const ROWS = 15;
const UNIT_SIZE = 60;

const User = {
        level: 0, // level 0 -6
        score: 0
};

const SHAPES = [
        [],
        [[[1, 1],        // SHAPE_O
          [1, 1]],
         [[1, 1],        // SHAPE_O
          [1, 1]]],
        
        [[[0, 2, 2],    // SHAPE_S
          [2, 2, 0], 
          [0, 0, 0]], 
         [[0, 2, 0],    // SHAPE_S
          [0, 2, 2], 
          [0, 0, 2]]],        
        
        [[[3, 3, 0],     // SHAPE_Z
          [0, 3, 3], 
          [0, 0, 0]],
         [[0, 0, 3],    // SHAPE_Z 
          [0, 3, 3], 
          [0, 3, 0]]],  
        
        [[[4, 0, 0],     // SHAPE_J
          [4, 4, 4], 
          [0, 0, 0]],
         [[0, 4, 4],     // SHAPE_J
          [0, 4, 0], 
          [0, 4, 0]],
         [[0, 0, 0],     // SHAPE_J
          [4, 4, 4], 
          [0, 0, 4]],
         [[0, 4, 0],     // SHAPE_J
          [0, 4, 0], 
          [4, 4, 0]]],
        
        [[[0, 0, 5],    // SHAPE_L
          [5, 5, 5], 
          [0, 0, 0]],
         [[0, 5, 0],    // SHAPE_L
          [0, 5, 0], 
          [0, 5, 5]],
         [[0, 0, 0],    // SHAPE_L
          [5, 5, 5], 
          [5, 0, 0]],
         [[5, 5, 0],    // SHAPE_L
          [0, 5, 0], 
          [0, 5, 0]]],

        [[[6, 6, 6],     // SHAPE_T
          [0, 6, 0],
          [0, 0, 0]],
         [[0, 0, 6],     // SHAPE_T
          [0, 6, 6],
          [0, 0, 6]],
         [[0, 0, 0],     // SHAPE_T
          [0, 6, 0],
          [6, 6, 6]],
         [[6, 0, 0],     // SHAPE_T
          [6, 6, 0],
          [6, 0, 0]]],

        [[[0, 0, 0, 0],  // SHAPE_I
         [7, 7, 7, 7],
         [0, 0, 0, 0],
         [0, 0, 0, 0]],
        [[0, 0, 7, 0],  // SHAPE_I
         [0, 0, 7, 0],
         [0, 0, 7, 0],
         [0, 0, 7, 0]]]
]

const COLORS = [
        '',
        'yellowgreen',
        'hotpink',
        'blueviolet',
        'orange',
        'darkturquoise',
        'gold',
        'red'
];

// const ROTATE_RIGHT = 0;
// const ROTATE_LEFT = 1;
const KEYS = {
        SPACE: 32,      // rotate
        LEFT: 37,       // move to left
        RIGHT: 39,      // move to right
        DOWN: 40,       // move hard drop
};

const LEVELS = [
        700,
        600,
        500,
        400,
        300,
        200,
        100
];

class ShapePiece {
        constructor(ctx) {
                this.ctx = ctx;
                this.init();
        }

        init() {
                this.x = 0; // initial center position
                this.y = 0;
                this.shapeId = this.createRandomShape();
                this.color = COLORS[this.shapeId];
                this.rotateIdx = 0;
                //console.log(this);
        }

        setInitialPosition() {
                // initial center position
                if (this.shapeId == 1) this.x = COLS/2 - 1; // shape O
                else this.x = COLS/2 - 2; // other shapes
                this.y = 0;
        }

        createRandomShape() {
                return Math.floor(Math.random() * (COLORS.length - 1) + 1);
        }

        draw() {
                this.ctx.fillStyle = this.color;
                
                SHAPES[this.shapeId][this.rotateIdx].forEach ((row, i) => {
                        row.forEach ((col, j) => {
                                if (col > 0) {
                                        this.ctx.fillRect(this.x + j, this.y + i, 1, 1); 
                                }
                        });
                });
        }
}


class GameBoard {
        constructor(ctx, nextCtx) {
                this.ctx = ctx;
                this.nextCtx = nextCtx;
                this.init();
        } 

        init() {
                this.ctx.canvas.width = COLS * UNIT_SIZE;
                this.ctx.canvas.height = ROWS * UNIT_SIZE;
                this.nextCtx.canvas.width = UNIT_SIZE * 4;
                this.nextCtx.canvas.height = UNIT_SIZE * 4;
                this.ctx.scale(UNIT_SIZE, UNIT_SIZE);
                this.nextCtx.scale(UNIT_SIZE, UNIT_SIZE);
                this.requestId = -1; 
                this.shapePiece = new ShapePiece(this.ctx);
                this.shapePiece.setInitialPosition();
                this.nextPiece = new ShapePiece(this.nextCtx);
                this.boardArray = this.initBoard();
                this.nextPiece.draw();
        }

        initBoard() {  // setting [rows][cols] = 0
                return Array.from({length: ROWS}, 
                                () => Array(COLS).fill(0));
        }

        draw() {
                this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                this.drawBoard();
                this.shapePiece.draw();
        }

        drawBoard() {
                for (let i = 0; i < ROWS; i++) {
                        for (let j = 0;  j < COLS; j++) {
                                if (this.boardArray[i][j] > 0) {
                                        this.ctx.fillStyle = COLORS[this.boardArray[i][j]];
                                        this.ctx.fillRect(j, i, 1, 1);
                                }
                        }
                }
        }

        setMovePosition(direction) {
                let testPieceBeforeMove = {...this.shapePiece};
                if (direction === KEYS.LEFT) {  // move left
                        testPieceBeforeMove.x -= 1;

                }else if (direction === KEYS.RIGHT) {   // move right
                        testPieceBeforeMove.x += 1;

                }else if (direction === KEYS.SPACE) {   // rotate
                        testPieceBeforeMove.rotateIdx = ++testPieceBeforeMove.rotateIdx % SHAPES[this.shapePiece.shapeId].length;
                }else if (direction === KEYS.DOWN) {    // hard down
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
                const testShape = SHAPES[testPiece.shapeId][testPiece.rotateIdx];
                return testShape.every((row, j) => {
                        return row.every((col, i) => {
                                let x = testPiece.x + i;
                                let y = testPiece.y + j;
                                return col === 0 || (this.isInsideGameBoard(x, y) && this.isNoCollision(x, y));
                        });
                });     
        }


        isInsideGameBoard(x, y) {
                return x >= 0 && x < COLS && y <= ROWS;
        }

        isNoCollision(x, y) {
                return this.boardArray[y] && this.boardArray[y][x] === 0;
        }

        saveShapeintoBoardArray() {
                const shape = SHAPES[this.shapePiece.shapeId][this.shapePiece.rotateIdx];
                shape.forEach((row, j) => {
                        row.forEach((col, i) => {
                                if (col > 0) {
                                        this.boardArray[this.shapePiece.y + j][this.shapePiece.x + i] = col;
                                }
                        });
                });
        }
        checkClearLines() {
                this.boardArray.forEach((row, j) => {
                        if (row.every((col) => col > 0)) {
                                //remove the line
                                //console.log(this.boardArray.splice(j, 1));
                                this.boardArray.unshift(Array(COLS).fill(0));
                                //debugger;
                                this.getClearLinePoint();
                        }
                })
        }

        showNextPiece() {
                this.shapePiece = this.nextPiece;
                this.shapePiece.ctx = this.ctx;
                this.shapePiece.setInitialPosition();
                this.nextPiece = new ShapePiece(this.nextCtx);
                this.nextCtx.clearRect(0, 0, this.nextCtx.canvas.width, this.nextCtx.canvas.height);
                this.nextPiece.draw();
        }

        getClearLinePoint() {

        }

}

function addEventListeners() {
        document.addEventListener('keydown', keyEventHandler);
}

// NEXT ****** Using object for lookups
// change switch to object literal
function keyEventHandler(event) {       
        switch(event.keyCode) {
                case KEYS.SPACE:
                case KEYS.LEFT:
                case KEYS.RIGHT:
                case KEYS.DOWN:
                        moveShapeHandler(event.keyCode);
                        event.preventDefault();
                        break;
        }
}

function moveShapeHandler(direction) {        
        gameBoard.setMovePosition(direction);
        gameBoard.draw();
}


function animate(timestamp) {
        let progress = timestamp - lastRender;
        
        if (progress > LEVELS[User.level]) { 
                if (!gameBoard.setMovePosition(-1)) { // for saving to boardArray when it hits others
                        gameOver();
                        return;
                }
                gameBoard.draw();
                lastRender = timestamp;
        }   
        
        gameBoard.requestId = requestAnimationFrame(animate);
}

function gameOver() {
        //console.log("game over");
        cancelAnimationFrame(gameBoard.requestId);
        ctx.fillStyle = 'black';
        ctx.fillRect(1, 6, 8, 1.4);  //scale * 60(UNIT_SIZE)
        ctx.font = '1px Arial'
        ctx.fillStyle = 'red';
        ctx.fillText('GAME OVER', 2, 7);
}

let lastRender = 0;
let gameBoard = new GameBoard(ctx, nextCtx);
gameBoard.draw();
addEventListeners();
requestAnimationFrame(animate);
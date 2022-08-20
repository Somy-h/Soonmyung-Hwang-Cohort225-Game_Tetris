/* 
I referenced Michael Karen's Tetris game
https://github.com/melcor76/js-tetris.git
*/



const canvas = document.getElementById('game-board');
const nextCanvas = document.getElementById('next-shape');
const ctx = canvas.getContext('2d');
const nextCtx = nextCanvas.getContext('2d');

const COLS = 10;
const ROWS = 18;
//const UNIT_SIZE = 50; // commented because of interactive size


const User = {
        level: 0, // level 0-9 : display 1-10
        score: 0,
        lines: 0   // # of lines cleared      
};

const STATE = {
        start: 0,
        restart: 1,
        pause: 2,
        stop: 3,
        gameOver: 4
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
          [0, 0, 2]],
         [[0, 0, 0],    // SHAPE_S
          [0, 2, 2], 
          [2, 2, 0]],
         [[2, 0, 0],    // SHAPE_S
          [2, 2, 0], 
          [0, 2, 0]]],        
        
        [[[3, 3, 0],     // SHAPE_Z
          [0, 3, 3], 
          [0, 0, 0]],
         [[0, 0, 3],    // SHAPE_Z 
          [0, 3, 3], 
          [0, 3, 0]],
         [[0, 0, 0],    // SHAPE_Z 
          [3, 3, 0], 
          [0, 3, 3]],
         [[0, 3, 0],    // SHAPE_Z 
          [3, 3, 0], 
          [3, 0, 0]]],  
        
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
        SPACE: 32,      // move hard drop
        LEFT: 37,       // move to left
        RIGHT: 39,      // move to right
        UP: 38,         // rotate
        DOWN: 40,       // soft drop
};

const LEVELS = [
        700, // 700ms
        600,
        500,
        400,
        300,
        250,
        200,
        150,
        100,
        70      // level 10 
];

const LEVEL_LINES = 15; // level up every 15 lines cleared

const POINTS = {
        LINE: 100,
        DOUBLE: 300,
        TRIPLE: 500,
        QUADRUPLE: 800,
        HARD_DROP: 2,
        DROP: 1
};

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
                SHAPES[this.shapeId][this.rotateIdx].forEach ((row, i) => {
                        row.forEach ((col, j) => {
                                if (col > 0) {
                                        this.drawBorder(this.x + j, this.y + i, 1, 1);
                                        this.ctx.fillStyle = this.color;
                                        this.ctx.fillRect(this.x + j, this.y + i, 1, 1); 
                                }
                        });
                });
        }

        drawBorder(x, y, width, height, thickness = 0.01)
        {
                this.ctx.fillStyle='#fff';
                this.ctx.fillRect(x - (thickness), y - (thickness), width + (thickness * 2), height + (thickness * 2));
        }
}


class GameBoard {
        constructor(ctx, nextCtx) {
                this.ctx = ctx;
                this.nextCtx = nextCtx;
                this.init();
        } 

        init() {                
                this.reSizeBoard();
                
                this.requestId = -1; 
                this.shapePiece = new ShapePiece(this.ctx);
                this.shapePiece.setInitialPosition();
                this.nextPiece = new ShapePiece(this.nextCtx);
                this.boardArray = this.initBoard();
                this.nextPiece.draw();
                
                // User initialization
                User.level = 0;
                User.lines = 0;
                User.score = 0;
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
                                        this.shapePiece.drawBorder(j, i, 1, 1); 
                                        this.ctx.fillStyle = COLORS[this.boardArray[i][j]];
                                        this.ctx.fillRect(j, i, 1, 1);
                                }
                        }
                }
        }

        reSizeBoard() {
                const windowWidth = (window.innerWidth > 992) ? 992 : window.innerWidth;
                const windowHeight = window.innerHeight;
                const mainGameWidth = windowWidth * 0.62; // 62% of the window width
                const unitSize = Math.min(Math.floor(mainGameWidth/COLS), Math.floor(windowHeight*0.95/ROWS));
                this.ctx.canvas.width = COLS * unitSize;
                this.ctx.canvas.height = ROWS * unitSize;           
                this.nextCtx.canvas.width = 4 * unitSize;
                this.nextCtx.canvas.height = 4 * unitSize;
                this.ctx.scale(unitSize, unitSize);
                this.nextCtx.scale(unitSize, unitSize);
                this.nextCtx.clearRect(0, 0, this.nextCtx.canvas.width, this.nextCtx.canvas.height); 
        }
 
        setMovePosition(direction) {
                let testPieceBeforeMove = {...this.shapePiece};
                if (direction === KEYS.LEFT) {  // move left
                        testPieceBeforeMove.x -= 1;
                } else if (direction === KEYS.RIGHT) {   // move right
                        testPieceBeforeMove.x += 1;
                } else if (direction === KEYS.UP) {   // rotate
                        testPieceBeforeMove.rotateIdx = ++testPieceBeforeMove.rotateIdx % SHAPES[this.shapePiece.shapeId].length;
                } else if (direction === KEYS.DOWN) { // soft down
                        testPieceBeforeMove.y += 1;

                } else if (direction === KEYS.SPACE) {    // hard down
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
                let clearLineNum = 0;
                this.boardArray.forEach((row, j) => {
                        if (row.every((col) => col > 0)) {
                                //remove the line
                                this.boardArray.splice(j, 1);
                                this.boardArray.unshift(Array(COLS).fill(0));
                                clearLineNum++;
                                //debugger;
                        }
                });
                if (clearLineNum > 0) this.setClearLinePoint(clearLineNum);
        }

        showNextPiece() {
                this.shapePiece = this.nextPiece;
                this.shapePiece.ctx = this.ctx;
                this.shapePiece.setInitialPosition();
                this.nextPiece = new ShapePiece(this.nextCtx);
                this.nextCtx.clearRect(0, 0, this.nextCtx.canvas.width, this.nextCtx.canvas.height);
                this.nextPiece.draw();
        }

        setClearLinePoint(lines) {
                switch(lines) {
                        case 1: User.score += POINTS.LINE;
                                break;
                        case 2: User.score +=  POINTS.DOUBLE;
                                break;
                        case 3: User.score += POINTS.TRIPLE;
                                break;
                        case 4: User.score += POINTS.QUADRUPLE;
                                break;
                }
                User.lines += lines;
                User.level = Math.floor(User.lines / LEVEL_LINES); // level up: every 15 lines 
                User.level = (Math.floor(User.lines / LEVEL_LINES) >= LEVELS.length) ? LEVELS.length : User.level;
        }
}

let lastRender;
let gameBoard;
function addEventListeners() {
        document.addEventListener('keydown', keyEventHandler);
        window.addEventListener('resize', resizeEventHandler);
        document.getElementById('btn-restart')?.addEventListener('click', restartEventHandler);

        // Able to play without keyboard
        // document.getElementById('btn-left').addEventListener('click', () => {
        //         if (gameBoard.requestId !== -1) moveShapeHandler(KEYS.LEFT)
        // });
        // document.getElementById('btn-up').addEventListener('click', () => {
        //         if (gameBoard.requestId !== -1) moveShapeHandler(KEYS.UP)
        // });
        // document.getElementById('btn-right').addEventListener('click', () => {
        //         if (gameBoard.requestId !== -1) moveShapeHandler(KEYS.RIGHT)
        // });
        // document.getElementById('btn-hard-drop').addEventListener('click', () =>{
        //         if (gameBoard.requestId !== -1) moveShapeHandler(KEYS.SPACE)
        // });

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
                                        moveShapeHandler(KEYS.LEFT);
                                        break;
                                case 'btn-up' :
                                        moveShapeHandler(KEYS.UP);
                                        break;
                                case 'btn-right' :
                                        moveShapeHandler(KEYS.RIGHT);
                                        break;
                                case 'btn-hard-drop' :
                                        moveShapeHandler(KEYS.SPACE);
                                        break;
                                case 'btn-soft-drop' :
                                        moveShapeHandler(KEYS.DOWN);
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
                        case KEYS.SPACE:
                        case KEYS.LEFT:
                        case KEYS.RIGHT:
                        case KEYS.UP:
                        case KEYS.DOWN:
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
        
        if (progress > LEVELS[User.level]) { 
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
        gameBoard = new GameBoard(ctx, nextCtx);
        gameBoard.draw();
        addEventListeners();
        requestAnimationFrame(animate);
}

startGame();
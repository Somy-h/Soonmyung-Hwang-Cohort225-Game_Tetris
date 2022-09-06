import { Block } from './block.js';

export class Piece {
  constructor(ctx) {
    this.ctx = ctx;
    this.init();
  }

  init() {
    this.x = 0; // initial center position
    this.y = 0;
    
    this.createRandomShape();
    this.color = config.colors[this.shapeId];
    this.rotateIdx = 0;
  }

  setInitialPosition() {
    // initial center position
    if (this.shapeId == 1) {
      this.x = config.cols/2 - 1; // shape O (short width)
    } 
    else {
      this.x = config.cols/2 - 2; // other shapes
    }
    this.y = 0;
  }

  createRandomShape() {
    this.shapeId = Math.floor(Math.random() * (config.colors.length - 1) + 1);  
  }

  draw() {  
    let blockObj = new Block();       
    shapes[this.shapeId][this.rotateIdx].forEach ((row, i) => {
      row.forEach ((col, j) => {
        if (col > 0) {
          blockObj.draw(this.ctx, this.x + j, this.y + i, this.color);
        }
      });
    });
  }

  // rotate() {
    
  // }
  
}

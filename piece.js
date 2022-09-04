import { "tetis-config" as config } from './config.js';
import { "peices-info" as shapes } from './shapes.js';
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

  // draw() {         
  //   shapes[this.shapeId][this.rotateIdx].forEach ((row, i) => {
  //     row.forEach ((col, j) => {
  //       if (col > 0) {
  //         this.drawBorder(this.x + j, this.y + i, 1, 1);
  //         this.ctx.fillStyle = this.color;
  //         this.ctx.fillRect(this.x + j, this.y + i, 1, 1); 
  //         this.draw3dEffect(this.x + j, this.y + i, 1, 1);
  //       }
  //     });
  //   });
  // } 

   draw() {         
    shapes[this.shapeId][this.rotateIdx].forEach ((row, i) => {
      row.forEach ((col, j) => {
        if (col > 0) {
          new Block().draw(this.ctx, this.x + j, this.y + i, this.color);
        }
      });
    });
  }
}

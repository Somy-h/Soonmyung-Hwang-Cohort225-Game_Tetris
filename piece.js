import {
  "tetis-config" as config
} from './config.js';

import {
  "peices-info" as shapes
} from './shapes.js';

export class Piece {
  constructor(ctx) {
    this.ctx = ctx;
    this.init();
  }

  init() {
    this.x = 0; // initial center position
    this.y = 0;
    this.shapeId = this.createRandomShape();
    this.color = config.colors[this.shapeId];
    this.rotateIdx = 0;
    //console.log(this);
  }

  setInitialPosition() {
    // initial center position
    if (this.shapeId == 1) this.x = config.cols/2 - 1; // shape O
    else this.x = config.cols/2 - 2; // other shapes
    this.y = 0;
  }

  createRandomShape() {
    return Math.floor(Math.random() * (config.colors.length - 1) + 1);
  }

  draw() {         
    shapes[this.shapeId][this.rotateIdx].forEach ((row, i) => {
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

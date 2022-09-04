export class Block {

  draw(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1); 
    this.drawBorder(ctx, x, y, color);
    this.draw3dEffect(ctx, x, y, color);
  }

  drawBorder(ctx, x, y, color, thickness = 0.04)
  {
    ctx.strokeStyle = this.shadeColor(color, -80);
    ctx.lineWidth = 0.04;
    ctx.shadowColor = this.shadeColor(color, -80);
    // ctx.shadowBlur = 2;
    ctx.strokeRect(x, y, 1, 1);
  }

  draw3dEffect(ctx, x, y, color) {
    // darker -30, brighter 50
  
    // bright inside rectangle
    ctx.beginPath();
    ctx.fillStyle = this.shadeColor(color, 20);
    ctx.fillRect(x + 1/8, y + 1/8, 1 - 1/4, 1 - 1/4);
  
    // bright upper line
    ctx.strokeStyle = this.shadeColor(color, 50);
    ctx.lineWidth = 0.05;
    ctx.moveTo(x + 1/8, y + 1/8); 
    ctx.lineTo(x + 1 - 1/8, y + 1/8);
    ctx.lineTo(x + 1 - 1/8, y + 1 - 1/8);
    ctx.stroke();
    
    // bright point
    ctx.beginPath();
    ctx.strokeStyle = this.shadeColor(color, 80);
    // ctx.arc(x + 1 - 1/4, y + 1/4, 1/32, 0, Math.PI * 2);
    ctx.moveTo(x + 1 - 2/5, y + 1/4);
    ctx.lineTo(x + 1 - 1/4, y + 1/4);
    ctx.lineWidth = 0.06;
    ctx.stroke();
  
    // darker under line
    ctx.beginPath();
    ctx.strokeStyle = this.shadeColor(color, -40);
    ctx.moveTo(x + 1/8, y + 1/8); 
    ctx.lineTo(x + 1/8, y + 1 - 1/8); 
    ctx.lineTo(x + 1 - 1/8, y + 1 - 1/8);
    ctx.lineWidth = 0.05;
    ctx.stroke();
  }
  

  shadeColor(color, percent) {
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    r = this.setMinMax(r + percent);
    g = this.setMinMax(g + percent);
    b = this.setMinMax(b + percent);

    const rStr = ((r.toString(16).length === 1) ? '0' + r.toString(16) : r.toString(16));
    const gStr = ((g.toString(16).length === 1) ? '0' + g.toString(16) : g.toString(16));
    const bStr = ((b.toString(16).length === 1) ? '0' + b.toString(16) : b.toString(16));

    return `#${rStr}${gStr}${bStr}`;
  }

   setMinMax(colorValue) {
    if (colorValue < 0) colorValue = 0;
    if (colorValue > 255) colorValue = 255;
    return colorValue;
  }
}
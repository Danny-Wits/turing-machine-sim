class Cell {
  constructor(x, y, size, val = '#', highlight = null, index = null) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.val = val;
    this.highlight = highlight;
    this.index = index;
  }

  draw() {
    let m = 4; // internal margin
    let innerSize = this.size - m * 2;
    
    // Base drop shadow for a 3D effect
    noStroke();
    fill('rgba(0,0,0,0.15)');
    rect(this.x + m + 3, this.y + m + 4, innerSize, innerSize, 8);
    
    if (this.highlight === 'red') {
      stroke('#d63031');
      fill('#fab1a0');
    } else if (this.highlight === 'green') {
      stroke('#00b894');
      fill('#55efc4');
    } else {
      stroke('#0984e3');
      fill('#74b9ff');
    }
    
    strokeWeight(2);
    rect(this.x + m, this.y + m, innerSize, innerSize, 8); 
    
    // Subtle top gloss
    noStroke();
    fill('rgba(255,255,255,0.4)');
    rect(this.x + m + 2, this.y + m + 2, innerSize - 4, innerSize * 0.35, 4);

    // Text value
    fill('#2d3436'); 
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(innerSize * 0.6);
    text(this.val, this.x + this.size / 2, this.y + this.size / 2);
    
    // Draw Tape Index above the cell
    if (this.index !== null) {
      fill('#b2bec3');
      noStroke();
      textSize(10);
      textStyle(NORMAL);
      text(this.index, this.x + this.size / 2, this.y - 8);
    }
    textStyle(NORMAL);
  }
}

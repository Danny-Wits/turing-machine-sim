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
    
    strokeWeight(3);
    rect(this.x, this.y, this.size, this.size, 10); 
    
    noStroke();
    fill('#2d3436'); 
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(this.size * 0.6);
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

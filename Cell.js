class Cell {
  constructor(x, y, size, val = '#', highlight = null) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.val = val;
    this.highlight = highlight;
  }

  draw() {
    if (this.highlight === 'red') {
      stroke('#d63031'); // Dark red border
      fill('#fab1a0');   // Soft red fill
    } else if (this.highlight === 'green') {
      stroke('#00b894'); // Dark green border
      fill('#55efc4');   // Soft green fill
    } else {
      stroke('#0984e3'); // Bright blue border
      fill('#74b9ff');   // Soft blue fill
    }
    
    strokeWeight(3);
    rect(this.x, this.y, this.size, this.size, 10); 
    
    noStroke();
    fill('#2d3436'); 
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(this.size * 0.6);
    text(this.val, this.x + this.size / 2, this.y + this.size / 2);
    textStyle(NORMAL);
  }
}

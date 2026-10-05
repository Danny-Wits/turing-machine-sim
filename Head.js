class Head {
  constructor(x, y, cellSize) {
    this.x = x; // Center X position on screen
    this.y = y;
    this.cellSize = cellSize;
    this.index = 0; // Current position on the logical tape
  }

  moveLeft() {
    this.index--;
  }

  moveRight() {
    this.index++;
  }

  reset() {
    this.index = 0;
  }

  draw(currentState = "HEAD") {
    let arrowX = this.x + this.cellSize / 2;
    let arrowY = this.y + this.cellSize + 15;
    
    fill('#fd79a8'); // Vibrant pink arrow
    noStroke();
    triangle(arrowX, arrowY, arrowX - 15, arrowY + 22, arrowX + 15, arrowY + 22);
    
    fill('#e84393'); // Darker pink text
    textAlign(CENTER, TOP);
    textSize(16);
    textStyle(BOLD);
    text(currentState, arrowX, arrowY + 27);
    textStyle(NORMAL);
  }
}

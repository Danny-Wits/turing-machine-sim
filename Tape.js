class Tape {
  constructor(x, y, cellSize) {
    this.x = x;
    this.y = y;
    this.cellSize = cellSize;
    this.cells = {}; 
    this.highlights = {}; // Tracks color trails
    this.blankSymbol = '#';
  }

  read(index) {
    return this.cells[index] || this.blankSymbol;
  }

  write(index, val) {
    this.cells[index] = val;
  }

  setHighlight(index, type) {
    this.highlights[index] = type;
  }

  getHighlight(index) {
    return this.highlights[index] || null;
  }

  clear(inputString = "") {
    this.cells = {};
    this.highlights = {};
    for (let i = 0; i < inputString.length; i++) {
      this.cells[i] = inputString[i];
    }
  }

  draw(centerIndex, visibleCellsCount = 15) {
    let halfVisible = Math.floor(visibleCellsCount / 2);
    let startIdx = centerIndex - halfVisible;
    let endIdx = centerIndex + halfVisible;

    let drawX = this.x - (halfVisible * this.cellSize);
    
    for (let i = startIdx; i <= endIdx; i++) {
      let val = this.read(i);
      let hl = this.getHighlight(i);
      let cell = new Cell(drawX, this.y, this.cellSize, val, hl);
      cell.draw();
      drawX += this.cellSize;
    }
  }
}

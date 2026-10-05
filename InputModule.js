class InputModule {
  constructor(containerId, tm) {
    this.tm = tm;
    this.container = select(`#${containerId}`);
    
    this.wrapper = createDiv('');
    this.wrapper.class('module');
    this.wrapper.parent(this.container);
    
    let title = createElement('h3', 'Input Module');
    title.parent(this.wrapper);

    let row = createDiv('');
    row.style('display', 'flex');
    row.style('gap', '10px');
    row.parent(this.wrapper);

    this.inputField = createInput('10110');
    this.inputField.parent(row);
    
    this.loadBtn = createButton('Load to Tape');
    this.loadBtn.parent(row);
    this.loadBtn.mousePressed(() => {
      this.tm.reset(this.inputField.value());
    });

    // --- MANUAL CONTROLLER ---
    let manualTitle = createElement('h4', 'Manual Tape Control');
    manualTitle.parent(this.wrapper);
    manualTitle.style('margin', '0 0 5px 0');
    manualTitle.style('color', '#636e72');
    manualTitle.style('font-size', '14px');

    let manualRow = createDiv('');
    manualRow.style('display', 'flex');
    manualRow.style('gap', '5px');
    manualRow.style('align-items', 'center');
    manualRow.parent(this.wrapper);

    let leftBtn = createButton('◀');
    leftBtn.parent(manualRow);
    leftBtn.style('padding', '6px 12px');
    leftBtn.style('font-size', '12px');
    leftBtn.attribute('title', 'Move Head Left');
    leftBtn.mousePressed(() => {
       this.tm.head.moveLeft();
       if(typeof playTMSound === 'function') playTMSound('move');
    });

    let rightBtn = createButton('▶');
    rightBtn.parent(manualRow);
    rightBtn.style('padding', '6px 12px');
    rightBtn.style('font-size', '12px');
    rightBtn.attribute('title', 'Move Head Right');
    rightBtn.mousePressed(() => {
       this.tm.head.moveRight();
       if(typeof playTMSound === 'function') playTMSound('move');
    });

    let writeIn = createInput('');
    writeIn.parent(manualRow);
    writeIn.style('width', '40px');
    writeIn.style('padding', '6px');
    writeIn.style('text-align', 'center');
    writeIn.attribute('maxlength', '1');
    writeIn.attribute('placeholder', '#');

    let writeBtn = createButton('Write');
    writeBtn.parent(manualRow);
    writeBtn.style('padding', '6px 10px');
    writeBtn.style('font-size', '12px');
    writeBtn.style('background', '#74b9ff');
    writeBtn.style('color', '#fff');
    writeBtn.mousePressed(() => {
       let val = writeIn.value() || '#';
       this.tm.tape.write(this.tm.head.index, val);
       this.tm.tape.highlights = {};
       this.tm.tape.setHighlight(this.tm.head.index, 'red');
       if(typeof playTMSound === 'function') playTMSound('write');
       writeIn.value('');
    });
  }
}

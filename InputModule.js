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
  }
}

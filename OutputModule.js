class OutputModule {
  constructor(containerId, tm) {
    this.tm = tm;
    this.container = select(`#${containerId}`);
    
    this.wrapper = createDiv('');
    this.wrapper.class('module');
    this.wrapper.style('min-width', '220px');
    this.wrapper.parent(this.container);
    
    let title = createElement('h3', 'Controls & Status');
    title.parent(this.wrapper);

    // Controls Row
    let btnRow = createDiv('');
    btnRow.style('display', 'grid');
    btnRow.style('grid-template-columns', '1fr 1fr');
    btnRow.style('gap', '10px');
    btnRow.style('margin-bottom', '15px');
    btnRow.parent(this.wrapper);

    this.stepBtn = createButton('Step');
    this.stepBtn.class('btn-step');
    this.stepBtn.parent(btnRow);
    this.stepBtn.mousePressed(() => {
      this.tm.status = "Running (Step)";
      this.tm.step();
    });

    this.runBtn = createButton('Run');
    this.runBtn.class('btn-run');
    this.runBtn.parent(btnRow);
    this.runBtn.mousePressed(() => {
      if(!this.tm.status.startsWith("Halted")) {
        this.tm.status = "Running";
      }
    });

    this.stopBtn = createButton('Stop');
    this.stopBtn.class('btn-stop');
    this.stopBtn.parent(btnRow);
    this.stopBtn.mousePressed(() => {
      if(this.tm.status === "Running") this.tm.status = "Stopped";
    });

    this.resetBtn = createButton('Reset');
    this.resetBtn.class('btn-reset');
    this.resetBtn.parent(btnRow);
    this.resetBtn.mousePressed(() => {
      if (typeof inputMod !== 'undefined') {
        this.tm.reset(inputMod.inputField.value());
      } else {
        this.tm.reset("");
      }
    });

    let sep = createDiv('');
    sep.style('border-top', '2px dashed #ffeaa7');
    sep.style('margin-bottom', '15px');
    sep.parent(this.wrapper);

    // Status Text
    this.stateDisplay = createP('');
    this.stateDisplay.parent(this.wrapper);
    this.stateDisplay.style('font-family', 'monospace');
    this.stateDisplay.style('font-size', '16px');
    this.stateDisplay.style('color', '#2d3436');
    this.stateDisplay.style('margin-top', '0');

    this.statusDisplay = createP('');
    this.statusDisplay.parent(this.wrapper);
    this.statusDisplay.style('font-family', 'monospace');
    this.statusDisplay.style('font-size', '16px');
    this.statusDisplay.style('color', '#2d3436');

    this.headPosDisplay = createP('');
    this.headPosDisplay.parent(this.wrapper);
    this.headPosDisplay.style('font-family', 'monospace');
    this.headPosDisplay.style('font-size', '16px');
    this.headPosDisplay.style('color', '#2d3436');
    
    this.update();
  }

  update() {
    this.stateDisplay.html(`<strong>State:</strong> <span style="color: #6c5ce7">${this.tm.currentState}</span>`);
    
    let statusColor = this.tm.status.startsWith("Halted") ? "#d63031" : "#00b894";
    this.statusDisplay.html(`<strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${this.tm.status}</span>`);
    
    this.headPosDisplay.html(`<strong>Head Index:</strong> <span style="color: #0984e3">${this.tm.head.index}</span>`);
  }
}

class LogModule {
  constructor(containerId) {
    this.container = select(`#${containerId}`);
    
    this.wrapper = createDiv('');
    this.wrapper.class('module');
    this.wrapper.parent(this.container);

    let titleRow = createDiv('');
    titleRow.style('display', 'flex');
    titleRow.style('justify-content', 'space-between');
    titleRow.style('align-items', 'center');
    titleRow.style('margin-bottom', '15px');
    titleRow.parent(this.wrapper);
    
    let title = createElement('h3', 'Execution Log');
    title.parent(titleRow);
    title.style('margin', '0');

    this.clearBtn = createButton('Clear Log');
    this.clearBtn.parent(titleRow);
    this.clearBtn.style('padding', '4px 8px');
    this.clearBtn.style('font-size', '12px');
    this.clearBtn.style('background', '#fab1a0');
    this.clearBtn.style('color', '#d63031');
    this.clearBtn.mousePressed(() => this.clear());

    this.logContainer = createDiv('');
    this.logContainer.parent(this.wrapper);
    this.logContainer.style('height', '180px');
    this.logContainer.style('overflow-y', 'auto');
    this.logContainer.style('background', '#fafbfc');
    this.logContainer.style('border', '2px solid #dfe6e9');
    this.logContainer.style('border-radius', '8px');
    this.logContainer.style('padding', '10px');
    this.logContainer.style('font-family', 'monospace');
    this.logContainer.style('font-size', '13px');
    this.logContainer.style('color', '#2d3436');
  }

  log(msg) {
    let p = createDiv(`> ${msg}`);
    p.style('margin', '4px 0');
    p.style('border-bottom', '1px solid #f1f1f1');
    p.style('padding-bottom', '4px');
    p.parent(this.logContainer);
    this.logContainer.elt.scrollTop = this.logContainer.elt.scrollHeight;
  }

  clear() {
    this.logContainer.html('');
  }
}

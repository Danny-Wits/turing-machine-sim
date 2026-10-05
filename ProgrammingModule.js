class ProgrammingModule {
  constructor(containerId, tm, diagramMod) {
    this.tm = tm;
    this.diagramMod = diagramMod;
    
    this.container = select(`#${containerId}`);
    
    this.wrapper = createDiv('');
    this.wrapper.class('module');
    this.wrapper.style('min-width', '500px');
    this.wrapper.style('height', '100%');
    this.wrapper.style('box-sizing', 'border-box');
    this.wrapper.parent(this.container);

    let titleRow = createDiv('');
    titleRow.style('display', 'flex');
    titleRow.style('justify-content', 'space-between');
    titleRow.style('align-items', 'center');
    titleRow.style('margin-bottom', '15px');
    titleRow.parent(this.wrapper);
    
    let title = createElement('h3', 'Programming Rules');
    title.parent(titleRow);
    title.style('margin', '0');

    let btnsDiv = createDiv('');
    btnsDiv.style('display', 'flex');
    btnsDiv.style('gap', '10px');
    btnsDiv.parent(titleRow);

    this.normalizeBtn = createButton('Auto-Rename States');
    this.normalizeBtn.parent(btnsDiv);
    this.normalizeBtn.style('background', '#a29bfe');
    this.normalizeBtn.style('color', '#fff');
    this.normalizeBtn.style('font-size', '12px');
    this.normalizeBtn.style('padding', '4px 8px');
    this.normalizeBtn.attribute('title', 'Rename all states to q0, q1, q2...');
    this.normalizeBtn.mousePressed(() => this.normalizeStates());

    this.toggleBtn = createButton('Switch to Text Mode');
    this.toggleBtn.parent(btnsDiv);
    this.toggleBtn.style('background', '#74b9ff');
    this.toggleBtn.style('color', '#fff');
    this.toggleBtn.style('font-size', '12px');
    this.toggleBtn.style('padding', '4px 8px');
    this.toggleBtn.mousePressed(() => this.toggleMode());

    this.isTextMode = false;

    // GUI MODE CONTAINER
    this.guiContainer = createDiv('');
    this.guiContainer.parent(this.wrapper);

    let headerRow = createDiv('');
    headerRow.style('display', 'grid');
    headerRow.style('grid-template-columns', '1fr 0.5fr 0.5fr 0.6fr 1fr 0.6fr');
    headerRow.style('gap', '5px');
    headerRow.style('font-weight', 'bold');
    headerRow.style('font-size', '13px');
    headerRow.style('color', '#636e72');
    headerRow.style('margin-bottom', '10px');
    headerRow.parent(this.guiContainer);
    
    createSpan('State').parent(headerRow);
    createSpan('Read').parent(headerRow);
    createSpan('Write').parent(headerRow);
    createSpan('Move').parent(headerRow);
    createSpan('Next State').parent(headerRow);
    createSpan('Actions').parent(headerRow);

    this.rulesContainer = createDiv('');
    this.rulesContainer.parent(this.guiContainer);
    this.rulesContainer.style('display', 'flex');
    this.rulesContainer.style('flex-direction', 'column');
    this.rulesContainer.style('gap', '10px');
    this.rulesContainer.style('margin-bottom', '15px');
    this.rulesContainer.style('max-height', '230px');
    this.rulesContainer.style('overflow-y', 'auto');
    this.rulesContainer.style('padding-right', '5px');
    
    this.rows = [];

    this.addBtn = createButton('+ Add Rule');
    this.addBtn.parent(this.guiContainer);
    this.addBtn.style('background', '#74b9ff');
    this.addBtn.style('color', '#fff');
    this.addBtn.mousePressed(() => {
      let lastState = 'q0';
      if (this.rows.length > 0) {
        lastState = this.rows[this.rows.length - 1].nextStateIn.value().trim() || 'q0';
      }
      let r = this.addRuleRow(lastState, '#', '#', 'R', lastState);
      r.readIn.elt.focus(); // Auto focus on Read input for fast typing
    });

    // TEXT MODE CONTAINER
    this.textContainer = createDiv('');
    this.textContainer.parent(this.wrapper);
    this.textContainer.hide();
    
    let textHelp = createP('Format: <code>State, Read -> Write, Move, NextState</code> (e.g., <code>q0, 0 -> 1, R, q1</code>)');
    textHelp.style('font-size', '12px');
    textHelp.style('color', '#636e72');
    textHelp.style('margin-top', '0');
    textHelp.parent(this.textContainer);

    this.textArea = createElement('textarea');
    this.textArea.parent(this.textContainer);
    this.textArea.style('width', '100%');
    this.textArea.style('height', '230px');
    this.textArea.style('box-sizing', 'border-box');
    this.textArea.style('font-family', 'monospace');
    this.textArea.style('padding', '10px');
    this.textArea.style('border', '2px solid #dfe6e9');
    this.textArea.style('border-radius', '8px');
    this.textArea.input(() => this.compileText());

    // Initial Rules
    this.addRuleRow('q0', '1', '1', 'R', 'q0');
    this.addRuleRow('q0', '0', '0', 'R', 'q0');
    this.addRuleRow('q0', '#', '1', 'N', 'q_accept');

    this.compile();
  }

  toggleMode() {
    this.isTextMode = !this.isTextMode;
    if (this.isTextMode) {
      this.toggleBtn.html('Switch to GUI Mode');
      this.guiContainer.hide();
      this.textContainer.style('display', 'block'); // Use block explicitly instead of show() to avoid layout issues
      
      // Build text from rules
      let lines = [];
      for (let r of this.rows) {
        let s = r.stateIn.value().trim();
        let rd = r.readIn.value();
        let w = r.writeIn.value();
        let m = r.moveSel.value();
        let ns = r.nextStateIn.value().trim();
        if (s) lines.push(`${s}, ${rd} -> ${w}, ${m}, ${ns}`);
      }
      this.textArea.value(lines.join('\n'));
    } else {
      this.toggleBtn.html('Switch to Text Mode');
      this.textContainer.hide();
      this.guiContainer.style('display', 'block');
      
      // Text to GUI logic happens automatically in compileText, but let's re-parse just to be safe
      this.parseTextToGui(this.textArea.value());
    }
  }

  parseTextToGui(text) {
    // Clear GUI rows
    for (let r of this.rows) r.row.remove();
    this.rows = [];

    let lines = text.split('\n');
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      let parts = line.split('->');
      if (parts.length === 2) {
        let left = parts[0].split(',');
        let right = parts[1].split(',');
        if (left.length === 2 && right.length === 3) {
          this.addRuleRow(left[0].trim(), left[1].trim(), right[0].trim(), right[1].trim(), right[2].trim());
        }
      }
    }
    this.compile();
  }

  compileText() {
    if (!this.isTextMode) return;
    let rules = {};
    let lines = this.textArea.value().split('\n');
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      let parts = line.split('->');
      if (parts.length === 2) {
        let left = parts[0].split(',');
        let right = parts[1].split(',');
        if (left.length === 2 && right.length === 3) {
          rules[`${left[0].trim()},${left[1].trim()}`] = {
            write: right[0].trim(),
            move: right[1].trim(),
            nextState: right[2].trim()
          };
        }
      }
    }
    this.tm.loadProgram(rules);
    if(this.diagramMod) this.diagramMod.update(rules);
  }

  addRuleRow(state, read, write, move, nextState) {
    let row = createDiv('');
    row.style('display', 'grid');
    row.style('grid-template-columns', '1fr 0.5fr 0.5fr 0.6fr 1fr 0.6fr');
    row.style('gap', '5px');
    row.parent(this.rulesContainer);

    let stateIn = createInput(state); stateIn.parent(row);
    let readIn = createInput(read); readIn.parent(row);
    let writeIn = createInput(write); writeIn.parent(row);
    
    let moveSel = createSelect();
    moveSel.option('L');
    moveSel.option('R');
    moveSel.option('N');
    moveSel.selected(move);
    moveSel.parent(row);
    moveSel.style('padding', '8px');
    moveSel.style('border', '2px solid #dfe6e9');
    moveSel.style('border-radius', '8px');
    moveSel.style('background', '#fafbfc');
    
    let nextStateIn = createInput(nextState); nextStateIn.parent(row);
    
    let actionDiv = createDiv('');
    actionDiv.style('display', 'flex');
    actionDiv.style('gap', '2px');
    actionDiv.parent(row);

    let dupBtn = createButton('⧉');
    dupBtn.parent(actionDiv);
    dupBtn.style('background', '#ffeaa7');
    dupBtn.style('color', '#fdcb6e');
    dupBtn.style('flex-grow', '1');
    dupBtn.style('padding', '0');
    dupBtn.attribute('title', 'Duplicate Rule');
    
    let delBtn = createButton('✕');
    delBtn.parent(actionDiv);
    delBtn.style('background', '#fab1a0');
    delBtn.style('color', '#d63031');
    delBtn.style('flex-grow', '1');
    delBtn.style('padding', '0');
    delBtn.attribute('title', 'Delete Rule');
    
    let rowData = { stateIn, readIn, writeIn, moveSel, nextStateIn, row };
    this.rows.push(rowData);

    // Pressing ENTER on Next State triggers a new rule
    nextStateIn.elt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.addBtn.elt.click();
      }
    });

    let triggerCompile = () => { if(!this.isTextMode) this.compile(); };
    stateIn.input(triggerCompile);
    readIn.input(triggerCompile);
    writeIn.input(triggerCompile);
    nextStateIn.input(triggerCompile);
    moveSel.changed(triggerCompile);

    dupBtn.mousePressed(() => {
      let r = this.addRuleRow(stateIn.value(), readIn.value(), writeIn.value(), moveSel.value(), nextStateIn.value());
      r.readIn.elt.focus();
      this.compile();
    });

    delBtn.mousePressed(() => {
      row.remove();
      this.rows = this.rows.filter(r => r !== rowData);
      this.compile();
    });

    if (!this.isTextMode) this.compile();
    return rowData;
  }

  loadFromRules(rulesObj) {
    if (this.isTextMode) this.toggleMode(); // switch to GUI to load properly
    
    for (let r of this.rows) {
      r.row.remove();
    }
    this.rows = [];

    for (let key in rulesObj) {
      let parts = key.split(',');
      let state = parts[0];
      let read = parts.slice(1).join(',');
      let val = rulesObj[key];
      this.addRuleRow(state, read, val.write, val.move, val.nextState);
    }
    this.compile();
  }

  compile() {
    let rules = {};
    for (let r of this.rows) {
      let state = r.stateIn.value().trim();
      let read = r.readIn.value();
      if (!state) continue;
      
      let left = `${state},${read}`;
      rules[left] = {
        write: r.writeIn.value(),
        move: r.moveSel.value(),
        nextState: r.nextStateIn.value().trim()
      };
    }
    this.tm.loadProgram(rules);
    
    if(this.diagramMod) {
      this.diagramMod.update(rules);
    }
  }

  normalizeStates() {
    if (this.isTextMode) this.toggleMode(); // Ensure we are modifying GUI

    let stateMap = {};
    let nextId = 0;
    
    let mapState = (s) => {
      s = s.trim();
      if (!s) return s;
      if (s === 'q_accept' || s === 'q_reject') return s;
      if (stateMap[s] === undefined) {
        stateMap[s] = 'q' + nextId;
        nextId++;
      }
      return stateMap[s];
    };

    if (this.rows.length > 0) {
      let firstState = this.rows[0].stateIn.value().trim();
      if (firstState && firstState !== 'q_accept' && firstState !== 'q_reject') {
        stateMap[firstState] = 'q0';
        nextId = 1;
      }
    }

    for (let r of this.rows) {
      r.stateIn.value(mapState(r.stateIn.value()));
      r.nextStateIn.value(mapState(r.nextStateIn.value()));
    }

    this.compile();
  }
}

const PRESETS = {
  "[Preset] Addition (Unary)": {
    inputString: "111011",
    rules: {
      "q0,1": {write: "1", move: "R", nextState: "q0"},
      "q0,0": {write: "1", move: "R", nextState: "q1"},
      "q1,1": {write: "1", move: "R", nextState: "q1"},
      "q1,#": {write: "#", move: "L", nextState: "q2"},
      "q2,1": {write: "#", move: "L", nextState: "q_accept"}
    }
  },
  "[Preset] Palindrome (Binary)": {
    inputString: "101101",
    rules: {
      "q0,0": {write: "#", move: "R", nextState: "q_find_right_0"},
      "q0,1": {write: "#", move: "R", nextState: "q_find_right_1"},
      "q0,#": {write: "#", move: "N", nextState: "q_accept"},
      "q_find_right_0,0": {write: "0", move: "R", nextState: "q_find_right_0"},
      "q_find_right_0,1": {write: "1", move: "R", nextState: "q_find_right_0"},
      "q_find_right_0,#": {write: "#", move: "L", nextState: "q_check_0"},
      "q_find_right_1,0": {write: "0", move: "R", nextState: "q_find_right_1"},
      "q_find_right_1,1": {write: "1", move: "R", nextState: "q_find_right_1"},
      "q_find_right_1,#": {write: "#", move: "L", nextState: "q_check_1"},
      "q_check_0,0": {write: "#", move: "L", nextState: "q_find_left"},
      "q_check_0,#": {write: "#", move: "N", nextState: "q_accept"},
      "q_check_0,1": {write: "1", move: "N", nextState: "q_reject"},
      "q_check_1,1": {write: "#", move: "L", nextState: "q_find_left"},
      "q_check_1,#": {write: "#", move: "N", nextState: "q_accept"},
      "q_check_1,0": {write: "0", move: "N", nextState: "q_reject"},
      "q_find_left,0": {write: "0", move: "L", nextState: "q_find_left"},
      "q_find_left,1": {write: "1", move: "L", nextState: "q_find_left"},
      "q_find_left,#": {write: "#", move: "R", nextState: "q0"}
    }
  },
  "[Preset] a^n b^n c^n": {
    inputString: "aabbcc",
    rules: {
      "q0,a": {write: "x", move: "R", nextState: "q1"},
      "q0,y": {write: "y", move: "R", nextState: "q4"},
      "q1,a": {write: "a", move: "R", nextState: "q1"},
      "q1,y": {write: "y", move: "R", nextState: "q1"},
      "q1,b": {write: "y", move: "R", nextState: "q2"},
      "q2,b": {write: "b", move: "R", nextState: "q2"},
      "q2,z": {write: "z", move: "R", nextState: "q2"},
      "q2,c": {write: "z", move: "L", nextState: "q3"},
      "q3,a": {write: "a", move: "L", nextState: "q3"},
      "q3,b": {write: "b", move: "L", nextState: "q3"},
      "q3,y": {write: "y", move: "L", nextState: "q3"},
      "q3,z": {write: "z", move: "L", nextState: "q3"},
      "q3,x": {write: "x", move: "R", nextState: "q0"},
      "q4,y": {write: "y", move: "R", nextState: "q4"},
      "q4,z": {write: "z", move: "R", nextState: "q4"},
      "q4,#": {write: "#", move: "N", nextState: "q_accept"}
    }
  }
};

class StorageModule {
  constructor(containerId, tm, progMod, inputMod) {
    this.tm = tm;
    this.progMod = progMod;
    this.inputMod = inputMod;
    this.container = select(`#${containerId}`);
    
    this.wrapper = createDiv('');
    this.wrapper.class('module');
    this.wrapper.style('min-width', '220px');
    this.wrapper.parent(this.container);

    let title = createElement('h3', 'Saved Machines');
    title.parent(this.wrapper);

    // Save Section
    let saveRow = createDiv('');
    saveRow.style('display', 'flex');
    saveRow.style('gap', '10px');
    saveRow.style('margin-bottom', '15px');
    saveRow.parent(this.wrapper);

    this.nameInput = createInput('');
    this.nameInput.attribute('placeholder', 'Machine Name...');
    this.nameInput.parent(saveRow);
    this.nameInput.style('flex-grow', '1');

    this.saveBtn = createButton('Save');
    this.saveBtn.parent(saveRow);
    this.saveBtn.style('background', '#55efc4');
    this.saveBtn.style('color', '#00b894');
    this.saveBtn.mousePressed(() => this.saveMachine());

    // Load Section
    let loadRow = createDiv('');
    loadRow.style('display', 'flex');
    loadRow.style('gap', '10px');
    loadRow.parent(this.wrapper);

    this.machineSelect = createSelect();
    this.machineSelect.parent(loadRow);
    this.machineSelect.style('flex-grow', '1');
    
    this.loadBtn = createButton('Load');
    this.loadBtn.parent(loadRow);
    this.loadBtn.style('background', '#74b9ff');
    this.loadBtn.style('color', '#0984e3');
    this.loadBtn.mousePressed(() => this.loadMachine());
    
    this.delBtn = createButton('X');
    this.delBtn.parent(loadRow);
    this.delBtn.style('background', '#fab1a0');
    this.delBtn.style('color', '#d63031');
    this.delBtn.mousePressed(() => this.deleteMachine());

    window.addEventListener('beforeunload', () => {
      this.autoSave();
    });

    this.refreshList();
  }

  saveMachine() {
    let name = this.nameInput.value().trim();
    if (!name) return alert("Please enter a name for the machine.");
    if (PRESETS[name]) return alert("Cannot overwrite a preset. Please pick a different name.");
    
    let data = {
      rules: this.tm.rules,
      inputString: this.inputMod.inputField.value()
    };
    
    let saved = JSON.parse(localStorage.getItem('tm_saved_machines') || '{}');
    saved[name] = data;
    localStorage.setItem('tm_saved_machines', JSON.stringify(saved));
    
    this.nameInput.value('');
    this.refreshList();
    
    this.machineSelect.selected(name);
  }

  loadMachine() {
    let name = this.machineSelect.value();
    if (!name || name.startsWith('--')) return;
    
    let data;
    if (PRESETS[name]) {
      data = PRESETS[name];
    } else {
      let saved = JSON.parse(localStorage.getItem('tm_saved_machines') || '{}');
      data = saved[name];
    }
    
    if (data) {
      this.inputMod.inputField.value(data.inputString || "");
      this.progMod.loadFromRules(data.rules || {});
      this.tm.reset(data.inputString || "");
    }
  }

  deleteMachine() {
    let name = this.machineSelect.value();
    if (!name || name.startsWith('--')) return;
    
    if (PRESETS[name]) {
      alert("Cannot delete a preset machine.");
      return;
    }
    
    if (confirm(`Are you sure you want to delete '${name}'?`)) {
      let saved = JSON.parse(localStorage.getItem('tm_saved_machines') || '{}');
      delete saved[name];
      localStorage.setItem('tm_saved_machines', JSON.stringify(saved));
      this.refreshList();
    }
  }

  refreshList() {
    this.machineSelect.elt.innerHTML = '';
    
    let hasItems = false;
    
    // Load presets first
    for (let p in PRESETS) {
      this.machineSelect.option(p);
      hasItems = true;
    }

    // Load user saves
    let saved = JSON.parse(localStorage.getItem('tm_saved_machines') || '{}');
    for (let name in saved) {
      this.machineSelect.option(name);
      hasItems = true;
    }
    
    if (!hasItems) {
      this.machineSelect.option('-- No saved machines --');
    }
  }

  autoSave() {
    let data = {
      rules: this.tm.rules,
      inputString: this.inputMod.inputField.value()
    };
    
    let saved = JSON.parse(localStorage.getItem('tm_saved_machines') || '{}');
    saved['current'] = data;
    localStorage.setItem('tm_saved_machines', JSON.stringify(saved));
  }

  autoLoad() {
    let saved = JSON.parse(localStorage.getItem('tm_saved_machines') || '{}');
    let data = saved['current'];
    if (data) {
      this.inputMod.inputField.value(data.inputString || "");
      this.progMod.loadFromRules(data.rules || {});
      this.tm.reset(data.inputString || "");
      return true;
    }
    return false;
  }
}

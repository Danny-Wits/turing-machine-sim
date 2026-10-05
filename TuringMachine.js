const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTMSound(type) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  let osc = audioCtx.createOscillator();
  let gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  let now = audioCtx.currentTime;

  if (type === 'write') {
    // A high-pitched, short computer-y beep
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'move') {
    // A low, mechanical click/thud
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.03);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.start(now);
    osc.stop(now + 0.03);
  } else if (type === 'read') {
    // Subtle tick for reading unchanged
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    osc.start(now);
    osc.stop(now + 0.02);
  }
}

class TuringMachine {
  constructor(tape, head) {
    this.tape = tape;
    this.head = head;
    this.rules = {};
    this.currentState = "q0";
    this.initialState = "q0";
    this.acceptState = "q_accept";
    this.rejectState = "q_reject";
    this.status = "Stopped";
    this.lastActiveEdge = null;
    this.renderOffsetIndex = 6;
    this.onLog = null;
  }

  loadProgram(rulesObj, startState = "q0") {
    this.rules = rulesObj;
    this.initialState = startState;
  }

  reset(inputString = "") {
    this.tape.clear(inputString);
    this.head.reset();
    this.currentState = this.initialState;
    this.status = "Stopped";
    this.lastActiveEdge = null;
    this.renderOffsetIndex = 6; // Offset so visible tape starts at -1
  }

  step() {
    if (this.status.startsWith("Halted")) {
      this.lastActiveEdge = null;
      return;
    }

    let readSym = this.tape.read(this.head.index);
    let prevState = this.currentState;
    let ruleKey = `${this.currentState},${readSym}`;
    let action = this.rules[ruleKey];

    if (!action) {
      action = this.rules[`${this.currentState},*`];
      if (!action) {
        this.status = "Halted (Reject - No Rule)";
        if (this.onLog) this.onLog(`Halted (Reject): No rule for [${prevState}] reading '${readSym}'`);
        this.lastActiveEdge = null;
        return;
      }
    }

    this.lastActiveEdge = `${this.currentState}->${action.nextState}`;
    let writeSym = action.write === '*' ? readSym : action.write;
    
    if (this.onLog) {
      this.onLog(`[${prevState}] read '${readSym}' ➔ write '${writeSym}', move ${action.move}, goto [${action.nextState}]`);
    }

    this.tape.highlights = {};
    if (writeSym !== readSym) {
      this.tape.setHighlight(this.head.index, 'red');
      playTMSound('write');
    } else {
      this.tape.setHighlight(this.head.index, 'green');
      playTMSound('read');
    }

    this.tape.write(this.head.index, writeSym);

    // Play move sound slightly after write/read so they don't overlap as heavily
    if (action.move === 'R') {
      this.head.moveRight();
      setTimeout(() => playTMSound('move'), 40);
    } else if (action.move === 'L') {
      this.head.moveLeft();
      setTimeout(() => playTMSound('move'), 40);
    }

    this.currentState = action.nextState;

    if (this.currentState === this.acceptState) {
      this.status = "Halted (Accept)";
      if (this.onLog) this.onLog(`Halted (Accept): Reached accept state.`);
    } else if (this.currentState === this.rejectState) {
      this.status = "Halted (Reject)";
      if (this.onLog) this.onLog(`Halted (Reject): Reached reject state.`);
    }
  }

  draw() {
    let dist = this.head.index - this.renderOffsetIndex;
    
    // Instead of strict centering, allow the head to roam within a window
    if (dist > 6) {
      this.renderOffsetIndex = this.head.index - 6;
      dist = 6;
    } else if (dist < -6) {
      this.renderOffsetIndex = this.head.index + 6;
      dist = -6;
    }

    // Draw the tape centered around the renderOffsetIndex
    this.tape.draw(this.renderOffsetIndex, 15);
    
    // Visually offset the head's x coordinate to hover over the correct cell
    this.head.x = this.tape.x + dist * this.tape.cellSize;
    
    this.head.draw(this.currentState);
  }
}

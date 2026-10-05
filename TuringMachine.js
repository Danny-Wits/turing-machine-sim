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
    this.renderOffsetIndex = 0;
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
    this.renderOffsetIndex = 0;
  }

  step() {
    if (this.status.startsWith("Halted")) {
      this.lastActiveEdge = null;
      return;
    }

    let readSym = this.tape.read(this.head.index);
    let ruleKey = `${this.currentState},${readSym}`;
    let action = this.rules[ruleKey];

    if (!action) {
      action = this.rules[`${this.currentState},*`];
      if (!action) {
        this.status = "Halted (Reject - No Rule)";
        this.lastActiveEdge = null;
        return;
      }
    }

    this.lastActiveEdge = `${this.currentState}->${action.nextState}`;

    let writeSym = action.write === '*' ? readSym : action.write;
    this.tape.highlights = {};
    if (writeSym !== readSym) {
      this.tape.setHighlight(this.head.index, 'red');
    } else {
      this.tape.setHighlight(this.head.index, 'green');
    }

    this.tape.write(this.head.index, writeSym);

    if (action.move === 'R') this.head.moveRight();
    else if (action.move === 'L') this.head.moveLeft();

    this.currentState = action.nextState;

    if (this.currentState === this.acceptState) {
      this.status = "Halted (Accept)";
    } else if (this.currentState === this.rejectState) {
      this.status = "Halted (Reject)";
    }
  }

  draw() {
    let dist = this.head.index - this.renderOffsetIndex;
    
    // If the head moves too close to the edge of the visible tape, re-center the tape
    if (Math.abs(dist) >= 6) {
      this.renderOffsetIndex = this.head.index;
      dist = 0;
    }

    // Draw the tape centered around the renderOffsetIndex
    this.tape.draw(this.renderOffsetIndex, 15);
    
    // Visually offset the head's x coordinate to hover over the correct cell
    this.head.x = this.tape.x + dist * this.tape.cellSize;
    
    this.head.draw(this.currentState);
  }
}

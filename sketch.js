let tape;
let head;
let tm;

let inputMod;
let outputMod;
let progMod;
let diagramMod;
let storageMod;

let lastRunTime = 0;
let runInterval = 250;

let lastRenderedState = null;
let lastRenderedEdge = null;

function setup() {
  let canvas = createCanvas(800, 200);
  canvas.parent('canvas-container');
  
  let cellSize = 50;
  tape = new Tape(width / 2 - cellSize / 2, height / 2 - cellSize / 2 - 20, cellSize);
  head = new Head(width / 2 - cellSize / 2, height / 2 - cellSize / 2 - 20, cellSize);
  
  tm = new TuringMachine(tape, head);
  
  // Initialize UI Modules to their respective containers
  inputMod = new InputModule('io-col', tm);
  outputMod = new OutputModule('io-col', tm);
  
  diagramMod = new StateDiagramModule('canvas-container');
  progMod = new ProgrammingModule('prog-module', tm, diagramMod);
  storageMod = new StorageModule('io-col', tm, progMod, inputMod);

  // Try to load autosaved state, otherwise load default
  if (!storageMod.autoLoad()) {
    tm.reset("10110");
  }
}

function draw() {
  background('#f8f9fa');
  
  if (tm.status === "Running") {
    if (millis() - lastRunTime > runInterval) {
      tm.step();
      lastRunTime = millis();
    }
  }

  tm.draw();
  outputMod.update();

  if (tm.currentState !== lastRenderedState || tm.lastActiveEdge !== lastRenderedEdge) {
    if (diagramMod) {
      diagramMod.highlight(tm.currentState, tm.lastActiveEdge);
    }
    lastRenderedState = tm.currentState;
    lastRenderedEdge = tm.lastActiveEdge;
  }
}

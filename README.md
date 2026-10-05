# [ TM_SIM ] 

A highly interactive, visual, and heavily polished **Turing Machine Simulator** built with pure JavaScript, HTML/CSS, **p5.js** (for the tape/head rendering), and **vis-network** (for the live state diagram). 

Designed to make understanding and programming Turing Machines both intuitive and satisfying, featuring mechanical sound effects, visual trails, and powerful rule-editing tools.

---

### ✨ Features

- 🎥 **Dynamic Visual Tape:** A mechanical-style infinite tape. The head always tries to stay on the left side to maximize viewable tape area, and smoothly pulls the "camera" when moving out of bounds.
- 🔊 **Mechanical Sound Effects:** Fully synthesized Web Audio API sounds. Hear a satisfying low thud when the head moves, a high beep when writing, and a subtle tick when reading.
- 🔴 **Live Visual Tracing:** As the machine runs, it leaves a trail. Green cells indicate the machine read the cell without changing it. Red cells indicate a new symbol was written.
- 🕸️ **Live State Diagram:** The state machine network is dynamically generated from your rules. As the machine runs, the currently active state and transition edge light up in red.
- ⚡ **Streamlined Rule Editor:** Edit rules via a clean GUI grid with keyboard shortcuts (Enter to chain), or switch to **Bulk Text Mode** to quickly type out your rules in plain text.
- 🧹 **Auto-Rename States:** Wrote a messy program with arbitrary state names? Click one button to instantly normalize your entire program into a clean `q0, q1, q2...` sequence.
- 🕹️ **Manual Controls:** Pause the machine and manually step the head left/right or write directly to the tape.
- 💾 **Local Storage & Presets:** Includes classic built-in presets (Unary Addition, Palindromes, a^n b^n c^n). Your current machine is autosaved so you never lose your work.
- 📜 **Execution Log:** A real-time terminal log detailing every single read, write, and move operation.
- 📱 **Mobile Responsive:** Works beautifully on phones and tablets.

---

### 🚀 How to Use

The Turing Machine operates based on a set of transition rules.

1. **State:** The current state of the machine.
2. **Read:** The symbol currently underneath the Head. (Use `#` for blank spaces, or `*` for a wildcard match).
3. **Write:** The symbol to write to the tape. (Use `*` to keep the original symbol unchanged).
4. **Move:** Which direction the head should move (`L` for Left, `R` for Right, `N` for No Move).
5. **Next State:** The state the machine enters next. 

Special states `q_accept` and `q_reject` will halt the machine.

#### Example (Bulk Text Mode)
```text
q0, 0 -> #, R, q_find_right_0
q0, 1 -> #, R, q_find_right_1
q0, # -> #, N, q_accept
```

---

### 💻 Running Locally

This project is completely client-side and requires no build steps. 

To run it locally:
1. Clone the repository: `git clone https://github.com/Danny-Wits/turing-machine-sim.git`
2. Open the directory.
3. Serve it using a simple local web server to avoid CORS issues:
   ```bash
   python3 -m http.server 8000
   ```
4. Open your browser and navigate to `http://localhost:8000`.

---

*Created by [dannywits](https://github.com/dannywits)*

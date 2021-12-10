const utils = require('../utils');

const lines = utils.getInput();

const matches = { '(': ')', '[': ']', '{': '}', '<': '>' };
const opening = '([{<';

let scores = [];

lines.forEach(processLine);
scores.sort((a, b) => a - b);

console.log(scores[Math.floor(scores.length / 2)]);

// -------------------- helpers --------------------------

function processLine(line) {
  const stack = [];
  for (let c of [...line]) {
    if (opening.indexOf(c) !== -1) {
      stack.push(c);
    } else if (matches[stack.pop()] !== c) {
      return;
    }
  }

  if (stack.length > 0) {
    let score = 0;
    while (stack.length > 0) {
      score *= 5;
      score += ')]}>'.indexOf(matches[stack.pop()]) + 1;
    }
    scores.push(score);
  }
}

const utils = require('../utils');

const lines = utils.getInput();

const scores = { ')': 3, ']': 57, '}': 1197, '>': 25137 };
const matches = { '(': ')', '[': ']', '{': '}', '<': '>' };
const opening = '([{<';

let score = 0;
for (let line of lines) {
  const stack = [];
  for (let c of [...line]) {
    if (opening.indexOf(c) !== -1) {
      stack.push(c);
    } else if (matches[stack.pop()] !== c) {
      score += scores[c];
      break;
    }
  }
}

console.log(score);

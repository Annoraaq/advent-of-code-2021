const utils = require('../utils');

const lines = utils.getInput();

let current = lines[0].split('');
let next = [...current];
const rules = new Map();
for (let i = 1; i < lines.length; i++) {
  const [lhs, , rhs] = lines[i].split(' ');
  rules.set(lhs, rhs);
}

const steps = 10;

for (let step = 1; step <= steps; step++) {
  let offset = 1;
  for (let i = 1; i < current.length; i++) {
    if (rules.has(`${current[i - 1]}${current[i]}`)) {
      next[offset - 1] = current[i - 1];
      next[offset] = rules.get(`${current[i - 1]}${current[i]}`);
      next[offset + 1] = current[i];
      offset++;
    } else {
      next[offset - 1] = current[i - 1];
      next[offset] = current[i];
    }
    offset++;
  }

  current = next;
  next = [...current];
}

const freqMap = new Map();
for (let c of current) {
  if (!freqMap.has(c)) freqMap.set(c, 0);
  freqMap.set(c, freqMap.get(c) + 1);
}

const min = Math.min(...freqMap.values());
const max = Math.max(...freqMap.values());

console.log(max - min);

// -------------------- helpers --------------------------

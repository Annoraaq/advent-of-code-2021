const { isUint8ClampedArray } = require('util/types');
const utils = require('../utils');

const lines = utils.getInput();

let current = lines[0].split('');
let next = [...current];
const rules = new Map();
for (let i = 1; i < lines.length; i++) {
  const [lhs, , rhs] = lines[i].split(' ');
  rules.set(lhs, rhs);
}

const steps = 40;

let pairs = new Map();
for (let i = 1; i < current.length; i++) {
  pairs.set(current[i - 1] + current[i], 1);
}

for (let step = 1; step <= steps; step++) {
  const newPairs = new Map(Array.from(pairs));
  for (const [lhs, rhs] of rules) {
    if (pairs.has(lhs)) {
      newPairs.set(lhs, newPairs.get(lhs) - pairs.get(lhs));
      incMap(newPairs, lhs[0] + rhs, pairs.get(lhs));
      incMap(newPairs, rhs + lhs[1], pairs.get(lhs));
    }
  }
  pairs = newPairs;
}


const freqMap = new Map();
for (const [key, value] of pairs) {
  incMap(freqMap, key[0], value);
  incMap(freqMap, key[1], value);
}

freqMap.set(current[0], freqMap.get(current[0]) + 1);
freqMap.set(current[current.length - 1], freqMap.get(current[current.length - 1]) + 1);

const min = Math.min(...freqMap.values());
const max = Math.max(...freqMap.values());

console.log(max / 2 - min / 2);

// -------------------- helpers --------------------------

function incMap(map, key, val = 1) {
  if (!map.has(key)) map.set(key, 0);
  map.set(key, map.get(key) + val);
}

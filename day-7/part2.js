const utils = require('../utils');

const crabPositions = utils.getInput()[0].split(',').map(s => Number(s));

const min = Math.min(...crabPositions);
const max = Math.max(...crabPositions);
let minVal = Number.MAX_VALUE;
for (let pos = min; pos <= max; pos++) {
  let sum = crabPositions.reduce((prev, curr) => prev + cost(curr, pos), 0);
  if (sum < minVal) minVal = sum;
}
console.log(minVal);

function cost(from, to) {
  const dist = Math.abs(from - to);
  return (dist * (dist + 1)) / 2;
}

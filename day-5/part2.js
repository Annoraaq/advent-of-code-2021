const utils = require('../utils');

const input = utils.getInput();

const map = new Map();

for (let line of input) {
  const [lhs, , rhs] = line.split(' ');
  const [[x1, y1], [x2, y2]] = [lhs.split(',').map(s => Number(s)), rhs.split(',').map(s => Number(s))];

  const offset = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
  for (let off = 0; off <= offset; off++) {
    const signX = x1 === x2 ? 0 : x1 < x2 ? 1 : -1;
    const signY = y1 === y2 ? 0 : y1 < y2 ? 1 : -1;
    addToMap(x1 + off * signX, y1 + off * signY);
  }
}

let dangerZoneCount = 0;
for (const [x, yMap] of map) {
  for (const [y, count] of yMap) {
    if (count >= 2) {
      dangerZoneCount++;
    }
  }
}

console.log(dangerZoneCount);

// ---------------- helpers -----------------------

function addToMap(x, y) {
  if (!map.has(x)) {
    map.set(x, new Map());
  }
  const oldVal = map.get(x).has(y) ? map.get(x).get(y) : 0;
  map.get(x).set(y, oldVal + 1);
}

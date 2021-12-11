const utils = require('../utils');

const map = utils.getIntGridInput();

let step = 0;

while (true) {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      map[row][col]++;
    }
  }

  let hasFlashed;
  do {
    hasFlashed = false;
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        if (map[row][col] > 9) {
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (i !== 0 || j !== 0) {
                inc(row + i, col + j, map);
              }
            }
          }
          hasFlashed = true;
          map[row][col] = 0;
        }
      }
    }
  } while (hasFlashed);

  step++;
  if (allFlashed()) break;
}

console.log(step);

// -------------------- helpers --------------------------

function allFlashed() {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] !== 0) return false;
    }
  }
  return true;
}

function inc(row, col, map) {
  if (row < 0) return;
  if (row >= map.length) return;
  if (col < 0) return;
  if (col >= map[row].length) return;
  if (map[row][col] === 0) return;
  map[row][col]++;
}

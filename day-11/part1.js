const utils = require('../utils');

const map = utils.getIntGridInput();

const MAX_STEPS = 100;

let flashes = 0;

for (let currentStep = 0; currentStep < MAX_STEPS; currentStep++) {
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
          flashes++;
          map[row][col] = 0;
        }
      }
    }
  } while (hasFlashed);
}

console.log(flashes);

// -------------------- helpers --------------------------

function inc(row, col, map) {
  if (row < 0) return;
  if (row >= map.length) return;
  if (col < 0) return;
  if (col >= map[row].length) return;
  if (map[row][col] === 0) return;
  map[row][col]++;
}

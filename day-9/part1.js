const utils = require('../utils');

const map = utils.getIntGridInput();

let sum = 0;
for (let row = 0; row < map.length; row++) {
  for (let col = 0; col < map[0].length; col++) {

    if (getNeighbours(row, col, map).every(el => el > map[row][col])) {
      sum += map[row][col] + 1;
    }
  }
}

console.log(sum);

// -------------------- helpers --------------------------

function getNeighbours(row, col, map) {
  const neighbours = [];

  if (row > 0) neighbours.push(map[row - 1][col]);
  if (col > 0) neighbours.push(map[row][col - 1]);
  if (row < map.length - 1) neighbours.push(map[row + 1][col]);
  if (col < map[0].length - 1) neighbours.push(map[row][col + 1]);

  return neighbours;
}

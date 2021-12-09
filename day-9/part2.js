
const utils = require('../utils');

const map = utils.getIntGridInput();

const basinSizes = [];
const markedPositions = new Set();
for (let row = 0; row < map.length; row++) {
  for (let col = 0; col < map[0].length; col++) {
    if (!markedPositions.has(`${row}#${col}`) && map[row][col] !== 9) {
      basinSizes.push(dfs(row, col, map));
    }
  }
}

basinSizes.sort((a, b) => a - b);
const largestSizes = [];
for (let i = 1; i <= 3; i++) {
  largestSizes.push(basinSizes[basinSizes.length - i]);
}
console.log(largestSizes.reduce((prev, curr) => prev * curr));

// -------------------- helpers --------------------------

function dfs(row, col, map) {
  markedPositions.add(`${row}#${col}`);
  const unmarkedNeighbours = getUnmarkedNeighbours(row, col, map);

  if (unmarkedNeighbours.length === 0) {
    return 1;
  }
  let sum = 1;
  for (let [row, col] of unmarkedNeighbours) {
    if (!markedPositions.has(`${row}#${col}`)) {
      sum += dfs(row, col, map);
    }
  }
  return sum;
}

function getUnmarkedNeighbours(row, col, map) {
  return getNeighbours(row, col, map)
    .filter(([row, col, val]) => !markedPositions.has(`${row}#${col}`) && val !== 9);
}

function getNeighbours(row, col, map) {
  const neighbours = [];

  if (row > 0) neighbours.push([row - 1, col, map[row - 1][col]]);
  if (col > 0) neighbours.push([row, col - 1, map[row][col - 1]]);
  if (row < map.length - 1) neighbours.push([row + 1, col, map[row + 1][col]]);
  if (col < map[0].length - 1) neighbours.push([row, col + 1, map[row][col + 1]]);

  return neighbours;
}



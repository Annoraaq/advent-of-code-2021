const utils = require('../utils');

const map = utils.getIntGridInput();
const height = map.length;
const width = map[0].length;

const risk = new Array(height);
for (let y = 0; y < height; y++) {
  risk[y] = new Array(width);
}

risk[height - 1][width - 1] = map[height - 1][width - 1];

for (let y = height - 1; y >= 0; y--) {
  for (let x = width - 1; x >= 0; x--) {
    if (!(y === height - 1 && x === width - 1)) {
      risk[y][x] = map[y][x] + Math.min(safeRisk(y + 1, x), safeRisk(y, x + 1));
    }
  }
}

console.log(risk[0][0] - map[0][0]);

// -------------------- helpers --------------------------
function safeRisk(y, x) {
  if (y >= height || x >= width) return Number.MAX_VALUE;
  return risk[y][x];
}

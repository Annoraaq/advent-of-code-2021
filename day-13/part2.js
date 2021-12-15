const utils = require('../utils');

const lines = utils.getRawInput().split("\n");

let points = new Set();
const folds = [];
let readPoints = true;
for (let line of lines) {
  if (readPoints && line === "") {
    readPoints = false;
    continue;
  }
  if (readPoints) {
    points.add(line);
  } else {
    if (line !== '') {
      folds.push(
        line.substr('fold along '.length));
    }
  }
}

for (let fold of folds) {
  const [axis, val] = fold.split('=');
  let newPoints = new Set();
  [...points].map(s => s.split(',')).forEach(([x, y]) => {
    const coord = axis === 'y' ? y : x;
    if (coord <= Number(val)) {
      newPoints.add(`${x},${y}`);
    } else {
      if (axis === 'y') {
        newPoints.add(`${x},${val - (y - val)}`);
      } else {
        newPoints.add(`${val - (x - val)},${y}`);
      }
    }
  });
  points = newPoints;
}

const maxX = Math.max(...[...points].map(p => p.split(',')).map(([x, y]) => Number(x)));
const maxY = Math.max(...[...points].map(p => p.split(',')).map(([x, y]) => Number(y)));

for (let y = 0; y <= maxY; y++) {
  let line = '';
  for (let x = 0; x <= maxX; x++) {
    line += points.has(`${x},${y}`) ? '#' : ' ';
  }
  console.log(line);
}

// -------------------- helpers --------------------------

const utils = require('../utils');

const lines = utils.getRawInput().split("\n");

const points = new Set();
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

let doubles = 0;
const [axis, val] = folds[0].split('=');
[...points].map(s => s.split(',')).forEach(([x, y]) => {
  const coord = axis === 'y' ? y : x;
  if (coord > Number(val)) {
    if (axis === 'y') {
      if (points.has(`${x},${val - (y - val)}`)) { doubles++ }
    } else {
      if (points.has(`${val - (x - val)},${y}`)) { doubles++ }
    }
  }
});

console.log(points.size - doubles);

// -------------------- helpers --------------------------

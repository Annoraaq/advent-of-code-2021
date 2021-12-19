const utils = require('../utils');

const [, , x, y] = utils.getInput()[0].split(' ');
const [xMinStr, xMaxStr] = x.substr(2).split('..');
const xMin = Number(xMinStr);
const xMax = Number(xMaxStr.substr(0, xMaxStr.length - 1));

const [yMinStr, yMaxStr] = y.substr(2).split('..');
const yMin = Number(yMinStr);
const yMax = Number(yMaxStr);

let maxY = 0;
let cnt = 0;
for (let i = -1000; i < 1000; i++) {
  for (let j = -1000; j < 1000; j++) {
    const testRes = testVelo(i, j);
    if (testRes !== false) {
      cnt++;
      maxY = Math.max(maxY, testRes);
    }
  }
}

console.log(cnt);

// -------------------- helpers --------------------------

function testVelo(xVelo, yVelo) {
  let x = 0;
  let y = 0;
  let step = 0;
  let my = 0;
  while (step < 1000) {
    if (isInTargetArea(x, y)) {
      return my;
    }
    [x, y, xVelo, yVelo] = simStep(x, y, xVelo, yVelo);
    my = Math.max(my, y);
    step++;
  }
  return false;
}

function isInTargetArea(x, y) {
  return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
}

function simStep(x, y, xVelo, yVelo) {
  x += xVelo;
  y += yVelo;
  if (xVelo > 0) {
    xVelo--;
  } else if (xVelo < 0) {
    xVelo++;
  }
  yVelo--;

  return [x, y, xVelo, yVelo];
}

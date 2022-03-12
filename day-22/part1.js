const utils = require('../utils');

const min = -50;
const max = 50;

const inputLines = utils.getInput();
const commands = inputLines.map(inputLine => {
  const [onOff, rest] = inputLine.split(' ');
  return [onOff == 'on' ? true : false, rest.split(',').map(raw => raw.substr(2).split('..').map(Number))];
});

const cube = [];
for (let x = min; x <= max; x++) {
  cube[x] = [];
  const yR = [];
  for (let y = min; y <= max; y++) {
    yR[y] = [];
    const zR = [];
    for (let z = min; z <= max; z++) {
      zR[z] = false;
    }
    yR[y] = zR;
  }
  cube[x] = yR;
}

for (let cmd of commands) {
  const [onOff, limits] = cmd;

  if (limits[0][0] < min) continue;
  if (limits[1][0] < min) continue;
  if (limits[2][0] < min) continue;
  if (limits[0][1] > max) continue;
  if (limits[1][1] > max) continue;
  if (limits[2][1] > max) continue;

  for (let x = limits[0][0]; x <= limits[0][1]; x++) {
    for (let y = limits[1][0]; y <= limits[1][1]; y++) {
      for (let z = limits[2][0]; z <= limits[2][1]; z++) {
        cube[x][y][z] = onOff;
      }
    }
  }
}

let count = 0;
for (let x = min; x <= max; x++) {
  for (let y = min; y <= max; y++) {
    for (let z = min; z <= max; z++) {
      if (cube[x][y][z]) {
        count++;
      }
    }
  }
}

console.log(count);

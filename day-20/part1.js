const utils = require('../utils');

const inputLines = utils.getInput();

const enhancementStr = inputLines[0];

const image = inputLines.slice(1).map(row => row.split(''));

let out = runEnhancement(image, 0);
out = runEnhancement(out, 1);
console.log(out.map(row => row.join('')).join('\n'));
console.log(countPixels(out));

// -------------------- helpers --------------------------

function runEnhancement(input, iteration) {
  const out = input.map(row => [...row]);
  const offset = 1;

  for (let row = -offset; row < input.length + offset; row++) {
    for (let col = -offset; col < input[0].length + offset; col++) {
      if (out[row + offset] === undefined) {
        out[row + offset] = [];
      }
      out[row + offset][col + offset] = enhancementStr[toInt(getSurroundingStr(input, row, col, iteration))];
    }
  }
  return out;
}

function getSurroundingStr(image, row, col, iteration) {
  let str = '';
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      str += access(image, row + i, col + j, iteration);
    }
  }
  return str;
}

function outOfRange(iteration) {
  if (enhancementStr[0] === '.') return '.';
  return iteration % 2 === 0 ? '.' : '#';
}

function access(image, row, col, iteration) {
  if (row < 0 || row >= image.length || col < 0 || col >= image[row].length) {
    return outOfRange(iteration);
  }
  return image[row][col];
}

function toInt(str) {
  str = str.replaceAll('.', '0');
  str = str.replaceAll('#', '1');
  return parseInt(str, 2);
}

function countPixels(map) {
  let count = 0;
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] == '#') count++;
    }
  }
  return count;
}

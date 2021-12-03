const utils = require('../utils');

const input = utils.getCharGridInput();

const oxygenGeneratorRating = findNum(input, getMostCommonVal);
const co2ScrubberRating = findNum(input, getLeastCommonVal);

console.log(oxygenGeneratorRating * co2ScrubberRating);

// ---------------- helpers -----------------------

function getMostCommonVal(input, col) {
  let oneCount = 0;
  for (let row = 0; row < input.length; row++) {
    if (input[row][col] === '1') {
      oneCount++;
    }
  }
  return oneCount >= input.length - oneCount ? '1' : '0';
}

function findNum(input, filterFn) {
  let remaining = [...input];
  for (let col = 0; col < input[0].length; col++) {
    remaining = remaining.filter(line =>
      line[col] === filterFn(remaining, col)
    );
    if (remaining.length === 1) break;
  }

  return parseInt(remaining[0].join(''), 2);

}

function getLeastCommonVal(input, col) {
  return getMostCommonVal(input, col) === '1' ? '0' : '1';
}

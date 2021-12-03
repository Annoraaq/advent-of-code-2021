const utils = require('../utils');

const input = utils.getCharGridInput();

let gamma = '';
let epsilon = '';

for (let col = 0; col < input[0].length; col++) {
  let oneCount = 0;
  for (let row = 0; row < input.length; row++) {
    if (input[row][col] === '1') {
      oneCount++;
    }
  }
  if (oneCount >= input.length - oneCount) {
    gamma += '1';
    epsilon += '0';
  } else {
    gamma += '0';
    epsilon += '1';
  }
}

const gammaInt = parseInt(gamma, 2);
const epsilonInt = parseInt(epsilon, 2);

console.log(gammaInt * epsilonInt);





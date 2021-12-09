const utils = require('../utils');

const inputs = [];
const outputs = []
utils.getInput().forEach(s => {
  const [input, output] = s.split('|');
  inputs.push(input.split(' ').filter(s => s !== ''));
  outputs.push(output.split(' ').filter(s => s !== ''));
});

let count = 0;
for (let output of outputs) {
  for (let digit of output) {
    const validLengths = [2, 3, 4, 7];
    if (validLengths.includes(digit.length)) {
      count++;
    }
  }
}

console.log(count);




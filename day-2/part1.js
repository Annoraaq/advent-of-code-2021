const utils = require('../utils');

const input = utils.getInput();

let depth = 0;
let hPos = 0;
input.forEach(inputLine => {
  const [command, amount] = inputLine.split(' ');
  const numAmount = Number(amount);
  switch (command) {
    case 'forward':
      hPos += numAmount;
      break;
    case 'down':
      depth += numAmount;
      break;
    case 'up':
      depth -= numAmount;
      break;
  }
});

console.log(hPos * depth);

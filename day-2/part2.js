const utils = require('../utils');

const input = utils.getInput();

let depth = 0;
let hPos = 0;
let aim = 0;
input.forEach(inputLine => {
  const [command, amount] = inputLine.split(' ');
  const numAmount = Number(amount);
  switch (command) {
    case 'forward':
      hPos += numAmount;
      depth += aim * numAmount;
      break;
    case 'down':
      aim += numAmount;
      break;
    case 'up':
      aim -= numAmount;
      break;
  }
});

console.log(hPos * depth);

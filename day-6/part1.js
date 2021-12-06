const utils = require('../utils');

const startFishList = utils.getInput()[0].split(',');
const DAYS = 80;

let fishArr = new Array(9).fill(0);

for (let fish of startFishList) {
  fishArr[fish]++;
}

for (let day = 0; day < DAYS; day++) {
  const newFishArr = new Array(9).fill(0);

  // breed new fish
  newFishArr[8] = fishArr[0];
  newFishArr[6] = fishArr[0];

  // count down other fish
  for (let i = 0; i < 8; i++) {
    newFishArr[i] += fishArr[i + 1];
  }

  fishArr = newFishArr;
}

const sum = fishArr.reduce((prev, curr) => prev + curr);
console.log(sum);



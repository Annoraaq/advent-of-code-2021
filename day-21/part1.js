const utils = require('../utils');

const inputLines = utils.getInput();

const maxPoints = 1000;
const boardSize = 10;

let p1Pos = extractLastNumber(inputLines[0]);
let p2Pos = extractLastNumber(inputLines[1]);

let p1Points = 0;
let p2Points = 0;

const dice = { val: 1, max: 100, counter: 0 };

while (p1Points < maxPoints && p2Points < maxPoints) {
  const p1Roll = roll(dice) + roll(dice) + roll(dice);
  p1Pos = ((p1Pos + p1Roll + boardSize - 1) % boardSize) + 1;

  p1Points += p1Pos;
  if (p1Points >= maxPoints) {
    console.log('player 1 won:', p1Points);
    console.log(dice.counter * p2Points);
    break;
  }

  const p2Roll = roll(dice) + roll(dice) + roll(dice);
  p2Pos = ((p2Pos + p2Roll + boardSize - 1) % boardSize) + 1;

  p2Points += p2Pos;
  if (p2Points >= maxPoints) {
    console.log('player 2 won:', p2Points);
    console.log(dice.counter * p1Points);
    break;
  }
}

// -------------------- helpers --------------------------

function extractLastNumber(input) {
  const inArr = input.split(' ');
  return Number(inArr[inArr.length - 1]);
}

function roll(dice) {
  const val = dice.val;
  if (dice.val === dice.max) {
    dice.val = 1;
  } else {
    dice.val += 1;
  }

  dice.counter++;

  return val;
}


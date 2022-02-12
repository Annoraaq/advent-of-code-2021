const utils = require('../utils');

const inputLines = utils.getInput();

const maxPoints = 21;
const boardSize = 10;

let p1Pos = extractLastNumber(inputLines[0]);
let p2Pos = extractLastNumber(inputLines[1]);

let p1Points = 0;
let p2Points = 0;

const dice = { val: 1, max: 100, counter: 0 };

const memo = new Map();

console.log(count(p1Pos, p2Pos, 0, 0, true));

function count(p1Pos, p2Pos, p1Points, p2Points, isP1Turn) {
  if (memo.has(key(p1Pos, p2Pos, p1Points, p2Points, isP1Turn))) {
    return memo.get(key(p1Pos, p2Pos, p1Points, p2Points, isP1Turn));
  }
  const c = [0, 0];

  if (p1Points >= maxPoints) {
    memo.set(key(p1Pos, p2Pos, p1Points, p2Points, isP1Turn), [1, 0]);
    return [1, 0];
  } else if (p2Points >= maxPoints) {
    memo.set(key(p1Pos, p2Pos, p1Points, p2Points, isP1Turn), [0, 1]);
    return [0, 1];
  }

  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      for (let k = 1; k <= 3; k++) {
        if (isP1Turn) {
          const newP1Pos = ((p1Pos + (i + j + k) + boardSize - 1) % boardSize) + 1;
          const res = count(newP1Pos, p2Pos, p1Points + newP1Pos, p2Points, false);
          c[0] += res[0];
          c[1] += res[1];
        } else {
          const newP2Pos = ((p2Pos + (i + j + k) + boardSize - 1) % boardSize) + 1;
          const res = count(p1Pos, newP2Pos, p1Points, p2Points + newP2Pos, true);
          c[0] += res[0];
          c[1] += res[1];
        }
      }
    }
  }


  memo.set(key(p1Pos, p2Pos, p1Points, p2Points, isP1Turn), [...c]);
  return c;
}

// -------------------- helpers --------------------------

function key(p1Pos, p2Pos, p1Points, p2Points, isP1Turn) {
  return `${p1Pos}#${p2Pos}#${p1Points}#${p2Points}#${isP1Turn}`;
}

function extractLastNumber(input) {
  const inArr = input.split(' ');
  return Number(inArr[inArr.length - 1]);
}

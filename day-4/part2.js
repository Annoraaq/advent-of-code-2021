// Please make sure your input has a trailing blank line. Otherwise it will not
// work.

const utils = require('../utils');

const input = utils.getRawInput().split('\n');

const randomNumbers = input[0].split(',').map(str => Number(str));
let boards = readBoardsFromInput(input);

let winningBoard;
let finalRandomNumber;
for (let num of randomNumbers) {
  finalRandomNumber = num;
  boards.forEach(board => markBoard(board, num));
  if (boards.length == 1 && hasWon(boards[0])) {
    winningBoard = boards[0];
    break;
  }
  boards = boards.filter(board => !hasWon(board));
}

console.log(boardSum(winningBoard) * finalRandomNumber);

// ---------------- helpers -----------------------

function boardSum(board) {
  let sum = 0;
  for (let row of board) {
    for (let el of row) {
      if (el.marked === false) sum += el.val;
    }
  }
  return sum;
}

function hasWon(board) {
  for (let row = 0; row < board.length; row++) {
    let rowWon = true;
    for (let col = 0; col < board[0].length; col++) {
      if (board[row][col].marked === false) rowWon = false;
    }
    if (rowWon) return true;
  }

  for (let col = 0; col < board[0].length; col++) {
    let colWon = true;
    for (let row = 0; row < board.length; row++) {
      if (board[row][col].marked === false) colWon = false;
    }
    if (colWon) return true;
  }

  return false;
}

function markBoard(board, num) {
  for (let row of board) {
    for (let el of row) {
      if (el.val === num) el.marked = true;
    }
  }
}

function readBoardsFromInput(input) {
  const boards = [];
  let currentBoard = [];
  for (let i = 2; i < input.length; i++) {
    if (input[i] === '') {
      boards.push(currentBoard);
      currentBoard = [];
    } else {
      const line = input[i].split(' ').filter(s => s !== '').map(s => ({ val: Number(s), marked: false }));
      currentBoard.push(line);
    }
  }
  return boards;
}








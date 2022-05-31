const utils = require('../utils');
const programs = [];
const commands = utils.getInput().map(line => line.split(' '));

let p = [];
commands.forEach(cmd => {
  if (p.length > 0 && cmd[0] == 'inp') {
    programs.push(p);
    p = [cmd];
  } else {
    p.push(cmd);
  }
});

if (p.length > 0) programs.push(p);

let mins = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
let max = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9];

for (let i = 9; i >= 1; i--) {
  mins[0] = i;
  if (isPossible(mins, max)) {
    break;
  }
}

max[0] = mins[0];

console.log('first digit:', mins[0]);
find(mins, max);

// ------------------- helpers ------------------------

function equal(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

function isPossible(mins, max) {
  let possibleZ = new Set([0]);
  let nextPossibleZ = new Set();
  for (let p = 0; p <= 13; p++) {
    for (let inp = mins[p]; inp <= max[p]; inp++) {
      for (let z of possibleZ) {
        const res = run(programs[p], inp, z);
        nextPossibleZ.add(res);
      }
    }
    possibleZ = nextPossibleZ;
    nextPossibleZ = new Set();
  }

  return possibleZ.has(0n);
}

function find(mins, max) {

  const isPoss = isPossible(mins, max);

  if (equal(mins, max)) {
    return isPoss;
  } else {
    // find least position and change
    const diffPos = firstDiff(mins, max);
    if (isPoss) {
      mins[diffPos]++;
      if (mins[diffPos] == 9) {
        console.log('found next digit', mins[diffPos]);

      }
    } else {
      mins[diffPos]--;
      max[diffPos] = mins[diffPos];
      console.log('found next digit', mins[diffPos]);
    }

    find(mins, max);
  }
}

function firstDiff(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] != arr2[i]) {
      return i;
    }
  }
  return -1;
}

function run(commands, inp, z) {
  const mem = { z };

  function getMem(mem, x) {
    if (mem[x] === undefined) return 0n;
    return BigInt(mem[x]);
  }

  function getNumVal(c) {
    if (isNumber(c)) {
      return BigInt(Number(c));
    }
    return getMem(mem, c);
  }

  commands.forEach(cmd => {
    switch (cmd[0]) {
      case 'inp':
        mem[cmd[1]] = inp;
        break;
      case 'add':
        mem[cmd[1]] = getNumVal(cmd[1]) + getNumVal(cmd[2]);
        break;
      case 'mul':
        mem[cmd[1]] = getNumVal(cmd[1]) * getNumVal(cmd[2]);
        break;
      case 'div':
        mem[cmd[1]] = getNumVal(cmd[1]) / getNumVal(cmd[2]);
        break;
      case 'mod':
        mem[cmd[1]] = getNumVal(cmd[1]) % getNumVal(cmd[2]);
        break;
      case 'eql':
        mem[cmd[1]] = getNumVal(cmd[1]) == getNumVal(cmd[2]) ? 1n : 0n;
        break;
    }
  });

  return mem['z'];

}

function isNumber(str) {
  return [...str].every(c => {
    return c >= '0' && c <= '9' || c == '-';
  });
}

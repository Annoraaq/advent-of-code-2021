const utils = require('../utils');

const numberMapping = createNumberMapping();
const inputs = [];
const outputs = [];
const translations = [];

utils.getInput().forEach(s => {
  const [input, output] = s.split('|');
  inputs.push(input.split(' ').filter(s => s !== ''));
  outputs.push(output.split(' ').filter(s => s !== ''));
});

for (let input of inputs) {
  const [one, four, seven, charCount] = createCharCount(input);

  const translation = new Map();
  charCount.forEach((value, key) => {
    translation.set(key, identifyChar(value, key, one, four, seven));
  })

  translations.push(translation);
}

let sum = 0;
for (let i = 0; i < outputs.length; i++) {
  let out = '';
  const translation = translations[i];
  for (let output of outputs[i]) {
    const arr = [...output].map(c => translation.get(c));
    arr.sort();
    out += numberMapping.get(arr.join(''));
  }
  sum += Number(out);
}

console.log(sum);

// -------------------- helpers --------------------------

function createCharCount(input) {
  let ret = [, ,];
  const charCount = new Map('abcdefg'.split('').map(c => [c, 0]));
  for (let digit of input) {
    switch (digit.length) {
      case 2:
        ret[0] = digit;
        break;
      case 3:
        ret[2] = digit;
        break;
      case 4:
        ret[1] = digit;
        break
    }
    for (let c of [...digit]) {
      charCount.set(c, charCount.get(c) + 1);
    }
  }

  return [...ret, charCount];

}

function identifyChar(count, encrypted, one, four, seven) {
  switch (count) {
    case 6:
      return 'b';
    case 4:
      return 'e';
    case 9:
      return 'f';
    case 8:
      return (seven.indexOf(encrypted) !== -1 && four.indexOf(encrypted) === -1) ? 'a' : 'c';
    case 7:
      return (one.indexOf(encrypted) === -1 && seven.indexOf(encrypted) === -1 && four.indexOf(encrypted) === -1) ? 'g' : 'd';
  }
}

function createNumberMapping() {
  const mapping = new Map();
  mapping.set('abcefg', 0);
  mapping.set('cf', 1);
  mapping.set('acdeg', 2);
  mapping.set('acdfg', 3);
  mapping.set('bcdf', 4);
  mapping.set('abdfg', 5);
  mapping.set('abdefg', 6);
  mapping.set('acf', 7);
  mapping.set('abcdefg', 8);
  mapping.set('abcdfg', 9);
  return mapping;
}

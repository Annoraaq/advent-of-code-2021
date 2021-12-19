const utils = require('../utils');
const input = utils.getInput()[0];

const binStr = [...input].map(hex2bin).join('');

const [, val] = parsePacket(binStr, 0);
console.log(val);


// -------------------- helpers --------------------------
function hex2bin(hex) {
  return (parseInt(hex, 16).toString(2)).padStart(4, '0');
}

function parsePacket(str, start) {
  const packetType = parseInt(str.substr(start + 3, 3), 2);

  if (packetType === 4) {
    let keepReading = true;
    let pos = 0;
    let bits = '';
    while (keepReading) {
      const nextBit = str.substr(start + 6 + pos, 5);
      if (nextBit[0] === '0') {
        keepReading = false;
      }
      bits += nextBit.substr(1);
      pos += 5;
    }
    return [start + 6 + pos, parseInt(bits, 2)];
  } else {
    const lengthId = str.substr(start + 6, 1);
    if (lengthId === '0') {
      const bitLen = parseInt(str.substr(start + 7, 15), 2);
      let pos = start + 7 + 15;
      let vals = [];
      while (pos - (start + 7 + 15) < bitLen) {
        const parsed = parsePacket(str, pos);
        pos = parsed[0];
        vals.push(parsed[1]);
      }
      return [pos, reduce(vals, packetType)];
    } else {
      const numOfSubPackets = parseInt(str.substr(start + 7, 11), 2);
      let pos = start + 7 + 11;
      let packets = 0;
      let vals = [];
      while (packets < numOfSubPackets) {
        const parsed = parsePacket(str, pos);
        pos = parsed[0];
        vals.push(parsed[1]);
        packets++;
      }
      return [pos, reduce(vals, packetType)];
    }
  }
}

function reduce(vals, typeId) {
  switch (typeId) {
    case 0:
      return vals.reduce((prev, curr) => prev + curr);
    case 1:
      return vals.reduce((prev, curr) => prev * curr);
    case 2:
      return Math.min(...vals);
    case 3:
      return Math.max(...vals);
    case 5:
      return vals[0] > vals[1] ? 1 : 0;
    case 6:
      return vals[0] < vals[1] ? 1 : 0;
    case 7:
      return vals[0] === vals[1] ? 1 : 0;
  }
}



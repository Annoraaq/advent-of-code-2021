const utils = require('../utils');

const input = utils.getInput()[0];

const binStr = [...input].map(hex2bin).join('');
console.log(binStr)

let sum = 0;
parsePacket(binStr, 0);
console.log(sum);


// -------------------- helpers --------------------------
function hex2bin(hex) {
  return (parseInt(hex, 16).toString(2)).padStart(4, '0');
}

function versionNo(str, start) {
  return parseInt(str.substr(start, 3), 2);
}

function packetTypeId(str, start) {
  return parseInt(str.substr(start + 3, 3), 2);
}

function parsePacket(str, start) {
  console.log('version no: ' + versionNo(str, start));
  sum += versionNo(str, start);
  console.log('packetType: ' + packetTypeId(str, start));

  // if literal type
  if (packetTypeId(str, start) === 4) {
    let keepReading = true;
    let pos = 0;
    while (keepReading) {
      const nextBit = str.substr(start + 6 + pos, 5);
      if (nextBit[0] === '0') {
        keepReading = false;
      }
      pos += 5;
    }
    return start + 6 + pos;
  } else {
    const lengthId = str.substr(start + 6, 1);
    if (lengthId === '0') {
      const bitLen = parseInt(str.substr(start + 7, 15), 2);
      let pos = start + 7 + 15;
      while (pos - (start + 7 + 15) < bitLen) {
        pos = parsePacket(str, pos);
      }
      return pos;
    } else {
      const numOfSubPackets = parseInt(str.substr(start + 7, 11), 2);

      let pos = start + 7 + 11;
      let packets = 0;
      while (packets < numOfSubPackets) {
        pos = parsePacket(str, pos);
        packets++;
      }
      return pos;
    }
  }
}



const utils = require('../utils');
var assert = require('assert');

const inputLines = utils.getInput();
const commands = inputLines.map(inputLine => {
  const [onOff, rest] = inputLine.split(' ');
  return [onOff == 'on' ? true : false, rest.split(',').map(raw => raw.substr(2).split('..').map(Number))];
});

function run(commands) {
  let posCubes = [];
  for (let cmd of commands) {
    let [onOff, limits] = cmd;
    limits = limits.map(([from, till]) => [from, till + 1]);

    const cube = { x1: limits[0][0], x2: limits[0][1], y1: limits[1][0], y2: limits[1][1], z1: limits[2][0], z2: limits[2][1] };

    if (!onOff) {
      const overlapping = posCubes.filter((c) => overlap(c, cube));
      const nonOverlapping = posCubes.filter((c) => !overlap(c, cube));
      let pq = [...nonOverlapping];
      for (let ol of overlapping) {
        pq.push(...subtract(ol, cube));
      }
      posCubes = pq;
    } else {
      const overlapping = posCubes.filter((c) => overlap(c, cube));
      for (let ol of overlapping) {
        posCubes = [...posCubes.filter(c => c !== ol), ...subtract(ol, cube)];
      }
      posCubes.push(cube);
    }
  }

  let count = 0;
  let m = 0;
  for (let cube of posCubes) {
    const volume = Math.abs(cube.x2 - cube.x1) * Math.abs(cube.y2 - cube.y1) * Math.abs(cube.z2 - cube.z1);
    m = Math.max(m, volume);
    count += volume;
  }

  return count;
}

// -------------------- helpers --------------------------

function overlap(c1, c2) {
  const res = (c1.x2 > c2.x1)
    && (c1.x1 < c2.x2)
    && (c1.y2 > c2.y1)
    && (c1.y1 < c2.y2)
    && (c1.z2 > c2.z1)
    && (c1.z1 < c2.z2);
  return res;
}

function cloneCube(c) {
  return { x1: c.x1, x2: c.x2, y1: c.y1, y2: c.y2, z1: c.z1, z2: c.z2 };
}

function cutOutreachingC2(c1, c2) {
  if (c2.x1 < c1.x1) {
    c2.x1 = c1.x1;
  }
  if (c2.x2 > c1.x2) {
    c2.x2 = c1.x2;
  }
  if (c2.y1 < c1.y1) {
    c2.y1 = c1.y1;
  }
  if (c2.y2 > c1.y2) {
    c2.y2 = c1.y2;
  }
  if (c2.z1 < c1.z1) {
    c2.z1 = c1.z1;
  }
  if (c2.z2 > c1.z2) {
    c2.z2 = c1.z2;
  }
}

function subtract(c1, c2) {
  c2 = cloneCube(c2);
  const cubes = [];
  cutOutreachingC2(c1, c2);

  cubes.push({
    x1: c1.x1,
    x2: c2.x1,
    y1: c1.y1,
    y2: c2.y1,
    z1: c1.z1,
    z2: c2.z1
  });

  cubes.push({
    x1: c2.x1,
    x2: c2.x2,
    y1: c1.y1,
    y2: c2.y1,
    z1: c1.z1,
    z2: c2.z1
  });

  cubes.push({
    x1: c2.x2,
    x2: c1.x2,
    y1: c1.y1,
    y2: c2.y1,
    z1: c1.z1,
    z2: c2.z1
  });

  cubes.push({
    x1: c1.x1,
    x2: c2.x1,
    y1: c2.y1,
    y2: c2.y2,
    z1: c1.z1,
    z2: c2.z1
  });

  cubes.push({
    x1: c2.x1,
    x2: c2.x2,
    y1: c2.y1,
    y2: c2.y2,
    z1: c1.z1,
    z2: c2.z1
  });

  cubes.push({
    x1: c2.x2,
    x2: c1.x2,
    y1: c2.y1,
    y2: c2.y2,
    z1: c1.z1,
    z2: c2.z1
  });

  cubes.push({
    x1: c1.x1,
    x2: c2.x1,
    y1: c2.y2,
    y2: c1.y2,
    z1: c1.z1,
    z2: c2.z1
  });

  cubes.push({
    x1: c2.x1,
    x2: c2.x2,
    y1: c2.y2,
    y2: c1.y2,
    z1: c1.z1,
    z2: c2.z1
  });

  cubes.push({
    x1: c2.x2,
    x2: c1.x2,
    y1: c2.y2,
    y2: c1.y2,
    z1: c1.z1,
    z2: c2.z1
  });

  cubes.push({
    x1: c1.x1,
    x2: c2.x1,
    y1: c1.y1,
    y2: c2.y1,
    z1: c2.z2,
    z2: c1.z2
  });

  cubes.push({
    x1: c2.x1,
    x2: c2.x2,
    y1: c1.y1,
    y2: c2.y1,
    z1: c2.z2,
    z2: c1.z2
  });

  cubes.push({
    x1: c2.x2,
    x2: c1.x2,
    y1: c1.y1,
    y2: c2.y1,
    z1: c2.z2,
    z2: c1.z2
  });

  cubes.push({
    x1: c1.x1,
    x2: c2.x1,
    y1: c2.y1,
    y2: c2.y2,
    z1: c2.z2,
    z2: c1.z2
  });

  cubes.push({
    x1: c2.x1,
    x2: c2.x2,
    y1: c2.y1,
    y2: c2.y2,
    z1: c2.z2,
    z2: c1.z2
  });

  cubes.push({
    x1: c2.x2,
    x2: c1.x2,
    y1: c2.y1,
    y2: c2.y2,
    z1: c2.z2,
    z2: c1.z2
  });

  cubes.push({
    x1: c1.x1,
    x2: c2.x1,
    y1: c2.y2,
    y2: c1.y2,
    z1: c2.z2,
    z2: c1.z2
  });

  cubes.push({
    x1: c2.x1,
    x2: c2.x2,
    y1: c2.y2,
    y2: c1.y2,
    z1: c2.z2,
    z2: c1.z2
  });

  cubes.push({
    x1: c2.x2,
    x2: c1.x2,
    y1: c2.y2,
    y2: c1.y2,
    z1: c2.z2,
    z2: c1.z2
  });

  cubes.push({
    x1: c1.x1,
    x2: c2.x1,
    y1: c1.y1,
    y2: c2.y1,
    z1: c2.z1,
    z2: c2.z2
  });

  cubes.push({
    x1: c2.x1,
    x2: c2.x2,
    y1: c1.y1,
    y2: c2.y1,
    z1: c2.z1,
    z2: c2.z2
  });

  cubes.push({
    x1: c2.x2,
    x2: c1.x2,
    y1: c1.y1,
    y2: c2.y1,
    z1: c2.z1,
    z2: c2.z2
  });

  cubes.push({
    x1: c1.x1,
    x2: c2.x1,
    y1: c2.y2,
    y2: c1.y2,
    z1: c2.z1,
    z2: c2.z2
  });

  cubes.push({
    x1: c2.x1,
    x2: c2.x2,
    y1: c2.y2,
    y2: c1.y2,
    z1: c2.z1,
    z2: c2.z2
  });

  cubes.push({
    x1: c2.x2,
    x2: c1.x2,
    y1: c2.y2,
    y2: c1.y2,
    z1: c2.z1,
    z2: c2.z2
  });

  cubes.push({
    x1: c1.x1,
    x2: c2.x1,
    y1: c2.y1,
    y2: c2.y2,
    z1: c2.z1,
    z2: c2.z2
  });

  cubes.push({
    x1: c2.x2,
    x2: c1.x2,
    y1: c2.y1,
    y2: c2.y2,
    z1: c2.z1,
    z2: c2.z2
  });

  return cubes.filter(c => {
    return !(c.x1 == c.x2 || c.y1 == c.y2 || c.z1 == c.z2);
  });
}

console.log(run(commands));

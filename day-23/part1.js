var PriorityQueue = require('priorityqueuejs');
const utils = require('../utils');
const grid = utils.getCharGridInput();

const cost = new Map();
cost.set('A', 1);
cost.set('B', 10);
cost.set('C', 100);
cost.set('D', 1000);

const possiblePositions = [];
const amphipods = new Map();
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (isInBounds(x, y)) {
      possiblePositions.push({ x, y });
    }
    const c = grid[y][x];
    if (![' ', '.', '#'].includes(c)) {
      const am = createAmphipod(grid[y][x], x, y);
      if (isHallway(x, y)) {
        am.stoppedInHallway = true;
      }
      amphipods.set(posStr(x, y), am);
    }
  }
}

[...amphipods.values()].forEach(amp => {
  if (whichRoom(amp.x, amp.y) === amp.type && isRoomClean(amphipods, amp.type)) {
    amp.arrived = true;
  }
});

const memo = new Map();

console.log(solution(amphipods));

// -------------------- helpers --------------------------

function solution(amphipods) {
  const queue = new PriorityQueue((a, b) => b[1] - a[1]);
  queue.enq([cloneAmphipods(amphipods), 0]);

  while (queue.size() > 0) {
    const [amphipods, currentCost] = queue.deq();
    if (success(amphipods)) {
      return currentCost;
    }
    const tbe = [];
    [...amphipods.values()].flatMap(amp => {
      return possibleTargetPositions(amphipods, amp.x, amp.y).map(([x, y]) => {
        const cloned = cloneAmphipods(amphipods);
        const clonedAmp = cloned.get(posStr(amp.x, amp.y));
        cloned.set(posStr(x, y), cloned.get(posStr(amp.x, amp.y)));
        cloned.delete(posStr(amp.x, amp.y));
        clonedAmp.x = x;
        clonedAmp.y = y;
        if (whichRoom(x, y) === clonedAmp.type && isRoomClean(cloned, clonedAmp.type)) {
          clonedAmp.arrived = true;
        }
        if (isHallway(x, y)) {
          clonedAmp.stoppedInHallway = true;
        }
        const toBeEnq = [cloned, currentCost + manhattanDist(amp.x, amp.y, x, y) * cost.get(clonedAmp.type)];
        tbe.push(toBeEnq);
      });
    });

    tbe.forEach(toBeEnq => {
      const s = getState(toBeEnq[0]);
      if (!memo.has(s) || memo.get(s) > toBeEnq[1]) {
        memo.set(s, toBeEnq[1]);
        queue.enq(toBeEnq);
      }
    });
  }
}

function manhattanDist(x, y, x2, y2) {
  return Math.abs(x - x2) + Math.abs(y - y2);
}

function stateEquals(state1, state2) {
  if (state1.length >= state2.length) return false;
  return state1.every(a => state2.includes(a));
}

function getState(amphipods) {
  const res = [...amphipods.values()].flatMap(amp => amp);
  res.sort((a, b) => {
    if (a.type < b.type) return -1;
    if (a.type > b.type) return 1;
    if (a.x < b.x) return -1;
    if (a.x > b.x) return 1;
    if (a.y < b.y) return -1;
    return 1;
  });
  return res.map(r => ampToStr(r)).join('\n');
}

function ampToStr(amp) {
  return JSON.stringify(amp);
}

function possibleTargetPositions(amphipods, x, y) {
  if (!amphipods.has(posStr(x, y))) return [];
  const amphipod = amphipods.get(posStr(x, y));
  // don't move arrived pods
  if (amphipod.arrived) return [];
  if (whichRoom(amphipod.x, amphipod.y) === amphipod.type && isRoomClean(amphipods, amphipod.type)) return [];

  // if stopped in hallway they can only move into their clean destination room
  if (amphipod.stoppedInHallway) {
    return reachablePositions(amphipods, x, y).filter(pos => {
      return whichRoom(pos[0], pos[1]) == amphipod.type && isRoomClean(amphipods, amphipod.type)
    });
  }
  return reachablePositions(amphipods, x, y).filter(([x, y]) => !isHallwayBlocking(x, y) && (isHallway(x, y)));
}

function isRoomClean(amphipods, type) {
  const roomXs = [3, 5, 7, 9];
  function hasCleanAmp(posStr) {
    if (!amphipods.has(posStr)) return true;
    return amphipods.get(posStr).type === type;
  }
  switch (type) {
    case "A":
      return hasCleanAmp(posStr(3, 2)) && hasCleanAmp(posStr(3, 3));
      break;
    case "B":
      return hasCleanAmp(posStr(5, 2)) && hasCleanAmp(posStr(5, 3));
      break;
    case "C":
      return hasCleanAmp(posStr(7, 2)) && hasCleanAmp(posStr(7, 3));
      break;
    case "D":
      return hasCleanAmp(posStr(9, 2)) && hasCleanAmp(posStr(9, 3));
      break;
  }
}

function reachablePositions(amphipods, x, y) {
  const visited = new Set();
  const reachable = [];
  function dfs(x, y) {
    visited.add(posStr(x, y));
    const neighbours = [];

    const top = isPosFree(amphipods, x, y - 1);
    const left = isPosFree(amphipods, x - 1, y);
    const right = isPosFree(amphipods, x + 1, y);
    const down = isPosFree(amphipods, x, y + 1);

    if (top && !visited.has(posStr(x, y - 1))) {
      reachable.push([x, y - 1]);
      dfs(x, y - 1);
    }
    if (left && !visited.has(posStr(x - 1, y))) {
      reachable.push([x - 1, y]);
      dfs(x - 1, y);
    }
    if (right && !visited.has(posStr(x + 1, y))) {
      reachable.push([x + 1, y]);
      dfs(x + 1, y);
    }
    if (down && !visited.has(posStr(x, y + 1))) {
      reachable.push([x, y + 1]);
      dfs(x, y + 1);
    }
  }
  dfs(x, y);
  return reachable;

}

function isPosFree(amphipods, x, y) {
  return isInBounds(x, y) && !amphipods.has(posStr(x, y));
}

function posStr(x, y) {
  return `${x}#${y}`;
}

function success(amphipods) {
  return [...amphipods.values()].every(a => whichRoom(a.x, a.y) == a.type);
}

function cloneAmphipods(amphipods) {
  const newMap = new Map();
  amphipods.forEach((value, key) => {
    newMap.set(key, { ...value });
  }
  );
  return newMap;
}

function createAmphipod(type, x, y) {
  return {
    type,
    x,
    y,
    stoppedInHallway: false,
    arrived: false
  }
}

function isInBounds(x, y) {
  return Boolean(isHallway(x, y) || whichRoom(x, y));
}

function isHallway(x, y) {
  return y == 1 && x >= 1 && x <= 11;
}

function isHallwayBlocking(x, y) {
  return isHallway(x, y) && x >= 3 && x <= 9 && (x % 2 != 0);
}

function whichRoom(x, y) {
  const roomXs = [3, 5, 7, 9];
  const isRoom = roomXs.includes(x) && y >= 2 && y <= 3;

  if (!isRoom) return undefined;
  if (x == 3) return 'A';
  if (x == 5) return 'B';
  if (x == 7) return 'C';
  if (x == 9) return 'D';
}

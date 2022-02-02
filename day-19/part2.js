const utils = require('../utils');
const Queue = require('../Queue');

const scanners = utils.getRawInput()
  .split("\n\n")
  .map(entry => entry.split('\n'))
  .map(([first, ...rest]) => rest.filter(r => r !== ''))
  .map(triple => triple.map(t => t.split(',').map(Number)));

const signs = [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]];
const permuts = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
const inversePerms = createInversePerms(permuts);
const scannerPerms = scanners.map(() => permuts.flatMap(p => signs.map(s => [p, s])));
const adjList = createAdjList(scanners);

let max = 0;
for (let scannerIndex1 = 0; scannerIndex1 < scanners.length - 1; scannerIndex1++) {
  for (let scannerIndex2 = scannerIndex1 + 1; scannerIndex2 < scanners.length; scannerIndex2++) {
    const dist = bfs(scannerIndex1, scannerIndex2, [0, 0, 0]);
    const distSum = Math.abs(dist[0]) + Math.abs(dist[1]) + Math.abs(dist[2]);
    max = Math.max(max, distSum);
  }
}
console.log(max);

// -------------------- helpers --------------------------

function createInversePerms(permuts) {
  const inversePerms = new Map();
  for (let p of permuts) {
    for (let p2 of permuts) {
      if (pEq(pOp(p, p2), [0, 1, 2])) {
        inversePerms.set(JSON.stringify(p), p2);
        break;
      }
    }
  }
  return inversePerms;
}

function createAdjList(scanners) {
  const adjList = new Map();
  const scannerPerms = scanners.map(() => permuts.flatMap(p => signs.map(s => [p, s])));

  for (let scannerIndex1 = 0; scannerIndex1 < scanners.length - 1; scannerIndex1++) {
    for (let scannerIndex2 = scannerIndex1 + 1; scannerIndex2 < scanners.length; scannerIndex2++) {
      for (const [p2, s2] of scannerPerms[scannerIndex2]) {

        let seen = new Map();

        for (let c1 of scanners[scannerIndex1]) {
          for (let c2 of scanners[scannerIndex2]) {
            const res = JSON.stringify([0, 1, 2].map(index => c1[index] - s2[p2[index]] * c2[p2[index]]));
            const pair = JSON.stringify([c1, c2]);

            if (seen.has(res)) {
              seen.get(res).add(pair);
            } else {
              seen.set(res, new Set([pair]));
            }
          }
        }

        let resTriple = undefined;

        for (const [key, value] of seen) {
          if (value.size >= 12) {
            resTriple = JSON.parse(key);
          }
        }
        if (resTriple) {
          const key = `${scannerIndex1}#${scannerIndex2}`;
          if (!adjList.has(scannerIndex2)) {
            adjList.set(scannerIndex2, new Map());
          }
          adjList.get(scannerIndex2).set(scannerIndex1, JSON.stringify([p2, s2, resTriple, false]));

          if (!adjList.has(scannerIndex1)) {
            adjList.set(scannerIndex1, new Map());
          }
          adjList.get(scannerIndex1).set(scannerIndex2, JSON.stringify([p2, s2, resTriple, true]));
        }

      }

    }
  }
  return adjList;

}

function bfs(startNode, stopNode, pos) {

  const queue = Queue([[startNode, pos, [startNode]]]);
  const visited = new Set([startNode]);

  while (queue.size() > 0) {
    let [currNode, currPos, path] = queue.dequeue();
    const neighbours = adjList.get(currNode);

    for (const [neighbourId, strVal] of neighbours) {
      const [nP, nS, nO, isReverse] = JSON.parse(strVal);
      if (!visited.has(neighbourId)) {
        let newCurrPos = [...currPos];
        visited.add(neighbourId);
        if (isReverse) {
          const revPerm = revP(nP);
          newCurrPos = sOp(pOp(sub(newCurrPos, nO), revPerm), nS);
        } else {
          newCurrPos = add(pOp(sOp(newCurrPos, nS), nP), nO);
        }
        if (neighbourId === stopNode) {
          return newCurrPos;
        } else {
          queue.enqueue([neighbourId, newCurrPos, [...path, neighbourId]]);
        }
      }
    }
  }
}

function revP(p) {
  return inversePerms.get(JSON.stringify(p));
}

function pOp(target, p) {
  return [target[p[0]], target[p[1]], target[p[2]]];

}

function sOp(target, s) {
  return [target[0] * s[0], target[1] * s[1], target[2] * s[2]];
}

function add(t1, t2) {
  return [t1[0] + t2[0], t1[1] + t2[1], t1[2] + t2[2]];
}

function sub(t1, t2) {
  return [t1[0] - t2[0], t1[1] - t2[1], t1[2] - t2[2]];
}

function pEq(p1, p2) {
  return (p1[0] === p2[0] && p1[1] === p2[1] && p1[2] === p2[2]);
}

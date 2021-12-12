const utils = require('../utils');

const lines = utils.getInput();

const adjList = new Map();
const visited = new Set();
let pathCounter = 0;

lines.map(l => l.split('-')).forEach(([lhs, rhs]) => {
  add(lhs, rhs);
  add(rhs, lhs);
});

dfs('start', 'end', new Set());

console.log(pathCounter);

// -------------------- helpers --------------------------

function isBigCave(cave) {
  return cave[0] === cave[0].toUpperCase();
}

function add(from, to) {
  if (!adjList.has(from)) {
    adjList.set(from, new Set());
  }
  adjList.get(from).add(to);
}

function dfs(startNode, endNode, visited) {
  if (!isBigCave(startNode)) visited.add(startNode);

  if (startNode === endNode) {
    pathCounter++;
    return;
  }

  for (let neighbour of adjList.get(startNode)) {
    if (!visited.has(neighbour)) {
      dfs(neighbour, endNode, new Set([...visited]));
    }
  }
}

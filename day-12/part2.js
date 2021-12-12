const { start } = require('repl');
const utils = require('../utils');

const lines = utils.getInput();

const adjList = new Map();
const visited = new Set();
const paths = new Set();

lines.map(l => l.split('-')).forEach(([lhs, rhs]) => {
  add(lhs, rhs);
  add(rhs, lhs);
});

dfs('start', 'end', new Set(), false, '');

console.log(paths.size);

// -------------------- helpers --------------------------

function add(from, to) {
  if (!adjList.has(from)) {
    adjList.set(from, new Set());
  }
  adjList.get(from).add(to);
}

function isBigCave(cave) {
  return cave[0] === cave[0].toUpperCase();
}

function dfs(startNode, endNode, visited, hasChosenSmallTwice, path) {
  if (visited.has(startNode)) return;
  if (startNode === endNode) {
    paths.add(path);
    return;
  }
  const newPath = path + '-' + startNode;
  for (let neighbour of adjList.get(startNode)) {
    if (isBigCave(startNode)) {
      dfs(neighbour, endNode, new Set([...visited]), hasChosenSmallTwice, newPath);
    } else {
      dfs(neighbour, endNode, new Set([...visited, startNode]), hasChosenSmallTwice, newPath);
      if (!hasChosenSmallTwice && startNode !== 'start' && startNode !== 'end') {
        dfs(neighbour, endNode, new Set([...visited]), true, newPath);
      }
    }
  }
}

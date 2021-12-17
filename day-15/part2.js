
const utils = require('../utils');

const smallMap = utils.getIntGridInput();

const height = smallMap.length * 5;
const width = smallMap[0].length * 5;

const largeMap = new Array(height);
const risk = new Array(height);
for (let y = 0; y < height; y++) {
  risk[y] = new Array(width);
  largeMap[y] = new Array(width);
}


for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const addY = Math.floor(y / smallMap.length);
    const addX = Math.floor(x / smallMap[0].length);
    let newVal = smallMap[y % smallMap.length][x % smallMap[0].length] + addX + addY;
    if (newVal > 9) {
      newVal = (newVal % 10) + 1;
    }
    largeMap[y][x] = newVal;
  }
}

console.log(dijkstra({ x: 0, y: 0 }, { x: width - 1, y: height - 1 }).distance);

// -------------------- helpers --------------------------
function safeRisk(y, x) {
  if (y >= height || x >= width) return Number.MAX_VALUE;
  return risk[y][x];
}

function map(y, x) {
  return largeMap[y][x];
}

function dijkstra(startNode, stopNode) {
  const distances = new Map();
  const previous = new Map();
  const remaining = new utils.MinHeap(n => distances.get(n));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      distances.set(nodeToStr({ x, y }), Number.MAX_VALUE);
    }
  }
  distances.set(nodeToStr(startNode), 0);
  remaining.insert(nodeToStr(startNode));

  while (!remaining.isEmpty()) {
    const n = strToNode(remaining.extractMin());
    for (let neighbour of getNeighbours(n)) {
      const newPathLength = distances.get(nodeToStr(n)) + largeMap[neighbour.y][neighbour.x];
      const oldPathLength = distances.get(nodeToStr(neighbour));
      if (newPathLength < oldPathLength) {
        distances.set(nodeToStr(neighbour), newPathLength);
        previous.set(nodeToStr(neighbour), nodeToStr(n));
        remaining.insert(nodeToStr(neighbour));
      }
    }
  }

  return { distance: distances.get(nodeToStr(stopNode)), path: previous };
}

function getNeighbours({ x, y }) {
  const n = [];
  if (y > 0) n.push({ x, y: y - 1 });
  if (y < height - 1) n.push({ x, y: y + 1 });
  if (x > 0) n.push({ x: x - 1, y });
  if (x < width - 1) n.push({ x: x + 1, y });
  return n;
}

function nodeToStr(node) {
  return `${node.y}#${node.x}`;
}

function strToNode(str) {
  const [y, x] = str.split('#').map(Number);
  return { x, y };
}


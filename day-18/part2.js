const utils = require('../utils');

const lines = utils.getInput().map(JSON.parse);
let hasChanged = false;

let max = 0;
for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines.length; j++) {
    if (i !== j) {
      const newParent = {
        lhs: toTree(undefined, lines[i]),
        rhs: toTree(undefined, lines[j]),
        val: undefined,
        parent: undefined
      };
      newParent.lhs.parent = newParent;
      newParent.rhs.parent = newParent;
      const mag = magnitude(red(newParent));
      max = Math.max(max, mag);
    }
  }
}

console.log(max);

function red(tree) {
  do {
    hasChanged = false;
    processExplode(tree, 0);
    processSplit(tree);
  } while (hasChanged);

  return tree;
}

function toTree(parent, arr) {
  const [lhs, rhs] = arr;
  const node = createLeaf(undefined, parent);
  if (Array.isArray(lhs)) {
    node.lhs = toTree(node, lhs);
  } else {
    node.lhs = createLeaf(lhs, node);
  }

  if (Array.isArray(rhs)) {
    node.rhs = toTree(node, rhs);
  } else {
    node.rhs = createLeaf(rhs, node);
  }
  return node;
}

function print(node) {
  if (isLeaf(node)) {
    return node.val;
  }
  return '[' + print(node.lhs) + ',' + print(node.rhs) + ']';
}

function processExplode(node, depth) {
  if (hasChanged) return;
  if (isLeaf(node)) return;
  if (depth >= 4 && isLeaf(node.lhs) && isLeaf(node.rhs)) {
    const left = findLeft(node.lhs);
    if (left) {
      left.val += node.lhs.val;
    }
    const right = findRight(node.rhs);
    if (right) {
      right.val += node.rhs.val;
    }
    node.lhs = undefined;
    node.rhs = undefined;
    node.val = 0;
    hasChanged = true;
  } else {
    processExplode(node.lhs, depth + 1);
    processExplode(node.rhs, depth + 1);
  }
}

function processSplit(node) {
  if (hasChanged) return;
  if (!node) return;
  if (isLeaf(node) && node.val >= 10) {
    node.lhs = createLeaf(Math.floor(node.val / 2), node);
    node.rhs = createLeaf(Math.ceil(node.val / 2), node);
    node.val = undefined;
    hasChanged = true;
    return;
  }
  processSplit(node.lhs);
  processSplit(node.rhs);
}

function createLeaf(val, parent) {
  return {
    lhs: undefined,
    rhs: undefined,
    val,
    parent,
  };
}

function findLeft(node) {
  if (isLeaf(node) && node.parent) {
    if (node.parent.lhs === node) {
      return findRightLeftMost(node.parent);
    }
    if (node.parent.rhs === node) {
      return findRightMost(node.parent.lhs);
    }
  }

  if (!node.parent) return undefined;

  return findLeft(node.parent);
}

function findRight(node) {
  if (isLeaf(node) && node.parent) {
    if (node.parent.lhs === node) {
      return findLeftMost(node.parent);
    }
    if (node.parent.rhs === node) {
      return findLeftRightMost(node.parent);
    }
  }

  if (!node.parent) return undefined;

  return findRight(node.parent);
}

function findRightLeftMost(node) {
  if (!node.parent) return undefined;
  if (node.parent.rhs === node) {
    return findRightMost(node.parent.lhs);
  }
  return findRightLeftMost(node.parent);
}

function findLeftRightMost(node) {
  if (!node.parent) return undefined;
  if (node.parent.lhs === node) {
    return findLeftMost(node.parent.rhs);
  }
  return findLeftRightMost(node.parent);
}

function findLeftMost(node) {
  if (isLeaf(node)) return node;
  if (isLeaf(node.lhs)) return node.lhs;
  return findLeftMost(node.lhs);

}

function findRightMost(node) {
  if (isLeaf(node)) return node;
  if (isLeaf(node.rhs)) return node.rhs;
  return findRightMost(node.rhs);

}

function isLeaf(node) {
  return node.val !== undefined;
}

function magnitude(node) {
  if (node.val !== undefined) return node.val;
  return magnitude(node.lhs) * 3 + magnitude(node.rhs) * 2;
}

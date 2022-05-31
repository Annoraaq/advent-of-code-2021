const utils = require('../utils');
const grid = utils.getCharGridInput();

let cnt = 0;

let changed = false;
do {
  changed = simStep(grid);
  cnt++;
} while (changed);

console.log(cnt);

function simStep(grid) {
  let changed = false;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] == '>') {
        const nextPos = (c + 1) % grid[r].length;
        if (grid[r][nextPos] == '.') {
          grid[r][c] = 'p';
          grid[r][nextPos] = 'n';
          changed = true;
        }
      }
    }
  }

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] == 'p') {
        grid[r][c] = '.';
      } else if (grid[r][c] == 'n') {
        grid[r][c] = '>';
      }
    }
  }

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] == 'v') {
        const nextPos = (r + 1) % grid.length;
        if (grid[nextPos][c] == '.') {
          grid[r][c] = 'p';
          grid[nextPos][c] = 'n';
          changed = true;
        }
      }
    }
  }

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] == 'p') {
        grid[r][c] = '.';
      } else if (grid[r][c] == 'n') {
        grid[r][c] = 'v';
      }
    }
  }

  return changed;
}


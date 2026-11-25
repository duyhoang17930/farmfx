export const TILE = 16;
export const WIDTH = 24;
export const HEIGHT = 16;
export const START = [6, 8];
export const BRIDGE = [[13, 8], [14, 8]];
export const LAND_PRICE = 3;

// Inclusive columns of each land mass by row.
const cove = [null, null, [6, 8], [4, 10], [3, 11], [2, 11], [2, 12], [1, 12],
  [1, 12], [2, 12], [2, 11], [3, 10], [4, 10], [5, 8], null, null];
const bank = [null, null, null, [19, 20], [17, 21], [16, 22], [16, 22], [15, 22],
  [15, 22], [15, 21], [16, 21], [16, 20], [17, 20], [18, 19], null, null];

export const keyOf = (x, y) => y * WIDTH + x;
export const tileX = x => x * TILE + 8;
export const tileY = y => y * TILE + 12;
export const cellX = x => Math.floor(x / TILE);
export const cellY = y => Math.floor(y / TILE);
export const within = (x, y) => x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT;

export function land(x, y) {
  if (cove[y] && x >= cove[y][0] && x <= cove[y][1]) return 1;
  if (bank[y] && x >= bank[y][0] && x <= bank[y][1]) return 2;
  return 0;
}

export function coast(x, y) {
  const sides = [[0,-1,"N"],[1,0,"E"],[0,1,"S"],[-1,0,"W"]];
  const diagonals = ["NE", "SE", "SW", "NW"];
  const edges = sides.filter(([dx, dy]) => !land(x + dx, y + dy)).map(([, , edge]) => edge).join("");
  const corners = sides.flatMap(([dx, dy, a], i) => {
    const [nx, ny, b] = sides[(i + 1) % 4];
    return !edges.includes(a) && !edges.includes(b) && !land(x + dx + nx, y + dy + ny) ? [diagonals[i]] : [];
  });
  return { edges, corners };
}

export const NODE_POSITIONS = [
  ["pine", 5, 5], ["pine", 3, 7], ["pine", 3, 9], ["pine", 6, 11],
  ["pine", 9, 5], ["pine", 11, 7], ["pine", 8, 12],
  ["stone", 7, 6], ["stone", 5, 9], ["stone", 9, 10], ["stone", 4, 10],
  ["ore", 8, 4], ["ore", 10, 7], ["ore", 10, 11],
  ["pine", 17, 6], ["pine", 21, 7], ["pine", 19, 11], ["ore", 17, 9],
  ["flowers", 7, 5], ["flowers", 4, 8], ["flowers", 8, 9], ["flowers", 5, 12],
  ["flowers", 7, 3], ["flowers", 11, 9], ["flowers", 17, 7], ["flowers", 19, 10],
];

const directions = [[1,0],[-1,0],[0,1],[0,-1]];

export function findRoute(startX, startY, targetX, targetY, canWalk, reach) {
  if (!within(targetX, targetY)) return [];
  const startKey = keyOf(startX, startY);
  const queue = [[startX, startY]];
  const parents = new Map([[startKey, null]]);
  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i];
    const key = keyOf(x, y);
    if (Math.abs(x - targetX) + Math.abs(y - targetY) <= reach) {
      const route = [];
      for (let cursor = key; cursor !== startKey; cursor = parents.get(cursor)) {
        route.push([tileX(cursor % WIDTH), tileY(Math.floor(cursor / WIDTH))]);
      }
      return route.reverse();
    }
    for (const [dx, dy] of directions) {
      const nx = x + dx, ny = y + dy, next = keyOf(nx, ny);
      if (!parents.has(next) && canWalk(nx, ny)) {
        parents.set(next, key);
        queue.push([nx, ny]);
      }
    }
  }
  return [];
}

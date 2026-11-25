import { gardenSections } from "./garden.js";

export const TILE = 16;
export const WIDTH = 24;
export const HEIGHT = 91;
export const START = [6, 8];
export const BRIDGE = [[13, 8], [14, 8]];
export const GARDEN_WALK = [[7, 14], [7, 15]];
export const WAYPOINTS = { cove: START, garden: [7, 18],
  ...Object.fromEntries(gardenSections.map(({ id, waypoint }) => [id,waypoint])) };
export const LAND_PRICE = 3;

// Inclusive columns of each land mass by row.
const cove = [null, null, [6, 8], [4, 10], [3, 11], [2, 11], [2, 12], [1, 12],
  [1, 12], [2, 12], [2, 11], [3, 10], [4, 10], [5, 8], null, null];
const bank = [null, null, null, [19, 20], [17, 21], [16, 22], [16, 22], [15, 22],
  [15, 22], [15, 21], [16, 21], [16, 20], [17, 20], [18, 19], null, null];
const garden = [[5,9],[4,12],[3,15],[3,17],[2,18],[2,19],[3,19],[4,18],[5,16],[7,14],[9,12],
  [8,14],[5,17],[3,20],[2,21],[2,21],[2,21],[2,21],[2,21],[2,21],[3,21],[4,20],
  [3,20],[2,21],[2,21],[2,21],[2,21],[2,21],[2,21],[3,20],[3,19],[4,19],[4,20],
  [3,20],[3,20],[4,20],[4,20],[5,19],[5,18],[7,16],[8,14],[9,11],
  [8,12],[5,16],[3,20],[3,21],[3,21],[3,21],[2,21],[2,21],[2,21],[3,21],[3,20],
  [3,20],[4,19],[6,17],[8,13],[9,12],
  [8,13],[6,16],[4,19],[3,20],[3,21],[3,21],[3,21],[3,21],[3,21],[3,21],[3,21],
  [4,20],[5,19],[7,17],[9,14]];

export const keyOf = (x, y) => y * WIDTH + x;
export const tileX = x => x * TILE + 8;
export const tileY = y => y * TILE + 12;
export const cellX = x => Math.floor(x / TILE);
export const cellY = y => Math.floor(y / TILE);
export const within = (x, y) => x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT;

export function land(x, y) {
  if (cove[y] && x >= cove[y][0] && x <= cove[y][1]) return 1;
  if (bank[y] && x >= bank[y][0] && x <= bank[y][1]) return 2;
  const row = garden[y - 16];
  if (row && x >= row[0] && x <= row[1]) return 3;
  return 0;
}

export const canEnter = (island, unlocked) => island > 0 && (island !== 2 || unlocked);

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
  ["copper", 18, 5], ["gold", 20, 11],
  ["pine", 4, 18], ["pine", 10, 17], ["pine", 3, 21], ["pine", 5, 24],
  ["stone", 4, 19], ["stone", 5, 22], ["stone", 10, 24],
  ["ore", 11, 19], ["copper", 14, 19], ["gold", 16, 20],
  ["ore", 12, 23], ["copper", 15, 23], ["gold", 17, 22], ["copper", 14, 22], ["gold", 12, 25],
  ["flowers", 5, 17], ["flowers", 10, 18], ["flowers", 8, 20], ["flowers", 8, 23],
  ["flowers", 4, 22], ["flowers", 10, 25], ["flowers", 15, 24], ["flowers", 18, 21],
];

export const SCENERY = [
  ["trailSign",8,13], ["trailSign",6,17], ["bench",6,20], ["bench",12,22],
  ["mushrooms",3,20], ["mushrooms",6,23], ["redMushrooms",10,22], ["redMushrooms",9,25],
  ["turtle",6,24], ["butterfly",9,20], ["butterfly",16,22],
  ["crystals",18,4], ["crystals",21,8], ["crystals",16,10],
  ["crystals",16,24], ["showcaseBeacon",13,21],
  ["flowers",5,20,{ shape: 2, condition: "damaged" }], ["flowers",7,21,{ shape: 1, condition: "picked" }],
  ["mistFern",19,4,{growth:1}], ["mistFern",21,6,{growth:2}], ["mistFern",17,10,{growth:0}],
  ["mistFern",18,12,{growth:2}], ["mistFern",19,8,{growth:1}],
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

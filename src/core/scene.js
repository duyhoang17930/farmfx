// Preview backdrops: what the tools and the gallery draw behind an effect. Sprite sheets stay transparent.

import { hex, mix } from "./color.js";
import { rand } from "./math.js";

const SKY = hex("#15131d"), SKY_TOP = hex("#0d0b14"), SKY_LOW = hex("#221d33");
const FLOOR_EDGE = hex("#4a4263"), FLOOR = hex("#2b2639"), FLOOR_DARK = hex("#211d2d"), MORTAR = hex("#1a1724");
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export const BACKDROPS = ["field", "dark", "ground", "sky", "light", "black"];

const GRASS = ["#3d6b2a", "#4a7d30", "#558a36", "#2f5822", "#6a9e40", "#80b04a"].map(hex);

/**
 * The top-down field: grass seen from above, a faint 16 px tile grid lined up with the origin (ox, oy), so a thing's
 * footprint sits on a tile (tile edges 8 px either side of ox, the front edge 4 px below oy), and a few tufts.
 */
function field(out, w, h, ox, oy) {
  const gx0 = ox - 8, gy0 = oy + 4;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const tx = Math.floor((x - gx0) / 16), ty = Math.floor((y - gy0) / 16), lx = (((x - gx0) % 16) + 16) % 16, ly = (((y - gy0) % 16) + 16) % 16;
      // each tile a slightly different green, in patches; noise inside so it isn't flat
      const patch = rand(tx, ty, 41) < 0.3 ? 1 : rand(tx, ty, 42) < 0.15 ? 2 : 0, r = rand(x, y, 43);
      let c = GRASS[patch];
      if (r > 0.93) c = GRASS[3];
      else if (r < 0.05) c = GRASS[4];
      // the grid: the top and left edge of each tile, a hair darker
      if (lx === 0 || ly === 0) c = mix(c, GRASS[3], 0.45);
      out[y * w + x] = c;
    }
  // tufts: little two-blade Vs, lit on the left blade
  for (let ty = Math.floor(-gy0 / 16) - 1; ty <= Math.ceil((h - gy0) / 16); ty++)
    for (let tx = Math.floor(-gx0 / 16) - 1; tx <= Math.ceil((w - gx0) / 16); tx++)
      for (let k = 0; k < 2; k++) {
        if (rand(tx, ty, 50 + k) > 0.55) continue;
        const x = gx0 + tx * 16 + 2 + Math.floor(rand(tx, ty, 60 + k) * 12), y = gy0 + ty * 16 + 3 + Math.floor(rand(tx, ty, 70 + k) * 11);
        for (const [dx, dy, c] of [[0, 0, GRASS[3]], [-1, -1, GRASS[5]], [1, -1, GRASS[4]], [-1, -2, GRASS[5]], [2, -2, GRASS[4]]])
          if (x + dx >= 0 && x + dx < w && y + dy >= 0 && y + dy < h) out[(y + dy) * w + x + dx] = c;
      }
  return out;
}

/**
 * A backdrop as a Uint32Array of w x h colors. kind: "field" (top-down grass on a 16 px grid lined up with the origin
 * at (groundX, groundY)) | "dark" | "ground" (a stone floor from groundY down) | "sky" (night gradient with stars)
 * | "light" | "black".
 */
export function backdrop(kind, w, h, groundY = h, groundX = w / 2) {
  const out = new Uint32Array(w * h);
  if (kind === "field") return field(out, w, h, Math.round(groundX), Math.round(groundY));
  if (kind === "light") return out.fill(hex("#ebe8f0"));
  if (kind === "black") return out.fill(hex("#000000"));
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let c = SKY;
      if (kind === "sky") {
        const t = y / Math.max(1, h - 1), step = (t * 5 + BAYER[((y & 3) << 2) | (x & 3)] / 16) | 0;
        c = mix(SKY_TOP, SKY_LOW, Math.min(1, step / 4));
        const r = rand(x, y, 77);
        if (r > 0.994) c = mix(c, hex("#cfc8ff"), 0.35 + (r - 0.994) * 90);
      }
      if (kind === "ground" && y >= groundY) {
        const gy = y - groundY;
        if (gy === 0) c = FLOOR_EDGE;
        else {
          const row = Math.floor((gy - 1) / 5), off = row % 2 ? 6 : 0;
          const mortar = (gy - 1) % 5 === 4 || (x + off) % 12 === 0;
          c = mortar ? MORTAR : gy < 3 ? FLOOR : FLOOR_DARK;
        }
      }
      out[y * w + x] = c;
    }
  return out;
}

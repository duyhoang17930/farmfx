import { hex, red, green, blue } from "../../core/index.js";
import { drawPerson, spots, FACINGS } from "../_kit/person.js";
import { figurePalette } from "../_kit/figure-colors.js";
import { groundShadow } from "../_kit/sprite.js";
import { CAST } from "../_kit/cast.js";
import { characterArt } from "./_art.js";

const WALK_CYCLE = 0.8;
const WALK_FRAMES = 6;
const FRAME_X = -12;
const FRAME_Y = -25;
const BODY_TAG = 1;
const ARM_ROWS = [17, 20];
const framesByPose = new WeakMap();
const rigColors = new WeakMap();
const armKeys = new WeakMap();

/** The art's palette slot closest to each step of a look's ramp, so rig-drawn arms use the art's own colors. */
function nearestKeys(art, ramp) {
  const dist = (a, b) => (red(a) - red(b)) ** 2 + (green(a) - green(b)) ** 2 + (blue(a) - blue(b)) ** 2;
  return ramp.map((c) => {
    const target = hex(c);
    return Object.keys(art.palette).reduce((best, key) => (dist(hex(art.palette[key]), target) < dist(hex(art.palette[best]), target) ? key : best));
  });
}

/**
 * The art's colors as numbers for this season and these replacements, plus the arm colors picked from them. Cached
 * per art by the options that change them, so a fresh `colors` object each frame doesn't rebuild it.
 */
function workingColors(art, look, options) {
  if (!rigColors.has(art)) rigColors.set(art, new Map());
  const cache = rigColors.get(art), key = `${options.season ?? ""}|${options.colors ? JSON.stringify(options.colors) : ""}`;
  if (cache.has(key)) return cache.get(key);
  const colors = figurePalette(art.palette, options);
  const palette = Object.fromEntries(Object.entries(colors).map(([char, color]) => [char, hex(color)]));
  const L = CAST[look];
  if (!armKeys.has(art)) armKeys.set(art, L && { skin: nearestKeys(art, L.skin), top: nearestKeys(art, L.top), top2: nearestKeys(art, L.top2 ?? L.top) });
  const keys = armKeys.get(art);
  const arms = keys && { skin: keys.skin.map((k) => palette[k]), top: keys.top.map((k) => palette[k]), top2: keys.top2.map((k) => palette[k]) };
  const out = { palette, arms };
  cache.set(key, out);
  return out;
}

// Separate movement of the torso, outer arms and feet on the same pixel grid.
function walkFrames(rows, facing) {
  if (framesByPose.has(rows)) return framesByPose.get(rows);
  const side = facing === "left" || facing === "right";
  const result = Array.from({ length: WALK_FRAMES }, (_, phase) => {
    const contact = phase % 3 === 0;
    const passing = phase % 3 === 2;
    const swing = phase < 3 ? 1 : -1;
    const frame = rows.map((row) => Array(row.length).fill("."));
    rows.forEach((row, y) => {
      const first = row.search(/[^.]/);
      const last = row.search(/[^.]\.*$/);
      [...row].forEach((pixel, x) => {
        if (pixel === ".") return;
        const hand = y >= 17 && y <= 20 && (x < first + 2 || x > last - 2);
        const half = x < 12 ? -1 : 1;
        const stride = half * swing;
        let dx = 0;
        let dy = passing && y < 20 ? -1 : 0;
        if (hand) {
          dx = side && contact ? swing : 0;
          dy -= Number(!passing && stride === (facing === "up" ? -1 : 1));
        }
        if (y > 21) {
          dx = side && contact ? stride : 0;
          dy = -Number(!contact && stride === (facing === "down" ? -1 : 1));
        }
        if (passing && y === 19 && !hand) frame[y][x] = pixel;
        if (frame[y + dy]?.[x + dx] !== undefined) frame[y + dy][x + dx] = pixel;
      });
    });
    return frame.map((row) => row.join(""));
  });
  framesByPose.set(rows, result);
  return result;
}

export function drawCharacter(p, t, options, name) {
  const { palette, frames } = characterArt[name];
  const colors = figurePalette(palette, options);
  const walk = options.anim === "walk";
  const phase = Math.floor((((t % WALK_CYCLE) + WALK_CYCLE) % WALK_CYCLE) * WALK_FRAMES / WALK_CYCLE);
  const idleBob = (t + 0.3) % 1.6 > 0.8 ? -1 : 0;
  for (const { f, x } of spots(options.facing, 24)) {
    const still = frames[FACINGS.indexOf(f)] ?? frames[0];
    const rows = walk ? walkFrames(still, f)[phase] : still;
    groundShadow(p, x, 0, 6, 2);
    p.sprite(rows, colors, x + FRAME_X, FRAME_Y + (walk ? 0 : idleBob));
  }
}

// Supply the same indexed body to the chore rig. The rig still poses the hands
// against the tool's grip and handles the order of the tool and character.
export function drawWorkingCharacter(p, x, y, facing, look, pose, options) {
  const art = typeof look === "string" && characterArt[look];
  const rows = art?.frames[FACINGS.indexOf(facing)];
  if (!rows) return drawPerson(p, x, y, facing, look, pose);

  const { palette, arms } = workingColors(art, look, options ?? {});
  const body = (grid, lean, bob) => rows.forEach((row, j) => {
    [...row].forEach((char, i) => {
      // Leave the outer sleeve and hand pixels to the tool rig.
      if (char === "." || (j >= ARM_ROWS[0] && j <= ARM_ROWS[1] && Math.abs(i - 11.5) > 5)) return;
      const upper = j < 21;
      grid.set(i + FRAME_X + (upper ? lean : 0), j + FRAME_Y + (upper ? bob : 0), palette[char], 1, BODY_TAG);
    });
  });
  drawPerson(p, x, y, facing, look, { ...pose, body, bodyTag: BODY_TAG, armColors: arms });
}

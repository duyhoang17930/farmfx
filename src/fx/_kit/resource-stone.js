import { fit, rand } from "../../core/index.js";
import { asset, STEEL } from "./art.js";
import { groundShadow, twinkle } from "./sprite.js";

const PROFILES = {
  split: [[-12,-3],[-11,-10],[-5,-15],[3,-16],[10,-12],[13,-5],[8,-1],[-6,0]],
  low: [[-13,-4],[-10,-8],[-5,-11],[5,-11],[11,-9],[14,-5],[9,0],[-8,0]],
  ridge: [[-12,-4],[-9,-10],[-8,-15],[-1,-18],[8,-15],[11,-9],[12,-4],[5,0],[-7,-1]],
  wedge: [[-13,-4],[-10,-7],[-3,-12],[6,-16],[10,-13],[13,-5],[8,0],[-7,0]],
  twin: [[-13,-4],[-10,-11],[-6,-14],[-1,-13],[2,-10],[5,-12],[9,-11],[13,-4],[8,0],[-7,0]],
};

function rock(p, profile, C, scale = 1, x = 0, y = 0) {
  const face = PROFILES[profile].map(([a,b]) => [x + a * scale, y + b * scale]);
  const ridge = face.slice(0, -2);
  const bevel = [face.at(-1), ...ridge, face.at(-2)];
  const peak = [x - 2 * scale, y - 7 * scale];
  p.poly(face, C[0]);
  p.poly(bevel.map(([a,b]) => [a + (x-a) * 0.08, b + 1]), C[1]);
  p.poly([...ridge.slice(1, -1), [x + 8 * scale, y - 6 * scale], peak, [x - 9 * scale, y - 6 * scale]], C[2]);
  p.poly([...ridge.slice(1, 5), peak, [x - 8 * scale, y - 8 * scale]], C[3]);
  p.line(...ridge[2], ...ridge[3], C[4]);
  p.line(...peak, x + 3 * scale, y - 5 * scale, C[0]);
}

function nugget(p, x, y, w, h, C) {
  p.poly([[x-w,y],[x-w+1,y-h+1],[x,y-h],[x+w-1,y-h+1],[x+w,y+1],[x,y+2]], C[0]);
  p.poly([[x-w+1,y],[x-w+2,y-h+1],[x,y-h+1],[x+w-1,y-h+1],[x+w-1,y],[x,y+1]], C[2]);
  p.line(x-w+2,y-h+1,x+w-2,y-h+1,C[4]);
  p.px(x-w+1,y,C[3]);
}

export function ore(name, desc, palette, profile, nuggets, host = STEEL) {
  return asset({ name, desc, tags: ["resource", "ore", "mining"], palette, origin: [16,24], options: { host },
    duration: 1, fps: 1 }, (p, _phase, C, o) => {
    groundShadow(p, 0, -1, 13, 3);
    const bed = fit(o.host, 5);
    rock(p, profile, bed);
    for (const [x,y,w,h] of nuggets) nugget(p, x, y, w, h, C);
    const x = rand(1,20,o.seed) > 0.5 ? -10 : 10;
    p.line(x, 1, x + 1, 1, bed[2]);
  });
}

function shard(p, x, y, w, h, lean, C) {
  const tip = [x + lean, y - h], shoulder = [tip[0] - w,y - h + w + 1];
  const other = [tip[0] + w,y - h + w - 1], ridge = [x - 1,y - 1];
  const left = [x - w,y - 3], right = [x + w,y - 2];
  p.poly([left, shoulder, tip, other, right, [x,y]], C[0]);
  p.poly([[left[0]+1,left[1]], [shoulder[0]+1,shoulder[1]], [tip[0],tip[1]+1], ridge], C[3]);
  p.poly([[tip[0],tip[1]+1],[other[0]-1,other[1]+1],[right[0]-1,right[1]],ridge], C[2]);
  p.line(tip[0],tip[1]+1,tip[0]-w+2,tip[1]+w,C[4]);
  p.line(ridge[0],ridge[1],tip[0],tip[1]+3,C[3]);
}

export function gem(name, desc, palette, shafts, { host = STEEL, profile = "low", glint = true } = {}) {
  return asset({ name, desc, tags: ["resource", "gem", "mining"], palette, origin: [16,28],
    duration: glint ? 2.5 : 1, fps: glint ? 12 : 1, options: { host, glint } }, (p, phase, C, o) => {
    groundShadow(p, 0, -1, 13, 3);
    rock(p, profile, fit(o.host, 5), 0.93);
    for (const [x,y,w,h,lean] of shafts) shard(p, x, y, w, h, lean, C);
    const [x,y,,h,lean] = shafts.at(-1);
    const offset = rand(4, 19, o.seed) * 0.36;
    const flash = 1 - Math.abs(phase - (0.28 + offset)) / 0.10;
    if (o.glint && flash > 0) {
      twinkle(p, x + lean, y - h + 2, 2.8 * flash, C[3], C[4]);
      p.glow(x + lean, y - h + 2, 3.5, C[3], flash * 0.22);
    }
  });
}

export function deposit(name, desc, palette, paint) {
  return asset({ name, desc, tags: ["resource", "mineral", "mining"], palette, origin: [16,24],
    duration: 1, fps: 1 }, paint);
}

export function slab(p, x, y, w, h, C) {
  p.poly([[x-w,y-2],[x-w+3,y-h+1],[x+w-4,y-h],[x+w,y-h+4],[x+w-1,y-2],[x+w-4,y+1],[x-w+2,y+1]], C[0]);
  p.poly([[x-w+1,y-3],[x-w+4,y-h+2],[x+w-4,y-h+1],[x+w-1,y-h+4],[x+w-4,y-h+6],[x-w+2,y-h+6]], C[3]);
  p.line(x-w+4,y-h+2,x+w-4,y-h+1,C[4]);
  p.poly([[x-w+2,y-h+6],[x+w-4,y-h+6],[x+w-1,y-h+4],[x+w-2,y-2],[x+w-5,y],[x-w+2,y]], C[2]);
  p.line(x-w+3,y-1,x+w-5,y-1,C[1]);
}

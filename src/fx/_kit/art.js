import { fit, ramp, TAU } from "../../core/index.js";
import { Layer } from "./sprite.js";

export const WOOD = ramp(["#3c2b2d", "#654236", "#986242", "#b7804e", "#e6af71"]);
export const LEAF = ramp(["#233a30", "#385a3b", "#518348", "#7aa550", "#bed474"]);
export const STEEL = ramp(["#30374a", "#4c586d", "#758b9b", "#a5bbc1", "#e2e4cd"]);
export const GOLD = ramp(["#62422e", "#926033", "#c08c46", "#ebbd58", "#ffe68c"]);
export const RED = ramp(["#4c293c", "#7f3c49", "#b85357", "#de7967", "#ffb58b"]);
export const CREAM = ramp(["#564454", "#81707b", "#b3a090", "#dfc8a9", "#fff1cf"]);
export const WATER = ramp(["#253f52", "#335e72", "#43858d", "#6ab0aa", "#a5d9bf"]);
export const VIOLET = ramp(["#382e47", "#574463", "#805e85", "#a881a7", "#dfabd0"]);

export function asset({ name, desc, tags, size = [32, 32], origin = [size[0] / 2, size[1] - 8],
  duration = 2, fps = 16, loop = true, bg = "field", palette, options = {},
}, paint) {
  const meta = { name, desc, tags, size, origin, duration, fps, loop, bg, options: { palette, seed: 1, ...options } };
  function draw(p, t, o) {
    paint(p, t / duration, fit(o.palette, 5), o);
  }
  return { meta, draw };
}

export function round(p, x, y, rx, ry, C) {
  p.ellipse(x, y, rx, ry, C[0]);
  p.ellipse(x - 0.2, y - 0.25, rx * 0.87, ry * 0.84, C[2]);
  p.ellipse(x - rx * 0.18, y - ry * 0.23, rx * 0.67, ry * 0.63, C[3]);
  if (rx >= 3 && ry >= 3) p.line(x - rx * 0.42, y - ry * 0.39, x - rx * 0.15, y - ry * 0.53, C[4]);
}

export function box(p, x, y, w, h, depth, C) {
  p.rect(x, y - h, w, h, C[0]);
  p.rect(x + 1, y - h + 1, w - 2, h - 2, C[2]);
  p.rect(x + 1, y - h + 1, 1, h - 2, C[3]);
  p.poly([[x, y - h], [x + depth, y - h - depth], [x + w + depth, y - h - depth], [x + w, y - h]], C[3]);
  p.line(x + depth, y - h - depth, x + w + depth - 1, y - h - depth, C[4]);
  p.poly([[x + w - 1, y], [x + w + depth, y - depth], [x + w + depth, y - h - depth], [x + w - 1, y - h]], C[1]);
}

export function post(p, x, y, h, C = WOOD) {
  p.rect(x - 1, y - h, 3, h, C[0]);
  p.rect(x - 1, y - h, 1, h - 1, C[3]);
  p.px(x, y - h, C[4]);
}

export const wave = (phase, count = 1, offset = 0) => Math.sin((phase * count + offset) * TAU);

/** Keep the stationary planes of a large sprite, or its few whole-pixel poses. */
export function cacheArt(w, h, x, y, paint) {
  const poses = new Map();
  let colors = "";
  return (p, C, pose = 0) => {
    const key = C.join(",");
    if (key !== colors) {
      colors = key;
      poses.clear();
    }
    if (!poses.has(pose)) {
      const layer = new Layer(w, h);
      paint(layer.begin(x, y), C, pose);
      poses.set(pose, layer);
    }
    poses.get(pose).draw(p);
  };
}

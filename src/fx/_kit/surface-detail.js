// Surface detail for big flat areas. A sprite drawn bigger (a boss at 1.9x, a cave mouth, a shield) keeps 1 px
// lines but its fills grow into slabs of one color, so next to small sprites it reads as coarser art: the "mixel"
// look without any fat pixels. detailSlabs() finds those slabs in a finished layer and works 1 px material detail
// into their inside (cracks, grain, scales, facets, bubbles, folds, wraps), using the darker and lighter colors the
// sprite already has, so the texel density matches the small sprites round it.
//
// The pattern is anchored to each slab's own top-left corner, so it moves with the part it is on instead of
// swimming when the body bobs. Edges and outlines are left alone: only pixels whose four neighbours are the same
// slab change.

import { createFrame, Painter } from "../../core/index.js";
import { lightness, hueOf, saturationOf } from "./surface-color.js";

const hash = (a, b, s) => {
  let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul(s | 0, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

/** -1: a step darker, +1: a step lighter, 0: leave it. u, v: pixel inside the slab from its top-left. */
const PATTERNS = {
  // a few short cracks per 7 x 7 cell, chipped light on their top-left side
  cracks(u, v, s) {
    const cu = Math.floor(u / 7), cv = Math.floor(v / 7), r = hash(cu, cv, s);
    if (r < 0.35) return hash(u, v, s + 9) < 0.035 ? -1 : 0;
    const x0 = 1 + Math.floor(hash(cu, cv, s + 1) * 3), y0 = 1 + Math.floor(hash(cu, cv, s + 2) * 3), dir = r < 0.68 ? 1 : -1;
    const lu = u - cu * 7 - x0, lv = v - cv * 7 - y0, len = 3 + Math.floor(hash(cu, cv, s + 3) * 2);
    const on = (a, b) => a >= 0 && a < len && b === Math.round(a * dir * 0.6 + (a > 1 ? dir * 0.4 : 0));
    if (on(lu, lv)) return -1;
    if (on(lu + 1, lv + 1) && lu >= -1) return 1;
    return 0;
  },
  // vertical grain that wanders, with now and then a knot
  grain(u, v, s) {
    const x = u + Math.round(Math.sin(v / 3.2 + hash(0, Math.floor(u / 4), s) * 6) * 0.8);
    if (x % 4 === 0 && hash(Math.floor(x / 4), Math.floor(v / 5), s) < 0.7) return -1;
    if (x % 4 === 1 && hash(Math.floor(x / 4), Math.floor(v / 5), s + 1) < 0.18) return 1;
    return 0;
  },
  // overlapping scales: rows 3 px tall, every other row half a scale over
  scales(u, v, s) {
    const row = Math.floor(v / 3), x = (u + (row % 2) * 2) % 4, y = v % 3;
    if (y === 2 && (x === 1 || x === 2)) return -1;
    if (y === 1 && x === 0 && hash(Math.floor((u + (row % 2) * 2) / 4), row, s + 2) < 0.5) return -1;
    if (y === 0 && x === 1 && hash(Math.floor((u + (row % 2) * 2) / 4), row, s) < 0.4) return 1;
    return 0;
  },
  // facets: long diagonal light streaks with a dark edge under them, cell by cell
  facets(u, v, s) {
    const d = (u + v) % 8, cell = hash(Math.floor((u - v) / 6), Math.floor((u + v) / 8), s);
    if (cell < 0.45) return 0;
    return d === 0 ? 1 : d === 1 ? -1 : 0;
  },
  // bubbles: a sparse ring with a highlight on top
  bubbles(u, v, s) {
    const cu = Math.floor(u / 6), cv = Math.floor(v / 6);
    if (hash(cu, cv, s) < 0.55) return 0;
    const x = u - cu * 6 - 1 - Math.floor(hash(cu, cv, s + 1) * 2), y = v - cv * 6 - 1 - Math.floor(hash(cu, cv, s + 2) * 2);
    if (x === 1 && y === 0) return 1;
    if ((x === 0 || x === 2) && y === 1) return -1;
    if (x === 1 && y === 2) return -1;
    return 0;
  },
  // cloth: short vertical folds
  folds(u, v, s) {
    const col = Math.floor(u / 5);
    if (u % 5 !== 2) return 0;
    const start = Math.floor(hash(col, 0, s) * 5), len = 4 + Math.floor(hash(col, 1, s) * 4), off = (v - start + 40) % 11;
    return off < len ? -1 : off === len ? 1 : 0;
  },
  // wraps and bands: horizontal strips that slant a little
  wraps(u, v, s) {
    const y = v + Math.floor(u / 6);
    if (y % 4 === 0 && hash(Math.floor(u / 5), Math.floor(y / 4), s) < 0.8) return -1;
    if (y % 4 === 1 && hash(Math.floor(u / 5), Math.floor(y / 4), s + 1) < 0.25) return 1;
    return 0;
  },
  // mottle: soft clusters for skin and fur
  mottle(u, v, s) {
    const r = hash(Math.floor(u / 2), Math.floor(v / 2), s);
    return r < 0.12 && hash(u, v, s + 4) < 0.6 ? -1 : r > 0.95 ? 1 : 0;
  },
};
export const MATERIALS = Object.keys(PATTERNS);

/**
 * Work detail into the slabs of frame f (a Layer's frame): every region of one color bigger than min pixels.
 * material: a key of PATTERNS, or a function (color) => material for sprites mixing materials.
 */
export function detailSlabs(f, material, { min = 48, seed = 1 } = {}) {
  const { w, h, color } = f, n = w * h, region = new Int32Array(n).fill(-1), regions = [];
  for (let s = 0; s < n; s++) {
    if (region[s] >= 0 || color[s] >>> 24 !== 255) continue;
    const c = color[s], id = regions.length, list = [s];
    let x0 = w, y0 = h, x1 = 0, y1 = 0;
    region[s] = id;
    for (let k = 0; k < list.length; k++) {
      const i = list[k], x = i % w, y = (i / w) | 0;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      if (x > 0 && region[i - 1] < 0 && color[i - 1] === c) { region[i - 1] = id; list.push(i - 1); }
      if (x < w - 1 && region[i + 1] < 0 && color[i + 1] === c) { region[i + 1] = id; list.push(i + 1); }
      if (y > 0 && region[i - w] < 0 && color[i - w] === c) { region[i - w] = id; list.push(i - w); }
      if (y < h - 1 && region[i + w] < 0 && color[i + w] === c) { region[i + w] = id; list.push(i + w); }
    }
    regions.push({ c, list, x0, y0, x1, y1 });
  }
  const big = regions.filter((r) => r.list.length >= min);
  if (!big.length) return;
  const palette = [...new Set(regions.map((r) => r.c))];
  const out = color.slice();
  for (const r of big) {
    const mat = typeof material === "function" ? material(r.c) : material, fn = PATTERNS[mat] ?? PATTERNS.mottle;
    const dark = neighbour(r.c, palette, -1), light = neighbour(r.c, palette, 1);
    const id = region[r.list[0]], rw = r.x1 - r.x0 + 1, rh = r.y1 - r.y0 + 1, s = seed * 31 + (r.c & 0xffff);
    for (const i of r.list) {
      const x = i % w, y = (i / w) | 0;
      if (x < 1 || y < 1 || x >= w - 1 || y >= h - 1) continue;
      if (region[i - 1] !== id || region[i + 1] !== id || region[i - w] !== id || region[i + w] !== id) continue;
      const u = x - r.x0, v = y - r.y0, k = fn(u, v, s);
      if (k < 0 && dark) out[i] = dark;
      // light comes from the top-left: highlights only on that side of the slab
      else if (k > 0 && light && u / rw + v / rh < 1.15) out[i] = light;
    }
  }
  color.set(out);
}

/** The sprite's own next color darker (dir -1) or lighter (+1) than c, near its hue; made up if it has none. */
function neighbour(c, palette, dir) {
  const L = lightness(c), H = hueOf(c);
  let best = 0, score = Infinity;
  for (const q of palette) {
    const d = (lightness(q) - L) * dir;
    if (d < 5 || d > 26) continue;
    const dh = Math.min(Math.abs(hueOf(q) - H), 360 - Math.abs(hueOf(q) - H));
    const sc = Math.abs(d - 11) + dh * 0.35;
    if (sc < score) { score = sc; best = q; }
  }
  if (best) return best;
  // none on the sprite: a hue-shifted step (shadows cooler and towards violet, highlights warmer)
  const r = c & 255, g = (c >>> 8) & 255, b = (c >>> 16) & 255, a = c & 0xff000000;
  const m = (v, t, k) => Math.max(0, Math.min(255, Math.round(v + (t - v) * k)));
  return dir < 0 ? (a | (m(b, 70, 0.22) << 16) | (m(g, 30, 0.24) << 8) | m(r, 40, 0.22)) >>> 0
    : (a | (m(b, 150, 0.16) << 16) | (m(g, 235, 0.18) << 8) | m(r, 255, 0.2)) >>> 0;
}


/** Pick a material from a fill's own color: greys are stone or metal, warm browns wood, the rest mottled. */
export function materialByColor(c) {
  const s = saturationOf(c), h = hueOf(c);
  if (s < 0.22) return "cracks";
  if (h >= 12 && h <= 48 && lightness(c) < 70) return "grain";
  return "mottle";
}

/**
 * Give a finished layer the colored 1 px outline the style asks of anything you can walk up to: every silhouette
 * pixel that isn't already darker than the body behind it is inked a dark step of its own color. Edges facing the
 * light (top, left) that are highlights stay as they are, and 1 px threads (a fishing line, a wire) are left alone.
 */
export function outlineRim(f) {
  const { w, h, color } = f, n = w * h, A = (i) => color[i] >>> 24;
  const palette = [...new Set(Array.from(color).filter((c) => c >>> 24 === 255))];
  const out = color.slice(), inks = new Map();
  for (let i = 0; i < n; i++) {
    if (A(i) !== 255) continue;
    const x = i % w, y = (i / w) | 0, c = color[i];
    for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) {
      const ox = x + dx, oy = y + dy;
      if (ox >= 0 && oy >= 0 && ox < w && oy < h && A(oy * w + ox) >= 40) continue;
      const ix = x - dx, iy = y - dy;
      if (ix < 0 || iy < 0 || ix >= w || iy >= h || A(iy * w + ix) !== 255) break; // a thread: leave it
      const L = lightness(c);
      if (L < lightness(color[iy * w + ix]) - 8) break; // already outlined
      if ((dx < 0 || dy < 0) && L > 68) break; // a highlight on the lit side
      let ink = inks.get(c);
      if (ink === undefined) inks.set(c, (ink = darkInk(c, palette)));
      out[i] = ink;
      break;
    }
  }
  color.set(out);
}
/**
 * A rim light along the lit (top and left) edges: the pixel just inside the outline goes a step lighter, so a
 * creature stands off a dark floor without a halo. Pixels already among the lightest are left as they are.
 */
export function rimLight(f) {
  const { w, h, color } = f, A = (i) => (i >= 0 && i < w * h ? color[i] >>> 24 : 0);
  const palette = [...new Set(Array.from(color).filter((c) => c >>> 24 === 255))];
  const out = color.slice(), lights = new Map();
  for (let i = 0; i < w * h; i++) {
    if (A(i) !== 255) continue;
    const x = i % w, c = color[i], L = lightness(c);
    let lit = false;
    for (const [step, ok] of [[-w, i >= 2 * w], [-1, x >= 2]]) {
      const o = i + step, oo = o + step;
      // the neighbour toward the light is an outline pixel (darker, with open space beyond it)
      if (!ok || A(o) !== 255 || A(oo) >= 40) continue;
      if (lightness(color[o]) < L - 8) { lit = true; break; }
    }
    if (!lit || L > 80) continue;
    let up = lights.get(c);
    if (up === undefined) lights.set(c, (up = neighbour(c, palette, 1)));
    out[i] = up;
  }
  color.set(out);
}
/** The outline color for c: the sprite's own color well darker than c near its hue, else a violet-dark mix. */
function darkInk(c, palette) {
  const L = lightness(c), H = hueOf(c);
  let best = 0, score = Infinity;
  for (const q of palette) {
    const d = L - lightness(q);
    if (d < 14 || d > 50) continue;
    const dh = Math.min(Math.abs(hueOf(q) - H), 360 - Math.abs(hueOf(q) - H));
    const sc = Math.abs(d - 26) + dh * 0.5;
    if (sc < score) { score = sc; best = q; }
  }
  if (best && score < 40) return best;
  const m = (v, t) => Math.round(v + (t - v) * 0.6);
  return ((c & 0xff000000) | (m((c >>> 16) & 255, 52) << 16) | (m((c >>> 8) & 255, 28) << 8) | m(c & 255, 40)) >>> 0;
}

/**
 * Wrap an asset ({ meta, draw }) so its big flat fills get material detail: it draws into a layer, the layer's
 * slabs are worked, and the result goes onto the painter (translucent pixels and light kept, mirroring honoured).
 */
export function withSurfaceDetail(fx, material = materialByColor, { min = 48, outline = false, detail = true } = {}) {
  const [w, h] = fx.meta.size, [ox, oy] = fx.meta.origin, pad = 8;
  const f = createFrame(w + pad * 2, h + pad * 2, -ox - pad, -oy - pad), q = new Painter(f), cache = new Map();
  function draw(p, t, o) {
    // drawn at another size (an inventory icon at half size): rasterise the shapes straight at that size; the
    // detail is made for 1:1 and would only be thinned out by a resample
    if (p.sc !== 1) return fx.draw(p, t, o);
    f.color.fill(0);
    f.light.fill(0);
    q.reset().place(0, 0);
    q.layer = p.layer;
    fx.draw(q, t, o);
    // the passes are slow next to the drawing, and an animation shows the same few frames over and over: keep
    // the worked result of each distinct drawing
    let hsh = 2166136261 ^ (o.seed ?? 1);
    const raw = f.color;
    for (let i = 0; i < raw.length; i++) hsh = Math.imul(hsh ^ raw[i], 16777619);
    const hit = cache.get(hsh);
    if (hit) raw.set(hit);
    else {
      if (detail) detailSlabs(f, material, { min, seed: o.seed ?? 1 });
      if (outline) outlineRim(f);
      if (cache.size >= 64) cache.delete(cache.keys().next().value);
      cache.set(hsh, raw.slice());
    }
    const C = f.color, Lb = f.light, W = f.w;
    for (let i = 0; i < C.length; i++) {
      const c = C[i], a = c >>> 24, l = Lb[i] & 0xffffff;
      if (!a && !l) continue;
      const x = (i % W) + f.ox, y = ((i / W) | 0) + f.oy;
      if (a === 255) p.px(x, y, c);
      else if (a) p.blend(x, y, c, a / 255);
      if (l) p.light(x, y, l | 0xff000000, 1);
    }
  }
  return { ...fx, meta: fx.meta, draw };
}

// Style measurements for one rendered still: the things the art direction (docs/STYLE.md) asks for that a look at
// a single sprite misses but a sheet of hundreds makes obvious. Shared by tools/audit-style.mjs, tools/check.mjs
// --style and the archipelago map's readability report.
//
// Pixels are the painter's packed colors: r = c & 255, g = c >>> 8, b = c >>> 16, a = c >>> 24.

import { createFrame, createFx, painterFor, stockActor } from "../../src/core/index.js";

export const rgbOf = (c) => [c & 255, (c >>> 8) & 255, (c >>> 16) & 255];
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const LUT = Float32Array.from({ length: 256 }, (_, v) => lin(v));
/** CIE lightness L* (0..100) of a packed color. */
export function lightness(c) {
  const Y = 0.2126 * LUT[c & 255] + 0.7152 * LUT[(c >>> 8) & 255] + 0.0722 * LUT[(c >>> 16) & 255];
  return Y > 0.008856 ? 116 * Math.cbrt(Y) - 16 : 903.3 * Y;
}
/** HSV saturation (0..1) of a packed color. */
export function saturation(c) {
  const [r, g, b] = rgbOf(c), mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  return mx ? (mx - mn) / mx : 0;
}

const SOLID = 255, SEEN = 40;

/**
 * Measure one still. color: Uint32Array w * h, origin: [x, y] of the ground contact inside the buffer.
 * light: the additive light buffer, optional.
 */
export function measure(color, w, h, origin, light) {
  const A = (i) => color[i] >>> 24, solid = (x, y) => x >= 0 && y >= 0 && x < w && y < h && A(y * w + x) === SOLID;
  const seen = (x, y) => x >= 0 && y >= 0 && x < w && y < h && A(y * w + x) >= SEEN;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, nSolid = 0, nSoft = 0, changes = 0, black = 0;
  const alphas = new Set(), colors = new Set();
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x, a = A(i);
    if (a >= SEEN) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (a > 0 && a < SOLID) { nSoft++; alphas.add(a); }
    if (a !== SOLID) continue;
    nSolid++;
    colors.add(color[i] & 0xffffff);
    if (solid(x + 1, y) && color[i + 1] !== color[i]) changes++;
    if (solid(x, y + 1) && color[i + w] !== color[i]) changes++;
  }
  // color runs, across and down: art drawn at 2x and scaled up has only even runs and no 1 px runs at all
  let runs = 0, singles = 0, even = 0;
  const runScan = (len, at, steps) => {
    for (let s = 0; s < steps; s++) {
      let n = 0, prev = -1;
      for (let k = 0; k <= len; k++) {
        const i = k < len ? at(s, k) : -1, c = i >= 0 && A(i) === SOLID ? color[i] : -1;
        if (c === prev && c !== -1) { n++; continue; }
        if (prev !== -1) { runs++; if (n === 1) singles++; if (n % 2 === 0) even++; }
        prev = c; n = 1;
      }
    }
  };
  runScan(w, (y, x) => y * w + x, h);
  runScan(h, (x, y) => y * w + x, w);
  // outlines: from each silhouette pixel step inwards and count how many pixels stay well darker than the body
  let edges = 0, outlined = 0, thick = 0, judged = 0, outlineL = 0;
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!solid(x, y)) continue;
    const out = DIRS.find(([dx, dy]) => !seen(x + dx, y + dy));
    if (!out) continue;
    edges++;
    const i = y * w + x, [r, g, b] = rgbOf(color[i]);
    if (Math.max(r, g, b) < 24) black++;
    // an outline is a step down at the rim; a thick one keeps the same dark tone one pixel further in
    const [dx, dy] = out, inner = [];
    for (let k = 0; k < 6 && solid(x - dx * k, y - dy * k); k++) inner.push(lightness(color[(y - dy * k) * w + x - dx * k]));
    if (inner.length < 5) continue;
    judged++;
    const body = Math.max(inner[1], inner[2], inner[3]), body2 = Math.max(inner[2], inner[3], inner[4]);
    if (inner[0] < body - 8) {
      outlined++; outlineL += inner[0];
      thick += inner[1] < body2 - 8 && Math.abs(inner[1] - inner[0]) < 5 ? 2 : 1;
    }
  }
  // the biggest slab of one flat color: a big sprite drawn with big flat shapes reads as coarser art than its
  // neighbours even when its pixels are 1 px (the "mixel" look of an enlarged boss)
  let maxFlat = 0;
  const done = new Uint8Array(w * h), stack = [];
  for (let s = 0; s < w * h; s++) {
    if (done[s] || A(s) !== SOLID) continue;
    let n = 0;
    stack.push(s); done[s] = 1;
    while (stack.length) {
      const i = stack.pop(), x = i % w, c = color[i];
      n++;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w])
        if (j >= 0 && j < w * h && !done[j] && A(j) === SOLID && color[j] === c) { done[j] = 1; stack.push(j); }
    }
    if (n > maxFlat) maxFlat = n;
  }
  // the contact shadow: translucent pixels in the rows round the ground line (as the archipelago map judges it)
  let contact = 0;
  if (origin) for (let y = Math.max(0, origin[1] - 4); y <= Math.min(h - 1, origin[1] + 7); y++)
    for (let x = 0; x < w; x++) { const a = A(y * w + x); if (a > 0 && a < 128) contact++; }
  // light: how many distinct strengths a glow uses, and how much of the frame it covers
  let lit = 0;
  const levels = new Set();
  if (light) for (let i = 0; i < light.length; i++) {
    const l = light[i], v = Math.max(l & 255, (l >>> 8) & 255, (l >>> 16) & 255);
    if (v > 6) { lit++; levels.add(v >> 2); }
  }
  return {
    ink: x1 < 0 ? [0, 0] : [x1 - x0 + 1, y1 - y0 + 1],
    solid: nSolid, colors: colors.size, maxFlat,
    detail: nSolid ? +(changes / nSolid).toFixed(3) : 0,
    runs, singles: runs ? +(singles / runs).toFixed(3) : 0, even: runs ? +(even / runs).toFixed(3) : 0,
    edges, outlined: judged ? +(outlined / judged).toFixed(3) : 0, outlineW: outlined ? +(thick / outlined).toFixed(2) : 0,
    outlineL: outlined ? +(outlineL / outlined).toFixed(1) : 0, black: edges ? +(black / edges).toFixed(3) : 0,
    soft: nSoft, softShare: nSolid + nSoft ? +(nSoft / (nSolid + nSoft)).toFixed(3) : 0, alphaLevels: alphas.size,
    contact, lit, lightLevels: levels.size,
  };
}

/** Lightness spread of an area: [p5, median, p95, standard deviation], over the pixels pick(i) accepts. */
export function spread(color, n, pick = (i) => color[i] >>> 24) {
  const L = [];
  for (let i = 0; i < n; i++) if (pick(i)) L.push(lightness(color[i]));
  if (!L.length) return { p5: 0, med: 0, p95: 0, sd: 0, n: 0 };
  L.sort((a, b) => a - b);
  const mean = L.reduce((s, v) => s + v, 0) / L.length, q = (f) => L[Math.min(L.length - 1, Math.floor(L.length * f))];
  return { p5: +q(0.05).toFixed(1), med: +q(0.5).toFixed(1), p95: +q(0.95).toFixed(1),
    sd: +Math.sqrt(L.reduce((s, v) => s + (v - mean) ** 2, 0) / L.length).toFixed(1), n: L.length };
}

/** The options a still wants (as the archipelago map picks them): facing the viewer, idle, grown, switched on. */
export function stillOptions(meta, id, extra = {}) {
  const o = { ...meta.options };
  if (typeof o.facing === "string" && ["down", "all", "left", "right", "up"].includes(o.facing)) o.facing = "down";
  if ("anim" in o) o.anim = "idle";
  if (typeof o.state === "string") o.state = "idle";
  if ("stage" in o) o.stage = id.startsWith("crops/coastal") ? 2 : 4;
  if ("active" in o) o.active = true;
  if ("unlocked" in o) o.unlocked = true;
  if (meta.actor) o.actor = stockActor(meta.actor === 2 ? 2 : 1);
  return { ...o, ...extra };
}

/** Render one still at time t (seconds for create-style effects) into a padded frame. */
export function renderStill(mod, o, t, pad = 24) {
  const [w, h] = mod.meta.size, [ox, oy] = mod.meta.origin;
  const f = createFrame(w + pad * 2, h + pad * 2);
  if (!mod.draw) {
    const inst = createFx(mod, { ...o, x: ox + pad, y: oy + pad });
    for (let s = 0; s < t; s += 1 / 30) inst.update(1 / 30);
    inst.draw(f);
  } else {
    const p = painterFor(f);
    p.place(ox + pad, oy + pad);
    mod.drawBack?.(p, t, o);
    mod.draw(p, t, o);
  }
  return { frame: f, origin: [ox + pad, oy + pad] };
}

// What each category is, for the rules: things that stand on the ground, ground tiles, effects, icons.
export const STANDING = new Set(["animals", "bosses", "buildings", "characters", "enemies", "machines", "objects", "player", "resources", "trees", "crops"]);
export const EFFECT = new Set(["combat", "fx", "particles", "lighting", "weather", "farming", "skills", "transitions"]);
export const ICON = new Set(["items", "weapons", "equipment", "tools"]);
export const CREATURE = new Set(["animals", "bosses", "characters", "enemies", "player"]);
export const isGround = (id, meta) => meta.tags?.includes("ground") || meta.tags?.includes("terrain") || meta.tags?.includes("tile") && meta.size[0] === 16 && meta.size[1] === 16;
/** Things that fly or swim, so a missing contact shadow is right. */
export const AIRBORNE = /fish|jelly|octopus|puffer|salmon|tuna|lobster|koi|butterfly|bee|dragonfly|firefly|bird|eagle|owl|crow|parrot|bat|ghost|spirit|elemental|swimming|lily|boat|raft|sailing/;

/** The style problems one asset's measurements show, as short notes. */
export function judge(id, meta, m) {
  const cat = id.split("/")[0], notes = [];
  if (m.runs >= 60 && m.singles < 0.06 && m.even > 0.75) notes.push(`fat pixels: ${(m.even * 100).toFixed(0)}% of color runs are even and only ${(m.singles * 100).toFixed(1)}% are 1 px (drawn big and scaled up?)`);
  if (m.black > 0.15) notes.push(`black outline: ${(m.black * 100).toFixed(0)}% of the silhouette is near-black, use a dark tone of the color it wraps`);
  if ((STANDING.has(cat) || ICON.has(cat)) && m.outlineW >= 1.75 && m.outlined > 0.4) notes.push(`thick outline: ${m.outlineW} px on average (rule: 1 px)`);
  const flatCap = CREATURE.has(cat) ? 200 : 600;
  if ((STANDING.has(cat) || ICON.has(cat)) && m.maxFlat > flatCap) notes.push(`flat slab: ${m.maxFlat} px of one flat color (cap ${flatCap}); reads coarser than the sprites round it`);
  if ((STANDING.has(cat) || ICON.has(cat)) && m.edges > 30 && m.outlined < 0.3) notes.push(`no outline: only ${(m.outlined * 100).toFixed(0)}% of the silhouette is darker than the body`);
  if (STANDING.has(cat) && !AIRBORNE.test(id) && cat !== "crops" && m.solid > 30 && !m.contact) notes.push("no contact shadow under it");
  if (m.alphaLevels > 6 && m.soft > 40) notes.push(`soft alpha: ${m.alphaLevels} alpha levels over ${m.soft} px (rule: 2-3 flat levels per volume)`);
  if (m.lightLevels > 10 && m.lit > 200) notes.push(`smooth glow: ${m.lightLevels} light strengths over ${m.lit} px (rule: 4 stepped levels)`);
  return notes;
}

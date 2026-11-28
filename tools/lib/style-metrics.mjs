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
/** CIE Lab of a packed color. */
export function lab(c) {
  const r = LUT[c & 255], g = LUT[(c >>> 8) & 255], b = LUT[(c >>> 16) & 255];
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const X = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047), Y = f(0.2126 * r + 0.7152 * g + 0.0722 * b), Z = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883);
  return [116 * Y - 16, 500 * (X - Y), 200 * (Y - Z)];
}
/** Color difference (CIE76 delta E) between two Lab colors. */
export const deltaE = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
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
  // the biggest bare area: pixels whose whole 5 x 5 neighbourhood is one flat color, joined up. A big sprite drawn
  // with big flat fills reads as coarser art than its neighbours even when its pixels are 1 px (the "mixel" look
  // of an enlarged boss); sparse 1 px detail breaks a bare area up even though the fill stays one region.
  let maxFlat = 0;
  const bare = new Uint8Array(w * h), done = new Uint8Array(w * h), stack = [];
  for (let y = 2; y < h - 2; y++) for (let x = 2; x < w - 2; x++) {
    const i = y * w + x, c = color[i];
    if (A(i) !== SOLID) continue;
    let same = true;
    for (let dy = -2; dy <= 2 && same; dy++) for (let dx = -2; dx <= 2; dx++) if (color[i + dy * w + dx] !== c) { same = false; break; }
    bare[i] = same ? 1 : 0;
  }
  for (let s = 0; s < w * h; s++) {
    if (!bare[s] || done[s]) continue;
    let n = 0;
    stack.push(s); done[s] = 1;
    while (stack.length) {
      const i = stack.pop(), x = i % w;
      n++;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w])
        if (j >= 0 && j < w * h && bare[j] && !done[j] && color[j] === color[i]) { done[j] = 1; stack.push(j); }
    }
    if (n > maxFlat) maxFlat = n;
  }
  // the contact shadow: translucent pixels in the rows round the ground line (as the archipelago map judges it)
  let contact = 0;
  if (origin) for (let y = Math.max(0, origin[1] - 4); y <= Math.min(h - 1, origin[1] + 7); y++)
    for (let x = 0; x < w; x++) { const a = A(y * w + x); if (a > 0 && a < 128) contact++; }
  // light: how many distinct strengths a glow uses, and how much of the frame it covers
  let lit = 0, litPairs = 0, smoothPairs = 0, softPairs = 0, rampPairs = 0;
  const levels = new Set(), lv = (i) => { const l = light[i]; return Math.max(l & 255, (l >>> 8) & 255, (l >>> 16) & 255); };
  if (light) for (let i = 0; i < light.length; i++) {
    const v = lv(i);
    if (v <= 6) continue;
    lit++; levels.add(v >> 2);
    // a smooth ramp: neighbours that differ, but by only a sliver (stepped light jumps or stays level)
    for (const j of [i % w < w - 1 ? i + 1 : -1, i + w < light.length ? i + w : -1]) {
      if (j < 0) continue;
      const u = lv(j);
      if (u <= 6) continue;
      litPairs++;
      const d = Math.abs(u - v);
      if (d > 0 && d / Math.max(u, v) < 0.05) smoothPairs++;
    }
  }
  // the same for translucency: neighbouring translucent pixels whose alpha differs by a sliver
  for (let i = 0; i < color.length; i++) {
    const a = color[i] >>> 24;
    if (!a || a === 255) continue;
    for (const j of [i % w < w - 1 ? i + 1 : -1, i + w < color.length ? i + w : -1]) {
      if (j < 0) continue;
      const b = color[j] >>> 24;
      if (!b || b === 255) continue;
      softPairs++;
      if (a !== b && Math.abs(a - b) < 20) rampPairs++;
    }
  }
  return {
    ink: x1 < 0 ? [0, 0] : [x1 - x0 + 1, y1 - y0 + 1],
    solid: nSolid, colors: colors.size, maxFlat,
    detail: nSolid ? +(changes / nSolid).toFixed(3) : 0,
    runs, singles: runs ? +(singles / runs).toFixed(3) : 0, even: runs ? +(even / runs).toFixed(3) : 0,
    edges, outlined: judged ? +(outlined / judged).toFixed(3) : 0, outlineW: outlined ? +(thick / outlined).toFixed(2) : 0,
    outlineL: outlined ? +(outlineL / outlined).toFixed(1) : 0, black: edges ? +(black / edges).toFixed(3) : 0,
    soft: nSoft, softShare: nSolid + nSoft ? +(nSoft / (nSolid + nSoft)).toFixed(3) : 0, alphaLevels: alphas.size,
    contact, lit, lightLevels: levels.size, glowRamp: litPairs ? +(smoothPairs / litPairs).toFixed(3) : 0,
    alphaRamp: softPairs ? +(rampPairs / softPairs).toFixed(3) : 0,
  };
}

/** Lightness spread of an area: [p5, median, p95, standard deviation], over the pixels pick(i) accepts. */
export function spread(color, n, pick = (i) => color[i] >>> 24) {
  const L = [];
  for (let i = 0; i < n; i++) if (pick(i)) L.push(lightness(color[i]));
  if (!L.length) return { p5: 0, med: 0, mean: 0, p95: 0, sd: 0, n: 0 };
  L.sort((a, b) => a - b);
  const mean = L.reduce((s, v) => s + v, 0) / L.length, q = (f) => L[Math.min(L.length - 1, Math.floor(L.length * f))];
  return { p5: +q(0.05).toFixed(1), med: +q(0.5).toFixed(1), mean: +mean.toFixed(2), p95: +q(0.95).toFixed(1),
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
export const AIRBORNE = /duck|frog|conveyor|carpet|rug|painting|window|wall-clock|coastal-dock|minecart-track|fish|jelly|octopus|puffer|salmon|tuna|lobster|koi|butterfly|bee|dragonfly|firefly|bird|eagle|owl|crow|parrot|bat|ghost|spirit|elemental|swimming|lily|boat|raft|sailing/;

/** The style problems one asset's measurements show, as short notes. */
export function judge(id, meta, m) {
  const cat = id.split("/")[0], notes = [];
  if (m.runs >= 60 && m.singles < 0.06 && m.even > 0.75) notes.push(`fat pixels: ${(m.even * 100).toFixed(0)}% of color runs are even and only ${(m.singles * 100).toFixed(1)}% are 1 px (drawn big and scaled up?)`);
  if (m.black > 0.15) notes.push(`black outline: ${(m.black * 100).toFixed(0)}% of the silhouette is near-black, use a dark tone of the color it wraps`);
  if ((STANDING.has(cat) || ICON.has(cat)) && m.outlineW >= 1.75 && m.outlined > 0.4) notes.push(`thick outline: ${m.outlineW} px on average (rule: 1 px)`);
  const flatCap = CREATURE.has(cat) ? 40 : 160;
  if ((STANDING.has(cat) || ICON.has(cat)) && m.maxFlat > flatCap) notes.push(`flat slab: ${m.maxFlat} px with no detail within 2 px (cap ${flatCap}); reads coarser than the sprites round it`);
  if ((STANDING.has(cat) || ICON.has(cat)) && m.edges > 30 && m.outlined < 0.3) notes.push(`no outline: only ${(m.outlined * 100).toFixed(0)}% of the silhouette is darker than the body`);
  if (STANDING.has(cat) && !AIRBORNE.test(id) && cat !== "crops" && m.solid > 30 && !m.contact) notes.push("no contact shadow under it");
  if (m.alphaRamp > 0.12 && m.soft > 40) notes.push(`soft alpha: ${(m.alphaRamp * 100).toFixed(0)}% of translucent neighbours ramp smoothly (${m.alphaLevels} alpha levels; rule: flat stepped levels, dither below the first)`);
  if (m.glowRamp > 0.15 && m.lit > 200) notes.push(`smooth glow: ${(m.glowRamp * 100).toFixed(0)}% of lit neighbours ramp smoothly (rule: stepped, dithered falloff)`);
  return notes;
}

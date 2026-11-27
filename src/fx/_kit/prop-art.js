// Furniture and scene props, drawn 3/4 top-down: the top face sits straight above the front face (no oblique
// skew), light from the top-left, 1 px dark rims, wood grain, cloth folds and metal glints. t is the loop phase
// 0..1. Used by scene-props.js.
import { hex, rand } from "../../core/index.js";
import { CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, round, wave } from "./art.js";
import { twinkle } from "./sprite.js";
import { hot, vapor } from "./machine.js";

const INK = hex("#1d1826");
const STONE = [hex("#3b3a4a"), hex("#5d5a68"), hex("#837d88"), hex("#a9a1a6"), hex("#d6cdc5")];

/** A front face: dark rim, lit left edge, shaded right edge and foot. */
export function front(p, x, y, w, h, C, tone = 2) {
  p.rect(x, y - h, w, h, C[0]); p.rect(x + 1, y - h + 1, w - 2, h - 2, C[tone]);
  p.line(x + 1, y - h + 1, x + 1, y - 2, C[Math.min(4, tone + 1)]); p.line(x + w - 2, y - h + 1, x + w - 2, y - 2, C[Math.max(1, tone - 1)]);
  p.line(x + 1, y - 2, x + w - 2, y - 2, C[Math.max(1, tone - 1)]);
}
/** A top face seen from above: lighter, a highlight along its far edge. */
export function topFace(p, x, y, w, d, C, tone = 3) {
  p.rect(x, y - d, w, d + 1, C[0]); p.rect(x + 1, y - d + 1, w - 2, d - 1, C[tone]); p.line(x + 1, y - d + 1, x + w - 2, y - d + 1, C[Math.min(4, tone + 1)]);
}
export function rivet(p, x, y, M) { p.px(x, y, M[4]); p.px(x + 1, y + 1, M[1]); }
export function band(p, x, y0, y1, M) { p.rect(x, y0, 2, y1 - y0, M[1]); p.line(x, y0, x, y1 - 1, M[3]); }
/** Wood grain: a few broken darker lines along a surface. */
function grain(p, x0, y0, w, h, C, seed, step = 3) {
  for (let y = y0 + 1; y < y0 + h - 1; y += step)
    for (let x = x0 + 1; x < x0 + w - 2; x++) if (rand(x, y, seed) < 0.55 && rand(x >> 2, y, seed + 3) < 0.8) p.px(x, y, C[1]);
}
function leg(p, x, y, h, C) { p.rect(x, y - h, 3, h, C[0]); p.line(x + 1, y - h, x + 1, y - 1, C[3]); }
function knob(p, x, y, M = GOLD) { p.px(x, y, M[3]); p.px(x + 1, y + 1, M[1]); }
function shine(p, x, y, t, ph = 0) { const k = (t + ph) % 1; if (k < 0.15) twinkle(p, x, y, 1.8 * Math.sin(k / 0.15 * Math.PI), CREAM[4], CREAM[3]); }

// ---------------------------------------------------------------- tables and seats
function table(p, id, C, t, o) {
  if (id === "chair") {
    for (const x of [-7, 4]) leg(p, x, 0, 9, C);
    for (const x of [-6, 3]) leg(p, x, -10, 12, C);
    p.rect(-8, -25, 16, 4, C[0]); p.rect(-7, -24, 14, 2, C[3]); p.line(-7, -24, 6, -24, C[4]);
    for (const x of [-4, -1, 2]) p.rect(x, -21, 2, 9, C[2]), p.line(x, -21, x, -13, C[3]);
    topFace(p, -8, -9, 16, 5, C); front(p, -8, -7, 16, 3, C, 1);
    p.rect(-5, -13, 10, 3, RED[2]); p.line(-5, -13, 3, -13, RED[4]);
  } else if (id === "stool") {
    for (const [x, h] of [[-6, 9], [3, 9], [-1, 7]]) leg(p, x, 0 - (h === 7 ? 2 : 0), h, C);
    p.line(-5, -4, 5, -4, C[1]);
    p.ellipse(0, -10, 8, 3.5, C[0]); p.ellipse(0, -10.5, 7, 2.7, C[3]); p.ellipse(-1, -11, 4.5, 1.4, C[4]);
    p.line(-7, -9, 7, -9, C[1]);
  } else if (id === "kitchen-counter") {
    const w = 34, h = 14;
    front(p, -w / 2, 0, w, h, C);
    p.line(-w / 2 + 1, -h + 4, w / 2 - 2, -h + 4, C[1]);
    for (const x of [-w / 2 + 2, 1]) { p.rect(x, -h + 5, 14, 8, C[1]); p.rect(x + 1, -h + 6, 12, 6, C[2]); knob(p, x + (x < 0 ? 11 : 1), -h + 8); }
    for (const x of [-10, 6]) p.line(x - 2, -h + 2, x + 2, -h + 2, GOLD[3]);
    topFace(p, -w / 2 - 1, -h, w + 2, 9, STONE, 3);
    p.ellipse(7, -h - 4, 6, 2.6, STEEL[0]); p.ellipse(7, -h - 4, 5, 1.8, WATER[1]); p.px(5, -h - 5, WATER[4]);
    p.rect(11, -h - 10, 1, 6, STEEL[3]); p.line(9, -h - 10, 11, -h - 10, STEEL[4]);
    p.rect(-14, -h - 7, 10, 5, WOOD[3]); p.line(-14, -h - 7, -5, -h - 7, WOOD[4]);
    for (const [x, c] of [[-12, RED[3]], [-9, LEAF[3]], [-7, GOLD[3]]]) p.px(x, -h - 5, c);
  } else {
    const dining = id === "dining-table", w = dining ? 42 : 30, top = 12, d = dining ? 12 : 10;
    for (const x of [-w / 2 + 3, w / 2 - 6]) leg(p, x, -top + 2, 4, C), leg(p, x, 0, top, C);
    topFace(p, -w / 2, -top, w, d, C);
    front(p, -w / 2, -top + 3, w, 3, C, 1);
    if (!dining) { grain(p, -w / 2 + 1, -top - d + 1, w - 2, d - 1, C, 3); p.ellipse(7, -top - 4, 3.5, 1.6, CREAM[3]); p.rect(5, -top - 9, 4, 4, CREAM[2]); p.line(5, -top - 9, 8, -top - 9, CREAM[4]); }
    else {
      // a cloth with a hem hanging over the front, two plates, a candle
      p.rect(-w / 2 + 2, -top - d + 2, w - 4, d - 2, CREAM[3]); p.line(-w / 2 + 2, -top - d + 2, w / 2 - 3, -top - d + 2, CREAM[4]);
      for (let x = -w / 2 + 2; x < w / 2 - 2; x++) p.px(x, -top + (x & 2 ? 1 : 2), CREAM[x & 2 ? 2 : 3]);
      for (const x of [-11, 11]) { p.ellipse(x, -top - 6, 5, 2.4, CREAM[1]); p.ellipse(x, -top - 6.3, 4, 1.7, CREAM[4]); p.ellipse(x, -top - 6.5, 2, 1, x < 0 ? RED[3] : LEAF[3]); }
      p.rect(-1, -top - 13, 2, 6, CREAM[4]); p.px(0, -top - 14, GOLD[4]); p.glow(0, -top - 14, 8, GOLD[4], 0.4);
      p.px(0, -top - 15 - Math.round(wave(t, 3)), GOLD[3]);
    }
  }
}

// ---------------------------------------------------------------- beds
function bed(p, id, C, t) {
  const dbl = id === "double-bed", w = dbl ? 40 : 26, q = dbl ? RED : WATER;
  // headboard at the back, the mattress seen from above, a quilt over the foot
  front(p, -w / 2, -24, w, 10, WOOD); p.line(-w / 2 + 2, -31, w / 2 - 3, -31, WOOD[4]);
  for (let x = -w / 2 + 4; x < w / 2 - 3; x += 5) p.line(x, -30, x, -26, WOOD[1]);
  topFace(p, -w / 2, -6, w, 18, CREAM, 3);
  for (const x of dbl ? [-16, 2] : [-9]) { p.rect(x, -23, 14, 6, CREAM[0]); p.rect(x + 1, -22, 12, 4, CREAM[4]); p.line(x + 2, -19, x + 11, -19, CREAM[2]); }
  p.rect(-w / 2, -16, w, 11, q[0]); p.rect(-w / 2 + 1, -15, w - 2, 9, q[2]);
  p.line(-w / 2 + 1, -15, w / 2 - 2, -15, q[4]); p.line(-w / 2 + 1, -14, w / 2 - 2, -14, CREAM[4]);
  for (let x = -w / 2 + 3; x < w / 2 - 2; x += 6) for (let y = -12; y < -6; y += 3) p.px(x + ((y / 3) & 1) * 3, y, q[3]);
  front(p, -w / 2, 0, w, 6, q, 1); p.line(-w / 2 + 1, -5, w / 2 - 2, -5, q[3]);
  for (const x of [-w / 2, w / 2 - 3]) p.rect(x, -2, 3, 3, WOOD[1]);
}

// ---------------------------------------------------------------- tall furniture
function cabinet(p, id, C, t, o) {
  if (id === "refrigerator") {
    const w = 22, h = 38, F = [hex("#55606e"), hex("#8996a0"), hex("#c2cbcd"), hex("#e3e8e2"), hex("#ffffff")];
    front(p, -w / 2, 0, w, h, F); topFace(p, -w / 2, -h, w, 5, F, 3);
    p.line(-w / 2 + 1, -h + 12, w / 2 - 2, -h + 12, F[0]);
    for (const [y0, y1] of [[-h + 3, -h + 10], [-h + 15, -6]]) { p.rect(w / 2 - 5, y0, 2, y1 - y0, F[1]); p.line(w / 2 - 5, y0, w / 2 - 5, y1 - 1, F[4]); }
    for (const [x, y, c] of [[-6, -22, RED[3]], [-3, -19, GOLD[3]], [-7, -16, LEAF[3]]]) p.rect(x, y, 2, 2, c);
    p.rect(-6, -h + 4, 6, 4, CREAM[4]); p.line(-5, -h + 6, -2, -h + 6, WATER[2]);
    p.rect(-w / 2 + 1, -1, 3, 1, F[0]); p.rect(w / 2 - 4, -1, 3, 1, F[0]);
    return;
  }
  const W = { wardrobe: 26, bookshelf: 30, cabinet: 28 }[id], H = { wardrobe: 40, bookshelf: 36, cabinet: 22 }[id];
  front(p, -W / 2, 0, W, H, C); topFace(p, -W / 2 - 1, -H, W + 2, 4, C);
  p.rect(-W / 2 + 1, -3, W - 2, 2, C[1]);
  if (id === "bookshelf") {
    const shelves = 3, sh = (H - 6) / shelves;
    for (let s = 0; s < shelves; s++) {
      const y1 = -4 - s * sh, y0 = y1 - sh + 2;
      p.rect(-W / 2 + 2, y0, W - 4, sh - 2, C[0]);
      let x = -W / 2 + 3;
      while (x < W / 2 - 4) {
        const r = rand(x, s, 5), bw = r < 0.3 ? 3 : 2, bh = Math.round(sh - 4 - r * 3), col = [RED, WATER, LEAF, GOLD, VIOLET][Math.floor(r * 5 * 7) % 5];
        if (rand(x, s, 9) < 0.12 && s === 1) { round(p, x + 2, y1 - 4, 2.5, 2.5, LEAF); x += 6; continue; }
        if (rand(x, s, 11) < 0.1) { p.line(x, y1 - 1, x + 3, y1 - bh, col[2]); x += 4; continue; }
        p.rect(x, y1 - bh, bw, bh, col[2]); p.line(x, y1 - bh, x, y1 - 1, col[3]); p.px(x, y1 - bh + 2, col[4]);
        x += bw + (r > 0.8 ? 1 : 0);
      }
      p.line(-W / 2 + 1, y1, W / 2 - 2, y1, C[3]);
    }
  } else if (id === "wardrobe") {
    for (const x of [-W / 2 + 2, 1]) {
      p.rect(x, -H + 3, 10, H - 7, C[1]); p.rect(x + 1, -H + 4, 8, H - 9, C[2]);
      p.rect(x + 2, -H + 6, 6, 12, C[1]); p.rect(x + 2, -H + 21, 6, 12, C[1]); p.line(x + 2, -H + 6, x + 7, -H + 6, C[3]);
      knob(p, x === 1 ? 2 : -3, -H + 20);
    }
    p.line(-W / 2 + 1, -H + 2, W / 2 - 2, -H + 2, C[4]);
    for (const x of [-W / 2, W / 2 - 3]) p.rect(x, -1, 3, 2, C[0]);
  } else {
    p.rect(-W / 2 + 2, -H + 2, W - 4, 5, C[1]); p.line(-W / 2 + 2, -H + 2, W / 2 - 3, -H + 2, C[3]);
    for (const x of [-6, 4]) p.line(x, -H + 4, x + 2, -H + 4, GOLD[3]);
    for (const x of [-W / 2 + 2, 1]) { p.rect(x, -H + 8, 11, 11, C[1]); p.rect(x + 1, -H + 9, 9, 9, C[2]); p.line(x + 1, -H + 9, x + 9, -H + 9, C[3]); knob(p, x === 1 ? 2 : -3, -H + 13); }
    p.ellipse(6, -H - 3, 3, 1.4, CREAM[1]); round(p, 6, -H - 6, 2.4, 2.6, LEAF); p.rect(4, -H - 4, 4, 2, RED[2]);
  }
}

// ---------------------------------------------------------------- fire and light
function fire(p, id, C, t, o) {
  if (id === "torch") {
    p.rect(-1, -22, 3, 22, WOOD[0]); p.line(0, -21, 0, -1, WOOD[3]);
    for (let y = -22; y < -16; y += 2) p.line(-2, y, 2, y + 1, CREAM[1]);
    p.ellipse(0, -23, 3, 1.5, WOOD[1]);
    flame(p, 0, -24, 5, 9, t, o.active);
  } else if (id === "street-lamp") {
    p.rect(-4, -3, 8, 3, STEEL[0]); p.rect(-3, -3, 6, 2, STEEL[2]);
    p.rect(-1, -32, 3, 29, STEEL[0]); p.line(0, -31, 0, -4, STEEL[3]);
    for (const a of [-1, 1]) p.line(a * 1, -28, a * 5, -31, STEEL[1]);
    p.poly([[-6, -36], [6, -36], [4, -42], [-4, -42]], STEEL[1]); p.tri(-5, -42, 5, -42, 0, -46, STEEL[0]); p.px(0, -47, STEEL[3]);
    p.rect(-5, -36, 10, 6, o.active ? GOLD[4] : STEEL[1]); p.line(0, -36, 0, -31, STEEL[0]); p.line(-6, -30, 5, -30, STEEL[0]);
    if (o.active) { p.px(-3, -34, hex("#ffffff")); p.glow(0, -33, 18, GOLD[4], 0.55); }
  } else if (id === "campfire") {
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; round(p, Math.cos(a) * 11, -3 + Math.sin(a) * 4, 3.2, 2.4, STONE); }
    p.ellipse(0, -3, 8, 3, WOOD[0]);
    p.beam(-8, -2, 7, -7, 4, WOOD[2]); p.beam(8, -2, -7, -7, 4, WOOD[3]); p.ellipse(7, -7, 1.8, 1.8, WOOD[4]); p.ellipse(-7, -7, 1.8, 1.8, WOOD[4]);
    flame(p, 0, -6, 8, 13, t, o.active);
    if (o.active) vapor(p, 1, -20, t, o.seed, CREAM, 3);
  } else if (id === "brazier") {
    for (const a of [-1, 1]) p.line(a * 3, -9, a * 8, 0, STEEL[0]), p.line(a * 3 + a, -9, a * 8 + a, 0, STEEL[2]);
    p.line(0, -9, 0, -1, STEEL[1]);
    p.ellipse(0, -11, 11, 4, STEEL[0]); p.poly([[-11, -11], [11, -11], [7, -6], [-7, -6]], STEEL[1]); p.line(-10, -10, 10, -10, STEEL[3]);
    for (const x of [-6, 0, 6]) rivet(p, x, -8, STEEL);
    p.ellipse(0, -12, 9, 2.5, WOOD[1]); for (const x of [-5, -1, 4]) p.ellipse(x, -12.5, 2, 1, GOLD[2]);
    flame(p, 0, -13, 8, 12, t, o.active);
  } else if (id === "stove") {
    const w = 26, h = 14;
    for (const x of [-w / 2 + 1, w / 2 - 4]) leg(p, x, 0, 4, STEEL);
    front(p, -w / 2, -3, w, h, STEEL, 1); topFace(p, -w / 2, -3 - h, w, 7, STEEL, 2);
    p.rect(-8, -14, 12, 8, STEEL[0]);
    if (o.active) { p.rect(-7, -10, 10, 3, GOLD[1]); for (let i = 0; i < 3; i++) p.tri(-6 + i * 3, -8, -4 + i * 3, -11 - Math.round(1 + wave(t, 3, i / 3)), -2 + i * 3, -8, GOLD[3]); p.glow(-2, -10, 10, GOLD[4], 0.4); }
    p.line(-8, -15, 3, -15, STEEL[3]); knob(p, 7, -12, STEEL);
    round(p, -3, -h - 6, 6, 3.5, STEEL); p.ellipse(-3, -h - 8, 4.5, 1.4, STEEL[0]); p.ellipse(-3, -h - 8, 3.5, 0.9, o.active ? CREAM[3] : STEEL[1]);
    p.rect(7, -h - 22, 4, 14, STEEL[0]); p.line(8, -h - 22, 8, -h - 9, STEEL[3]);
    if (o.active) vapor(p, -3, -h - 11, t, o.seed, CREAM, 3);
  } else {
    // fireplace: a brick hearth with a stone mantle and a fire behind an iron grate
    const w = 34, h = 26;
    front(p, -w / 2, 0, w, h, RED, 2);
    for (let y = -h + 2; y < -1; y += 3) for (let x = -w / 2 + 1 + ((y / 3) & 1) * 2; x < w / 2 - 1; x += 4) p.px(x, y, RED[1]);
    topFace(p, -w / 2 - 2, -h, w + 4, 4, STONE, 3);
    p.rect(-10, -16, 20, 15, INK); p.arc(0, -16, 10, 3, Math.PI, Math.PI * 2, RED[1]);
    flame(p, 0, -3, 9, 11, t, o.active);
    for (let x = -9; x <= 9; x += 3) p.line(x, -6, x, -1, STEEL[1]);
    p.line(-10, -6, 10, -6, STEEL[2]);
    for (const [x, c] of [[-12, GOLD], [11, VIOLET]]) { p.rect(x, -h - 6, 3, 4, c[2]); p.px(x, -h - 6, c[4]); }
    if (o.active) vapor(p, 0, -h - 3, t, o.seed, CREAM, 2);
  }
}
/** A flame: an outer orange tongue, a yellow core, a white heart, licking on whole loops. */
function flame(p, x, y, w, h, t, on) {
  if (!on) { p.ellipse(x, y, w * 0.5, 1.5, STEEL[0]); return; }
  for (let i = 0; i < 3; i++) {
    const k = [1, 0.7, 0.42][i], c = [RED[3], GOLD[3], GOLD[4]][i], sway = Math.round(wave(t, 2, i * 0.3) * 1.5 * k);
    const hh = h * k * (0.9 + 0.1 * wave(t, 3, i / 3));
    p.poly([[x - w * k * 0.6, y], [x - w * k * 0.4, y - hh * 0.5], [x + sway, y - hh], [x + w * k * 0.45, y - hh * 0.45], [x + w * k * 0.6, y]], c);
  }
  p.px(x, y - 2, hex("#ffffff"));
  p.glow(x, y - h * 0.4, h * 1.6, GOLD[4], 0.45);
}

// ---------------------------------------------------------------- cloth
function fabric(p, id, C, t) {
  if (id === "rug" || id === "carpet") {
    // lying flat on the floor: seen from above, a border, a pattern, a fringe at the ends
    const w = id === "carpet" ? 40 : 30, h = id === "carpet" ? 18 : 14, y = -2;
    if (id === "carpet") { p.ellipse(0, y - h / 2, w / 2, h / 2, C[0]); p.ellipse(0, y - h / 2, w / 2 - 1, h / 2 - 1, C[2]); p.ellipse(0, y - h / 2, w / 2 - 4, h / 2 - 3, (d) => (d > 0.86 ? GOLD[3] : C[1]));
      p.poly([[0, y - h / 2 - 5], [7, y - h / 2], [0, y - h / 2 + 5], [-7, y - h / 2]], GOLD[3]); p.poly([[0, y - h / 2 - 3], [4, y - h / 2], [0, y - h / 2 + 3], [-4, y - h / 2]], C[3]);
      for (const a of [-1, 1]) p.ellipse(a * 12, y - h / 2, 2.2, 1.6, C[4]);
    } else {
      p.rect(-w / 2, y - h, w, h, C[0]); p.rect(-w / 2 + 1, y - h + 1, w - 2, h - 2, GOLD[2]); p.rect(-w / 2 + 3, y - h + 3, w - 6, h - 6, C[2]);
      for (let x = -w / 2 + 5; x < w / 2 - 5; x += 4) p.poly([[x, y - h / 2 - 3], [x + 2, y - h / 2], [x, y - h / 2 + 3], [x - 2, y - h / 2]], C[4]);
      for (let yy = y - h + 1; yy < y; yy += 2) { p.px(-w / 2 - 1, yy, CREAM[4]); p.px(w / 2, yy, CREAM[4]); }
    }
    return;
  }
  const wiggle = wave(t);
  if (id === "flag") {
    p.rect(-12, -36, 2, 36, WOOD[0]); p.line(-11, -35, -11, -1, WOOD[3]); round(p, -11, -37, 1.8, 1.8, GOLD);
    const pts = [], n = 8;
    for (let i = 0; i <= n; i++) { const u = i / n; pts.push([-10 + u * 26, -34 + Math.sin(t * 6.28 + u * 4) * 1.6 * u]); }
    const poly = [...pts, ...pts.slice().reverse().map(([x, y]) => [x, y + 13 - (x + 10) * 0.08])];
    p.poly(poly, (x) => (Math.sin(t * 6.28 + (x + 10) / 26 * 4) > 0.3 ? C[3] : Math.sin(t * 6.28 + (x + 10) / 26 * 4) < -0.4 ? C[1] : C[2]));
    p.polyline(pts, C[0]);
    const cy = -28 + Math.sin(t * 6.28 + 2) * 0.8;
    p.poly([[3, cy - 4], [5, cy - 1], [8, cy - 1], [5.5, cy + 1], [6.5, cy + 4], [3, cy + 2], [-0.5, cy + 4], [0.5, cy + 1], [-2, cy - 1], [1, cy - 1]], GOLD[4]);
  } else {
    // banner: a pennant hung from a crossbar between two posts, an emblem, tassels that swing
    for (const x of [-14, 13]) { p.rect(x, -40, 2, 40, WOOD[0]); p.line(x + 1, -39, x + 1, -1, WOOD[3]); }
    p.rect(-15, -40, 31, 3, WOOD[1]); p.line(-15, -40, 15, -40, WOOD[4]);
    const sw = Math.round(wiggle);
    const pts = [[-9, -37], [9, -37], [9 + sw, -16], [sw, -11], [-9 + sw, -16]];
    p.poly(pts, (x) => (x < -4 ? C[3] : x > 5 ? C[1] : C[2])); p.polyline([...pts, pts[0]], C[0]);
    p.line(-8, -34, 8, -34, GOLD[3]); p.line(-8, -33, 8, -33, GOLD[1]);
    p.circle(sw * 0.5, -25, 4.5, GOLD[1]); p.circle(sw * 0.5, -25, 3.5, GOLD[3]); p.tri(sw * 0.5 - 2, -24, sw * 0.5 + 2, -24, sw * 0.5, -28, C[2]);
    for (const x of [-9, 9]) { p.line(x + sw, -16, x + sw * 2, -10, GOLD[2]); p.px(x + sw * 2, -9, GOLD[4]); }
  }
}

// ---------------------------------------------------------------- on the wall
function wall(p, id, C, t) {
  if (id === "wall-clock") {
    // a long-case clock face over a swinging pendulum
    front(p, -8, -2, 16, 18, WOOD); p.rect(-5, -15, 10, 12, INK); p.rect(-4, -14, 8, 10, WOOD[1]);
    const sw = Math.sin(t * Math.PI * 4) * 3;
    p.line(0, -14, sw, -7, GOLD[2]); p.circle(sw, -6, 2, GOLD[3]); p.px(sw - 1, -7, GOLD[4]);
    p.circle(0, -27, 10, WOOD[0]); p.circle(0, -27, 9, GOLD[2]); p.circle(0, -27, 7.5, CREAM[4]);
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; p.px(Math.cos(a) * 6.3, -27 + Math.sin(a) * 6.3, i % 3 ? CREAM[2] : INK); }
    const h = t * Math.PI * 2 - Math.PI / 2, m = t * Math.PI * 24 - Math.PI / 2;
    p.line(0, -27, Math.cos(h) * 3.5, -27 + Math.sin(h) * 3.5, INK); p.line(0, -27, Math.cos(m) * 5.5, -27 + Math.sin(m) * 5.5, RED[1]);
    p.px(-4, -32, hex("#ffffff"));
  } else if (id === "window") {
    p.rect(-16, -34, 32, 30, WOOD[0]); p.rect(-15, -33, 30, 28, WOOD[3]);
    p.rect(-12, -30, 24, 22, WATER[2]);
    p.shade(-12, -30, 11, -9, (x, y) => (y < -24 ? WATER[3] : (x - y) % 11 < 2 && x - y > 14 ? WATER[4] : 0));
    p.line(0, -30, 0, -9, WOOD[2]); p.line(-12, -20, 11, -20, WOOD[2]);
    for (const a of [-1, 1]) p.poly([[a * 15, -33], [a * 8, -33], [a * 11, -20], [a * 9, -8], [a * 15, -8]], RED[2]), p.line(a * 13, -32, a * 12, -9, RED[3]);
    p.rect(-18, -5, 36, 3, WOOD[1]); p.line(-18, -5, 17, -5, WOOD[4]);
    for (const x of [-10, -4, 3]) { p.rect(x, -9, 4, 4, RED[2]); round(p, x + 2, -11, 2.2, 2, x === -4 ? VIOLET : GOLD); }
  } else {
    // painting: a gilded frame round a landscape
    p.rect(-17, -34, 34, 28, GOLD[0]); p.rect(-16, -33, 32, 26, GOLD[3]); p.rect(-14, -31, 28, 22, GOLD[1]);
    for (const [x, y] of [[-16, -33], [15, -33], [-16, -8], [15, -8]]) p.rect(x - 1, y - 1, 3, 3, GOLD[4]);
    p.rect(-13, -30, 26, 20, WATER[3]); p.rect(-13, -22, 26, 3, WATER[4]);
    p.circle(7, -26, 2.5, GOLD[4]);
    p.poly([[-13, -15], [-6, -23], [0, -18], [5, -21], [13, -14], [13, -10], [-13, -10]], LEAF[2]);
    p.poly([[-6, -23], [-3, -20], [-8, -19]], CREAM[4]);
    p.rect(-13, -13, 26, 3, LEAF[1]); p.px(-4, -12, RED[3]); p.px(2, -12, GOLD[4]);
  }
}

// ---------------------------------------------------------------- doors
function door(p, id, C, t, o) {
  const open = o.open, metal = id === "metal-door", stone = id === "stone-door";
  const F = stone ? STONE : metal ? STEEL : WOOD;
  // the frame: posts and a lintel, an arch for stone
  p.rect(-16, -40, 32, 40, F[0]);
  if (stone) { p.arc(0, -30, 16, 4, Math.PI, Math.PI * 2, STONE[2]); for (let i = 0; i < 7; i++) { const a = Math.PI + i / 6 * Math.PI; p.line(Math.cos(a) * 12, -30 + Math.sin(a) * 12, Math.cos(a) * 16, -30 + Math.sin(a) * 16, STONE[0]); } }
  else { p.rect(-16, -40, 32, 4, F[2]); p.line(-16, -40, 15, -40, F[4]); }
  for (const x of [-16, 13]) { p.rect(x, -36, 3, 36, F[2]); p.line(x, -36, x, -1, F[3]); }
  p.rect(-13, -36, 26, 36, INK);
  const w = open ? 8 : 26, x0 = -13;
  const D = metal ? STEEL : stone ? STONE : WOOD;
  p.rect(x0, -36, w, 36, D[0]); p.rect(x0 + 1, -35, w - 2, 34, D[2]);
  if (stone) {
    p.shade(x0 + 1, -35, x0 + w - 2, -2, (x, y) => (rand(Math.floor(x / 4), Math.floor((y + (Math.floor(x / 4) & 1) * 3) / 6), 2) < 0.5 ? D[3] : 0));
    if (!open) { p.circle(0, -20, 4, VIOLET[1]); p.ring(0, -20, 4, 1, VIOLET[3]); p.px(0, -20, VIOLET[4]); p.glow(0, -20, 9, VIOLET[4], 0.35); }
  } else if (metal) {
    for (const y of [-33, -18, -4]) { p.line(x0 + 1, y, x0 + w - 2, y, D[1]); for (let x = x0 + 2; x < x0 + w - 2; x += 4) rivet(p, x, y - 1, D); }
    if (!open) { p.rect(-8, -28, 16, 3, INK); p.line(-8, -28, 7, -28, D[1]); }
  } else {
    for (let x = x0 + 4; x < x0 + w - 1; x += 5) p.line(x, -35, x, -2, D[1]);
    for (const y of [-31, -8]) { p.rect(x0, y, Math.min(w, 9), 3, STEEL[1]); p.line(x0, y, x0 + Math.min(w, 9) - 1, y, STEEL[3]); }
    p.line(x0 + 1, -35, x0 + 1, -2, D[3]);
  }
  if (!open) { p.circle(8, -18, 1.6, GOLD[1]); p.px(7, -19, GOLD[4]); }
  p.rect(-18, -1, 36, 2, STONE[1]); p.line(-18, -1, 17, -1, STONE[3]);
}

// ---------------------------------------------------------------- garden pieces
function nature(p, id, C, t) {
  const wiggle = wave(t);
  if (id === "flower-pot") {
    for (const [x, c, h] of [[-6, VIOLET, 20], [1, GOLD, 24], [7, RED, 18]]) {
      const sx = x + wiggle * (h / 20);
      p.line(0, -11, sx, -h, LEAF[1]); p.line(x / 2, -16, x / 2 + (x < 0 ? -3 : 3), -18, LEAF[3]);
      for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + t; p.circle(sx + Math.cos(a) * 2, -h + Math.sin(a) * 2, 1.4, c[3]); }
      p.px(sx, -h, GOLD[4]);
    }
    p.poly([[-9, -12], [9, -12], [7, -1], [-7, -1]], RED[1]); p.poly([[-8, -12], [3, -12], [2, -1], [-6, -1]], RED[2]); p.line(-7, -11, -6, -2, RED[3]);
    p.rect(-10, -14, 20, 3, RED[0]); p.rect(-9, -14, 18, 2, RED[3]); p.line(-9, -14, 8, -14, RED[4]);
    p.ellipse(0, -14.5, 8, 1.2, WOOD[0]);
  } else if (id === "fountain") {
    // a round stone basin with water in it, a pedestal with a bowl, water spilling in arcs and ripples
    p.ellipse(0, -5, 22, 9, STONE[0]); p.ellipse(0, -6, 21, 8, STONE[3]); p.ellipse(0, -6, 18, 6.2, STONE[1]);
    p.ellipse(0, -6.5, 17, 5.5, WATER[2]); p.ellipse(-4, -8, 9, 2, WATER[3]);
    for (let i = 0; i < 2; i++) { const r = ((t + i / 2) % 1) * 14; p.ellipse(0, -6.5, r, r * 0.32, (d) => (d > 0.86 ? WATER[4] : 0)); }
    front(p, -21, -2, 42, 4, STONE, 2);
    p.rect(-2, -22, 5, 16, STONE[0]); p.line(-1, -21, -1, -7, STONE[3]);
    p.ellipse(0, -22, 8, 2.6, STONE[0]); p.ellipse(0, -22.5, 7, 1.8, WATER[3]);
    for (let i = 0; i < 10; i++) {
      const u = (t * 2 + i / 10) % 1, s = i % 2 ? 1 : -1, x = s * (4 + u * 11), y = -24 + u * u * 18 - u * 4;
      p.px(x, y, u < 0.5 ? WATER[4] : WATER[3]);
    }
    p.px(0, -27 - Math.round(wave(t, 4)), WATER[4]); p.line(0, -26, 0, -23, WATER[4]);
  } else {
    // statue: a robed figure holding up a torch, on a stepped plinth
    front(p, -12, 0, 24, 5, STONE, 2); topFace(p, -12, -5, 24, 3, STONE, 3);
    front(p, -8, -7, 16, 7, STONE, 2);
    p.poly([[-6, -14], [6, -14], [5, -34], [-4, -34]], STONE[2]); p.poly([[-6, -14], [-1, -14], [-1, -34], [-4, -34]], STONE[3]);
    p.polyline([[-6, -14], [-4, -34], [5, -34], [6, -14]], STONE[0]);
    for (const x of [-3, 0, 3]) p.line(x, -30, x, -15, STONE[1]);
    round(p, 0, -38, 4, 4.3, STONE);
    p.line(4, -33, 8, -44, STONE[1]); p.line(5, -33, 9, -44, STONE[3]); p.poly([[6, -45], [11, -45], [10, -48], [7, -48]], STONE[2]);
    p.px(8, -50, GOLD[4]); p.glow(8, -50, 6, GOLD[4], 0.3);
    p.ellipse(-2, -9, 3, 1, LEAF[2]); p.px(-4, -9, LEAF[4]);
  }
}

// ---------------------------------------------------------------- boards
function sign(p, id, C, t) {
  const quest = id === "quest-board";
  for (const x of [-16, 14]) { p.rect(x, -34, 3, 34, WOOD[0]); p.line(x + 1, -33, x + 1, -1, WOOD[3]); }
  // a little shingled roof over the board
  p.poly([[-20, -34], [20, -34], [16, -40], [-16, -40]], quest ? RED[1] : WOOD[1]);
  for (let x = -17; x < 17; x += 4) p.line(x, -39, x - 1, -35, quest ? RED[2] : WOOD[2]);
  p.line(-16, -40, 15, -40, quest ? RED[3] : WOOD[3]);
  front(p, -15, -9, 30, 23, WOOD, 3);
  grain(p, -14, -31, 28, 21, WOOD, 7, 4);
  const notes = quest ? [[-12, -29, 9, 8, CREAM], [0, -30, 8, 10, GOLD], [-9, -19, 8, 8, CREAM], [5, -18, 8, 7, CREAM]] : [[-12, -29, 8, 9, CREAM], [-1, -28, 10, 7, CREAM], [-8, -18, 9, 7, WATER], [4, -19, 8, 8, CREAM]];
  for (const [x, y, w, h, c] of notes) {
    p.rect(x, y, w, h, c[1]); p.rect(x, y, w - 1, h - 1, c[4]);
    for (let r = y + 2; r < y + h - 2; r += 2) p.line(x + 1, r, x + w - 3 - (r & 2), r, c[2]);
    p.px(x + w / 2, y, RED[3]);
  }
  if (quest) { const b = Math.round(wave(t, 2)); p.rect(-1, -50 + b, 3, 6, GOLD[1]); p.rect(-1, -50 + b, 2, 5, GOLD[4]); p.rect(-1, -43 + b, 2, 2, GOLD[4]); p.glow(0, -46 + b, 8, GOLD[4], 0.4); }
}

// ---------------------------------------------------------------- carts
function wheel(p, x, y, r, t, spin) {
  p.circle(x, y, r, STEEL[0]); p.circle(x, y, r - 1, WOOD[1]); p.circle(x, y, r - 2.2, INK);
  for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI + spin; p.line(x - Math.cos(a) * (r - 2), y - Math.sin(a) * (r - 2), x + Math.cos(a) * (r - 2), y + Math.sin(a) * (r - 2), WOOD[3]); }
  p.circle(x, y, 1.3, STEEL[3]); p.arc(x, y, r - 0.5, 1, Math.PI * 1.1, Math.PI * 1.6, WOOD[4]);
}
function cart(p, id, C, t) {
  if (id === "wheelbarrow") {
    p.line(4, -9, 21, -14, WOOD[0]); p.line(4, -10, 21, -15, WOOD[3]); p.line(2, -6, 20, -10, WOOD[1]);
    p.line(9, -6, 12, 0, STEEL[1]);
    p.poly([[-16, -16], [8, -16], [6, -6], [-10, -6]], WOOD[0]); p.poly([[-15, -15], [7, -15], [5, -7], [-9, -7]], WOOD[2]); p.line(-15, -15, 6, -15, WOOD[4]);
    p.ellipse(-4, -16, 10, 3, WOOD[1]); for (const [x, c] of [[-9, LEAF], [-4, LEAF], [1, LEAF]]) round(p, x, -18, 3, 2.6, c);
    p.ellipse(-4, -16, 10, 3, (d) => (d > 0.82 ? WOOD[3] : 0));
    wheel(p, -12, -3, 5, t, 0);
  } else if (id === "minecart") {
    for (const x of [-10, 10]) wheel(p, x, -2, 4, t, 0.4);
    p.poly([[-17, -18], [17, -18], [14, -5], [-14, -5]], STEEL[0]); p.poly([[-16, -17], [16, -17], [13, -6], [-13, -6]], STEEL[2]);
    p.line(-16, -17, 15, -17, STEEL[4]); for (const x of [-12, 0, 12]) rivet(p, x, -11, STEEL);
    p.line(-15, -13, 14, -13, STEEL[1]);
    for (const [x, c] of [[-9, STONE], [-3, GOLD], [3, STONE], [9, STEEL]]) round(p, x, -19, 3.5, 2.8, c);
    p.px(-3, -21, GOLD[4]);
  } else {
    // market cart: a barrow under a striped awning, crates of produce
    for (const x of [-16, 15]) { p.rect(x, -36, 2, 26, WOOD[0]); p.line(x + 1, -35, x + 1, -11, WOOD[3]); }
    for (let i = 0; i < 7; i++) p.poly([[-20 + i * 6, -40], [-14 + i * 6, -40], [-14 + i * 6, -33], [-17 + i * 6, -31], [-20 + i * 6, -33]], i & 1 ? CREAM[4] : RED[2]);
    p.line(-20, -40, 21, -40, RED[1]);
    front(p, -19, -6, 38, 9, WOOD); topFace(p, -19, -15, 38, 4, WOOD);
    for (const [x, c] of [[-14, RED], [-8, GOLD], [-2, LEAF], [4, RED], [10, VIOLET], [15, GOLD]]) { round(p, x, -18, 2.6, 2.3, c); round(p, x + 2, -16.5, 2.2, 2, c); }
    p.rect(-6, -10, 12, 4, CREAM[4]); p.line(-5, -8, 4, -8, RED[2]);
    for (const x of [-12, 12]) wheel(p, x, -4, 5, t, 0.2);
  }
}

// ---------------------------------------------------------------- track, tanks, piles
function rail(p) {
  for (let y = -26; y < 4; y += 5) { p.rect(-15, y, 30, 3, WOOD[1]); p.line(-15, y, 14, y, WOOD[3]); p.px(-12, y + 1, WOOD[0]); }
  for (const x of [-9, 8]) { p.rect(x, -28, 2, 32, STEEL[0]); p.line(x, -28, x, 3, STEEL[4]); for (let y = -25; y < 4; y += 5) p.px(x - 1, y + 1, STEEL[1]), p.px(x + 2, y + 1, STEEL[1]); }
}
function tankProp(p, id, C, t) {
  if (id === "water-pump") {
    // a cast-iron hand pump on a stone footing, the handle working, water gushing into a bucket
    front(p, -10, 0, 20, 4, STONE, 2); topFace(p, -10, -4, 20, 3, STONE, 3);
    p.rect(-3, -26, 7, 20, STEEL[0]); p.rect(-2, -25, 5, 18, STEEL[2]); p.line(-2, -25, -2, -8, STEEL[3]);
    p.ellipse(0.5, -27, 4.5, 2, STEEL[1]); p.px(-1, -28, STEEL[4]);
    const lift = Math.round(wave(t, 2) * 3);
    p.line(1, -27, -12, -31 - lift, STEEL[0]); p.line(1, -26, -12, -30 - lift, STEEL[2]); round(p, -12, -31 - lift, 1.6, 1.6, STEEL);
    p.rect(4, -22, 7, 3, STEEL[1]); p.line(4, -22, 10, -22, STEEL[3]);
    const flow = lift > 0;
    if (flow) for (let y = -19; y < -9; y++) p.px(10 + ((y + Math.round(t * 20)) & 1), y, WATER[4]);
    front(p, 6, -4, 9, 6, WOOD, 2); p.ellipse(10.5, -10, 4.5, 1.4, WATER[2]); p.line(6, -7, 14, -7, STEEL[2]);
    if (flow) p.px(9, -10, WATER[4]);
  } else {
    // water tank: a banded wooden vat raised on a timber stand
    for (const x of [-12, 9]) { p.rect(x, -14, 3, 14, WOOD[0]); p.line(x + 1, -13, x + 1, -1, WOOD[3]); }
    p.line(-10, -6, 10, -12, WOOD[1]); p.line(-10, -12, 10, -6, WOOD[1]);
    p.rect(-14, -36, 28, 22, WOOD[0]);
    p.shade(-13, -36, 13, -15, (x) => { const u = (x + 13) / 26; return Math.floor(x + 13) % 5 === 0 ? WOOD[1] : u < 0.3 ? WOOD[3] : u > 0.75 ? WOOD[1] : WOOD[2]; });
    for (const y of [-33, -24, -17]) { p.line(-14, y, 13, y, STEEL[1]); p.line(-14, y - 1, 13, y - 1, STEEL[3]); }
    p.ellipse(0, -36, 14, 3.4, WOOD[0]); p.ellipse(0, -36.5, 12.5, 2.4, WATER[2]); p.line(-6 + wave(t) * 2, -37, 5 + wave(t) * 2, -37, WATER[4]);
    p.rect(12, -20, 5, 2, STEEL[1]); p.px(16, -18 + Math.round(t * 4) % 4, WATER[4]);
  }
}
function pile(p, id, C, t, seed) {
  if (id === "wooden-pallet") {
    topFace(p, -16, -4, 32, 14, WOOD, 3);
    for (let y = -16; y < -4; y += 4) p.line(-15, y, 14, y, WOOD[1]);
    for (const x of [-14, -1, 12]) p.rect(x, -17, 3, 13, WOOD[2]);
    front(p, -16, 0, 32, 4, WOOD, 1); for (const x of [-12, -1, 10]) p.rect(x, -3, 3, 2, INK);
  } else if (id === "stone-pile") {
    for (const [x, y, r] of [[-10, -4, 6], [1, -4, 7], [11, -4, 5.5], [-5, -12, 5.5], [6, -12, 5], [0, -19, 4.5]]) {
      const rr = r * (0.9 + rand(x, y, seed) * 0.2);
      p.ellipse(x, y, rr + 0.8, rr * 0.75 + 0.8, STONE[0]); round(p, x, y, rr, rr * 0.75, STONE);
      if (rand(x, y, seed + 1) < 0.5) p.line(x - 1, y - 1, x + 2, y + 1, STONE[1]);
    }
  } else {
    // wood pile: logs stacked in a pyramid, ends showing their rings, a hatchet in the top
    for (const [x, y] of [[-12, -5], [-4, -5], [4, -5], [12, -5], [-8, -12], [0, -12], [8, -12], [-4, -19], [4, -19]]) {
      p.rect(x - 3, y - 3, 7, 7, WOOD[0]);
      p.circle(x, y, 3.6, WOOD[0]); p.circle(x, y, 3, WOOD[4]); p.ring(x, y, 2, 0.8, WOOD[2]); p.px(x, y, WOOD[1]); p.arc(x, y, 3, 0.8, Math.PI * 0.1, Math.PI * 0.9, WOOD[3]);
    }
    p.line(5, -24, 11, -30, WOOD[2]); p.poly([[9, -32], [13, -31], [12, -27], [10, -28]], STEEL[2]); p.px(12, -31, STEEL[4]);
  }
}

/** Draw one non-chest scene prop of the given kind. */
export function drawProp(p, id, kind, C, t, o) {
  if (kind === "table") table(p, id, C, t, o);
  else if (kind === "bed") bed(p, id, C, t);
  else if (kind === "cabinet") cabinet(p, id, C, t, o);
  else if (kind === "fire") fire(p, id, C, t, o);
  else if (kind === "fabric") fabric(p, id, C, t);
  else if (kind === "wall") wall(p, id, C, t);
  else if (kind === "door") door(p, id, C, t, o);
  else if (kind === "nature") nature(p, id, C, t);
  else if (kind === "sign") sign(p, id, C, t);
  else if (kind === "cart") cart(p, id, C, t);
  else if (kind === "rail") rail(p);
  else if (kind === "tank") tankProp(p, id, C, t);
  else if (kind === "pile") pile(p, id, C, t, o.seed);
}

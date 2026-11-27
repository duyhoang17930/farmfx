// Small farm props on a 48 x 48 canvas, drawn 3/4 top-down (top face straight above the front face) with the shared
// helpers in prop-art.js: dark rims, lit left edges, grain, glints. ph is the loop phase 0..1; open is 0..1.
import { asset, CREAM, GOLD, LEAF, RED, STEEL, WOOD, round, wave } from "./art.js";
import { groundShadow, twinkle } from "./sprite.js";
import { clamp, hex, rand } from "../../core/index.js";
import { front, topFace, rivet, band } from "./prop-art.js";

const INK = hex("#1d1826");
const STONE = ["#3b3a4a", "#5d5a68", "#837d88", "#a9a1a6", "#d6cdc5"].map(hex);
function leg(p, x, y, h, C) { p.rect(x, y - h, 3, h, C[0]); p.line(x + 1, y - h, x + 1, y - 1, C[3]); }
/** A tabletop on four legs: the top face seen from above, a thin apron in front. */
function tabletop(p, C, w, h, d = 8) {
  for (const x of [-w / 2 + 2, w / 2 - 5]) leg(p, x, -h + 2, 3, C), leg(p, x, 0, h, C);
  p.line(-w / 2 + 3, -4, w / 2 - 4, -4, C[1]);
  topFace(p, -w / 2, -h, w, d, C); front(p, -w / 2, -h + 3, w, 3, C, 1);
}
function grain(p, x0, y0, w, h, C, seed) {
  for (let y = y0 + 1; y < y0 + h - 1; y += 3) for (let x = x0 + 1; x < x0 + w - 2; x++) if (rand(x, y, seed) < 0.5) p.px(x, y, C[1]);
}

const props = {
  chest(p, C, ph, o, open) {
    const w = 20, h = 9;
    front(p, -w / 2, 0, w, h, C);
    for (const y of [-3, -6]) p.line(-w / 2 + 2, y, w / 2 - 3, y, C[1]);
    for (const x of [-w / 2 + 3, w / 2 - 5]) band(p, x, -h, 0, STEEL);
    // the lid swings up from its back hinge: closed it's a top face, open it stands up showing the gold inside
    const lift = Math.round(open * 8);
    if (lift > 1) {
      p.rect(-w / 2 + 1, -h - 4, w - 2, 4, C[0]);
      for (let i = 0; i < 5; i++) p.ellipse(-6 + i * 3, -h - 2 - (i & 1), 1.8, 1.2, GOLD[3 + (i & 1)]);
      p.glow(0, -h - 3, 10, GOLD[4], 0.4 * open);
      front(p, -w / 2, -h - 4, w, 3 + lift, C, 3);
    } else topFace(p, -w / 2, -h, w, 5, C);
    p.rect(-2, -h - 1, 4, 4, STEEL[1]); p.rect(-1, -h, 2, 2, GOLD[3]); p.px(0, -h + 1, INK);
  },
  barrel(p, C) {
    // a bulging stave cask: shaded round its curve, three iron hoops, a planked head with a bung
    const H = 18, R = 9;
    p.shade(-R - 1, -H, R, 0, (x, y, v) => {
      const yy = (y + H / 2) / (H / 2), r = R - 1.6 * yy * yy;
      if (Math.abs(x + 0.5) > r + 1) return;
      if (Math.abs(x + 0.5) > r) return C[0];
      const u = (x + r) / (2 * r);
      if (Math.floor((x + r) * 5 / (2 * r)) !== Math.floor((x + r - 1) * 5 / (2 * r)) && u > 0.1 && u < 0.9) return C[1];
      return u < 0.22 ? C[3] : u < 0.62 ? C[2] : C[1];
    });
    for (const y of [-3, -9, -15]) { const r = R - 1.6 * ((y + H / 2) / (H / 2)) ** 2; p.line(-r, y, r - 1, y, STEEL[0]); p.line(-r + 1, y - 1, r - 2, y - 1, STEEL[2]); p.px(-r + 2, y - 1, STEEL[4]); }
    p.ellipse(0, -H, R - 1.5, 3, C[0]); p.ellipse(0, -H - 0.3, R - 2.5, 2.2, C[3]);
    for (const x of [-3, 1, 4]) p.line(x, -H - 2, x, -H + 1, C[2]);
    p.circle(2, -H, 1, C[1]); p.px(-4, -H - 1, C[4]);
  },
  crate(p, C) {
    const w = 20, h = 13;
    front(p, -w / 2, 0, w, h, C, 3); topFace(p, -w / 2, -h, w, 6, C, 3);
    for (const y of [-4, -8]) p.line(-w / 2 + 1, y, w / 2 - 2, y, C[1]);
    for (const x of [-4, 3]) p.line(x, -h - 5, x, -h, C[1]);
    p.rect(-w / 2 + 1, -h + 1, 3, h - 2, C[2]); p.rect(w / 2 - 4, -h + 1, 3, h - 2, C[2]);
    p.line(-w / 2 + 3, -2, w / 2 - 4, -h + 2, C[1]); p.line(-w / 2 + 3, -3, w / 2 - 4, -h + 1, C[4]);
    for (const [x, y] of [[-w / 2 + 2, -h + 2], [w / 2 - 3, -h + 2], [-w / 2 + 2, -2], [w / 2 - 3, -2]]) p.px(x, y, STEEL[3]);
  },
  workbench(p, C) {
    tabletop(p, C, 30, 12, 9);
    grain(p, -14, -20, 28, 8, C, 4);
    // a vise at the end, a hammer and a saw on top, shavings, a plank on the shelf below
    p.rect(9, -22, 6, 5, STEEL[0]); p.rect(10, -21, 4, 3, STEEL[2]); p.line(15, -20, 18, -20, STEEL[3]);
    p.line(-11, -16, -4, -19, WOOD[3]); p.rect(-4, -21, 4, 3, STEEL[1]); p.px(-4, -21, STEEL[4]);
    p.poly([[-1, -14], [7, -17], [7, -15], [0, -13]], STEEL[2]); p.line(0, -14, 6, -16, STEEL[4]); p.rect(-3, -14, 3, 2, WOOD[1]);
    for (const [x, y] of [[3, -13], [5, -12], [-7, -13]]) p.px(x, y, CREAM[4]);
    p.rect(-12, -6, 24, 2, C[1]); p.line(-12, -6, 11, -6, C[3]);
  },
  furnace(p, C, ph, o) {
    // a stone smelting furnace: a dome of blocks, an arched mouth glowing, a chimney with smoke
    p.ellipse(0, -10, 13, 12, STONE[0]);
    p.ellipse(0, -10, 12, 11, (d, a) => { const l = -Math.cos(a) * 0.5 - Math.sin(a) * 0.6; return d > 0.9 ? STONE[1] : l > 0.35 ? STONE[3] : l > -0.2 ? STONE[2] : STONE[1]; });
    p.rect(-13, -10, 26, 10, STONE[0]); p.rect(-12, -10, 24, 9, STONE[2]); p.line(-12, -10, -12, -1, STONE[3]);
    for (let y = -18; y < -1; y += 4) for (let x = -11 + ((y / 4) & 1) * 3; x < 11; x += 6) if (Math.hypot(x / 12, (y + 10) / 11) < 0.95 || y > -10) p.line(x, y, x + 3, y, STONE[1]);
    p.rect(-5, -9, 10, 8, INK); p.arc(0, -9, 5, 5, Math.PI, Math.PI * 2, INK);
    if (o.active) {
      const heat = Math.round(wave(ph, 4));
      p.rect(-4, -5, 8, 4, RED[2]); p.ellipse(0, -4, 3, 2, GOLD[3]); p.ellipse(-1, -5 + heat * 0.5, 1.4, 2, GOLD[4]);
      p.glow(0, -6, 12, RED[3], 0.4); p.glow(0, -5, 6, GOLD[4], 0.4);
    }
    p.rect(5, -26, 5, 8, STONE[0]); p.rect(6, -26, 3, 7, STONE[2]); p.line(5, -26, 9, -26, STONE[3]);
    if (o.active) for (let i = 0; i < 3; i++) { const u = (ph + i / 3) % 1; p.disc(7.5 + wave(ph, 1, i * 0.3) * 2 * u, -28 - u * 5, 1.2 + u * 1.3, CREAM[3], 0.4 * (1 - u)); }
  },
  "cooking-pot"(p, C, ph, o) {
    // a pot slung from a tripod over a small log fire
    for (const [x0, x1] of [[-12, -1], [12, 1]]) { p.line(x0, 0, x1, -24, WOOD[0]); p.line(x0 + 1, 0, x1 + 1, -24, WOOD[3]); }
    p.line(0, -24, 0, -19, STEEL[1]);
    if (o.active) {
      for (const [a, b] of [[-6, 4], [6, -4]]) p.beam(a, -1, b, -3, 3, WOOD[2]);
      for (let i = 0; i < 3; i++) { const k = [1, 0.65, 0.35][i], s = Math.round(wave(ph, 2, i * 0.3)); p.tri(-4 * k, -2, 4 * k, -2, s, -2 - 8 * k, [RED[3], GOLD[3], GOLD[4]][i]); }
      p.glow(0, -4, 12, GOLD[4], 0.45);
    }
    p.arc(0, -16, 7, 1, Math.PI * 1.15, Math.PI * 1.85, STEEL[2]);
    round(p, 0, -11, 8.5, 6.5, C); p.ellipse(0, -15, 8, 2.4, C[0]); p.ellipse(0, -15.2, 7, 1.7, o.active ? hex("#c58b4a") : C[1]);
    if (o.active) { p.px(-3, -15, LEAF[4]); p.px(2, -15, RED[3]); for (let i = 0; i < 4; i++) { const u = (ph + i / 4) % 1; p.disc(-4 + i * 3 + wave(ph + i * 0.17), -17 - 9 * u, 1 + 1.5 * u, CREAM[4], 0.42 * (1 - u)); } }
  },
  "crafting-table"(p, C) {
    tabletop(p, C, 28, 12, 10);
    // a crafting mat ruled in a 3 x 3 grid with a few parts laid on it, tools hung on the side
    p.rect(-9, -21, 15, 8, LEAF[1]); p.rect(-8, -20, 13, 6, LEAF[2]);
    for (const x of [-4, 0]) p.line(x, -20, x, -15, LEAF[1]); p.line(-8, -18, 4, -18, LEAF[1]);
    p.px(-6, -19, STEEL[4]); p.rect(-2, -17, 2, 2, WOOD[4]); p.px(2, -19, GOLD[4]);
    p.rect(8, -21, 4, 6, CREAM[3]); p.line(8, -21, 11, -21, CREAM[4]);
    p.line(-13, -8, -13, -4, STEEL[2]); p.rect(-14, -9, 3, 2, STEEL[3]);
    p.line(12, -8, 12, -3, WOOD[3]); p.rect(11, -9, 3, 2, STEEL[1]);
  },
  signpost(p, C, ph, o) {
    p.rect(-1, -26, 3, 26, WOOD[0]); p.line(0, -25, 0, -1, WOOD[3]); p.rect(-2, -27, 5, 2, WOOD[1]);
    const sign = (y, dir, w, label) => {
      const pts = [[-w * dir, y], [w * dir - dir * 3, y], [w * dir, y + 4], [w * dir - dir * 3, y + 8], [-w * dir, y + 8]].map(([x, yy]) => [x + dir * 2, yy]);
      p.poly(pts, C[0]); p.poly(pts.map(([x, yy], i) => [x - (i === 0 || i === 4 ? -dir : i === 2 ? dir : 0), yy + (i < 2 ? 1 : i > 2 ? -1 : 0)]), C[3]);
      p.line(pts[0][0] + dir, y + 1, pts[1][0], y + 1, C[4]);
      if (label) p.text(label, dir * 2 + (dir > 0 ? -w + 2 : w - 2 - p.measure(label)[0]), y + 2, C[0], { font: "mini" });
    };
    sign(-24, 1, 12, [...String(o.label).normalize("NFC")].slice(0, 4).join(""));
    sign(-14, -1, 9, "");
    for (const [x, y] of [[-6, -9], [-3, -11], [-8, -11]]) p.px(x, y, C[1]);
  },
  lamp(p, C, ph, o) {
    // an oil lantern hanging from a crook on an iron post
    p.ellipse(0, 0, 5, 2, STEEL[0]); p.rect(-2, -2, 5, 2, STEEL[2]);
    p.rect(-1, -28, 2, 26, STEEL[0]); p.line(0, -27, 0, -3, STEEL[3]);
    p.polyline([[0, -28], [3, -31], [7, -30], [8, -27]], STEEL[1]);
    p.line(8, -27, 8, -25, STEEL[2]);
    p.rect(5, -25, 7, 2, STEEL[0]); p.rect(5, -16, 7, 2, STEEL[0]);
    p.rect(5, -23, 7, 7, o.active ? C[4] : STEEL[1]); p.rect(6, -22, 5, 5, o.active ? C[3] : STEEL[0]);
    for (const x of [5, 11]) p.line(x, -23, x, -17, STEEL[0]);
    if (o.active) { p.rect(8, -21 + Math.round(wave(ph, 3) * 0.6), 1, 2, hex("#ffffff")); p.glow(8.5, -20, 11, C[3], 0.42 + 0.08 * wave(ph, 3)); }
  },
  bench(p, C) {
    // a park bench: slatted seat and back, iron ends with armrests
    for (const s of [-1, 1]) {
      p.polyline([[s * 12, 0], [s * 12, -9], [s * 13, -18]], STEEL[0]);
      p.polyline([[s * 12, -9], [s * 10, -10], [s * 13, -11]], STEEL[0]);
      p.line(s * 12 - s, -2, s * 12 - s, -8, STEEL[2]);
    }
    for (const y of [-21, -18, -15]) { p.rect(-12, y, 24, 2, C[0]); p.line(-11, y, 10, y, C[y === -21 ? 4 : 3]); }
    topFace(p, -14, -8, 28, 5, C); for (const y of [-11, -9]) p.line(-13, y, 12, y, C[1]);
    front(p, -14, -6, 28, 2, C, 1);
  },
  mailbox(p, C, ph, o, open) {
    p.rect(-1, -13, 3, 13, WOOD[0]); p.line(0, -12, 0, -1, WOOD[3]);
    // a round-topped box: its curved top lit, a door on the front that drops open, a flag on the side
    p.rect(-9, -20, 18, 8, C[0]); p.ellipse(0, -20, 9, 4, C[0]);
    p.rect(-8, -20, 16, 7, C[2]); p.ellipse(0, -20, 8, 3.2, (d, a) => (a > 0 ? 0 : -Math.sin(a) > 0.6 ? C[4] : C[3]));
    p.line(-8, -20, -8, -14, C[3]); p.line(7, -20, 7, -14, C[1]);
    const drop = Math.round(open * 5);
    if (drop > 1) { p.rect(-8, -19, 4, 6, INK); p.rect(-9, -14, 5, drop, C[1]); p.rect(-8, -18, 3, 3, CREAM[4]); }
    else { p.rect(-9, -19, 2, 6, C[1]); p.px(-8, -16, STEEL[4]); }
    const up = open > 0.5;
    p.line(9, -15, 9, up ? -24 : -17, STEEL[1]); p.rect(up ? 9 : 9, up ? -24 : -17, 4, 3, RED[3]); p.px(up ? 9 : 9, up ? -24 : -17, RED[4]);
  },
  "shipping-bin"(p, C, ph, o, open) {
    const w = 30, h = 13;
    front(p, -w / 2, 0, w, h, C);
    for (const y of [-4, -8]) p.line(-w / 2 + 2, y, w / 2 - 3, y, C[1]);
    for (const x of [-w / 2 + 2, w / 2 - 4]) band(p, x, -h, 0, STEEL);
    // a painted crate label with an arrow, and the lid lifting on its hinge
    p.rect(-6, -11, 12, 7, CREAM[3]); p.rect(-5, -10, 10, 5, CREAM[4]);
    p.poly([[-3, -8], [1, -8], [1, -10], [4, -7.5], [1, -5], [1, -7], [-3, -7]], C[1]);
    const lift = Math.round(open * 6);
    if (lift > 1) { p.rect(-w / 2 + 1, -h - 3, w - 2, 3, INK); front(p, -w / 2, -h - 3, w, 3 + lift, C, 3); }
    else topFace(p, -w / 2, -h, w, 6, C);
    for (const x of [-9, 8]) rivet(p, x, -h - 3 - (lift > 1 ? lift : 0), STEEL);
    if (lift > 3) { const k = ph % 1; twinkle(p, -4, -h - 5, 1.6, GOLD[4], GOLD[3]); void k; }
  },
  "hay-bale"(p, C) {
    // a bale seen 3/4: a top face and a front, straw texture in short strokes, two twine bands
    const w = 26, h = 12;
    front(p, -w / 2, 0, w, h, C, 2); topFace(p, -w / 2, -h, w, 7, C, 3);
    for (let i = 0; i < 40; i++) {
      const x = -w / 2 + 2 + rand(i, 1, 3) * (w - 5), y = -h - 6 + rand(i, 2, 3) * (h + 4), top = y < -h;
      p.line(x, y, x + (top ? 2 : 1), y + (top ? 0 : 1), rand(i, 4, 3) < 0.5 ? C[4] : C[1]);
    }
    for (const x of [-6, 5]) { p.line(x, -1, x, -h, WOOD[1]); p.line(x, -h, x, -h - 6, WOOD[1]); p.px(x, -h - 3, WOOD[3]); }
    for (const x of [-w / 2 - 1, w / 2]) p.px(x, -5, C[3]), p.px(x, -9, C[3]);
  },
  "feeding-trough"(p, C, ph, o) {
    // a V trough on splayed legs, grain heaped in it
    for (const s of [-1, 1]) { p.line(s * 11, 0, s * 9, -7, WOOD[0]); p.line(s * 13, 0, s * 9, -7, WOOD[0]); }
    p.poly([[-14, -12], [14, -12], [10, -5], [-10, -5]], C[0]); p.poly([[-13, -11], [13, -11], [9, -6], [-9, -6]], C[2]);
    p.line(-13, -11, 12, -11, C[4]); p.line(-11, -8, 10, -8, C[1]);
    topFace(p, -14, -12, 28, 4, C, 1);
    if (o.active) { p.ellipse(0, -13.5, 11, 2.2, GOLD[2]); for (let i = 0; i < 14; i++) p.px(-10 + rand(i, 1, 5) * 20, -14.5 + rand(i, 2, 5) * 2, rand(i, 3, 5) < 0.5 ? GOLD[4] : GOLD[1]); }
    for (const s of [-1, 1]) p.rect(s * 14 - (s > 0 ? 2 : 0), -13, 2, 6, C[1]);
  },
  beehive(p, C, ph, o) {
    // a stacked box hive on a stand: three supers, a sloped lid, a landing board with bees coming and going
    for (const x of [-8, 6]) p.rect(x, -4, 2, 4, WOOD[0]);
    p.rect(-10, -5, 20, 2, WOOD[1]); p.line(-10, -5, 9, -5, WOOD[3]);
    for (let i = 0; i < 3; i++) { const y = -6 - i * 6; front(p, -9, y, 18, 6, C, i === 1 ? 3 : 2); p.line(-7, y - 3, 6, y - 3, C[1]); }
    p.rect(-3, -8, 6, 2, INK); p.rect(-4, -6, 8, 1, WOOD[3]);
    p.poly([[-11, -24], [11, -24], [8, -29], [-8, -29]], WOOD[1]); p.line(-8, -29, 7, -29, WOOD[4]); p.line(-11, -24, 10, -24, WOOD[0]);
    if (o.active) for (let i = 0; i < 4; i++) {
      const u = (ph + i / 4) % 1, a = u * Math.PI * 2 * (i & 1 ? 1 : -1), x = Math.cos(a + i) * (8 + i * 2), y = -12 + Math.sin(a * 2 + i) * 5 - i * 2;
      p.px(x, y, GOLD[4]); p.px(x + 1, y, INK); p.dot(x, y - 1, hex("#e6f6ff"), 0.7);
    }
    p.px(-6, -18, C[4]); p.px(-6, -12, C[4]);
  },
};

export function farmProp(id, name, desc, palette, options = {}) {
  return asset({ name, desc, tags: ["prop", id], size: [48, 48], origin: [24, 37], palette, options },
    (p, ph, C, o) => { groundShadow(p, 0, 0, 14, 3.2); props[id](p, C, ph, o, o.open < 0 ? (1 + wave(ph, 1, 0.75)) * 0.5 : clamp(o.open ?? 0)); });
}

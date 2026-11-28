// The bodies of the world's creatures (enemies, bosses, wild and farm animals drawn by world-creatures.js), one
// anatomy per family. Shapes are drawn through a scaled painter (p.k = pixels per unit), so a boss gets real extra
// detail and every line stays 1 px. Light comes from the top-left: round parts are shaded as spheres in 4 ramp
// steps with a 1 px dark rim; limbs and panels get a lit side and a shadow side.
import { hex, rand } from "../../core/index.js";

const CACHE = new Map();
const c$ = (s) => CACHE.get(s) ?? (CACHE.set(s, hex(s)), CACHE.get(s));
import { CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, wave } from "./art.js";

const L = [-0.45, -0.62, 0.64];
const BONE = CREAM, CAPE = [c$("#3a2236"), c$("#5e2f45"), c$("#8c3f52"), c$("#b85a62"), c$("#e48a7c")];
const GLOW = { red: c$("#ff6a4d"), gold: c$("#ffd75e"), ice: c$("#bff6ff"), green: c$("#d6f56a"), violet: c$("#e7a4ff") };

/** The ramp step a point on a sphere gets: d 0 at the centre to 1 at the rim, a the angle round it. */
function lit(C, d, a, bias = 0) {
  const nx = Math.cos(a) * d, ny = Math.sin(a) * d, nz = Math.sqrt(Math.max(0, 1 - d * d));
  const l = nx * L[0] + ny * L[1] + nz * L[2] + bias;
  return l > 0.9 ? C[4] : l > 0.55 ? C[3] : l > 0.12 ? C[2] : C[1];
}
/** A shaded ellipse with a 1 px rim: heads, bellies, slimes, eggs. */
export function blob(p, x, y, rx, ry, C, bias = 0) {
  const k = p.k ?? 1, edge = 1 - 1.15 / Math.max(1.5, Math.min(rx, ry) * k);
  p.ellipse(x, y, rx, ry, (d, a) => (d > edge ? C[0] : lit(C, d, a, bias)));
}
/** A shaded limb: dark rim, a lit stripe toward the light. */
function limb(p, x0, y0, x1, y1, w, C, tone = 2) {
  const o = 2 / (p.k ?? 1);
  p.beam(x0, y0, x1, y1, w + o, C[0]);
  p.beam(x0, y0, x1, y1, w, (u, v) => (v < 0.35 ? C[Math.min(4, tone + 1)] : C[tone]));
}
/** A flat shape lit across its width: torsos, robes, wings. lo..hi are its x extent. */
function panel(p, pts, C, lo, hi, tone = 2) {
  const w = hi - lo || 1;
  p.poly(pts, (x) => { const u = (x - lo) / w; return u < 0.28 ? C[Math.min(4, tone + 1)] : u > 0.72 ? C[Math.max(1, tone - 1)] : C[tone]; });
  p.polyline([...pts, pts[0]], C[0]);
}
function glowEye(p, x, y, c) { p.px(x, y, c); p.glow?.(x, y, 3, c, 0.5); }
/** A pair of eyes (one when side-on): dark with a catch-light, or glowing. */
function eyes(p, x, y, side, C, glow, gap = 3) {
  for (const s of side ? [side] : [-1, 1]) {
    const ex = x + s * gap + side * 2;
    if (glow) { glowEye(p, ex, y, glow); glowEye(p, ex + (s < 0 ? -1 : 1) * 0.6, y, glow); continue; }
    p.rect(ex - 1, y - 1, 2, 2, c$("#1d1826"));
    p.px(ex - 1, y - 1, C[4] === undefined ? "#fff" : c$("#f4ecdc"));
  }
}
function crown(p, x, y, w) {
  p.poly([[x - w, y], [x - w, y - 5], [x - w / 2, y - 2.5], [x, y - 7], [x + w / 2, y - 2.5], [x + w, y - 5], [x + w, y]], GOLD[1]);
  p.poly([[x - w + 1, y - 1], [x - w + 1, y - 3.5], [x - w / 2, y - 1.5], [x, y - 5.5], [x + w / 2, y - 1.5], [x + w - 1, y - 3.5], [x + w - 1, y - 1]], GOLD[3]);
  p.line(x - w, y, x + w, y, GOLD[0]);
  p.px(x, y - 3, RED[3]); p.px(x - w + 1, y - 2, WATER[4]); p.px(x + w - 1, y - 2, WATER[4]);
  p.px(x - 1, y - 5, GOLD[4]);
}

// ---------------------------------------------------------------- people and things shaped like them
function humanoid(p, id, f, C, side, back, step, beat) {
  const golem = f === "golem", bone = f === "bone", treant = f === "treant", demon = f === "demon", mummy = f === "mummy";
  const wizard = f === "wizard", lava = id.includes("lava"), crystal = id.includes("crystal"), ice = id.includes("ice");
  const knight = id.includes("knight"), king = /king|pharaoh/.test(id), archer = id.includes("archer");
  const big = golem || treant ? 1.25 : demon ? 1.12 : 1;
  const body = lava ? [c$("#2a2731"), c$("#433c49"), c$("#5e5161"), c$("#836e78"), c$("#b8958f")] : C;
  const skin = bone ? BONE : C;
  const W = 7 * big, top = -21 * big + step - 2 * beat, hy = top - (golem ? 3 : 5.5), hx = side * 2;
  // a cape or a robe hangs behind everything
  if (king && !mummy && !golem) panel(p, [[-W - 2, top + 1], [W + 2, top + 1], [W + 5, -1], [-W - 5, -1]], CAPE, -W - 5, W + 5, back ? 3 : 2);
  if (demon) for (const a of [-1, 1]) {
    const wx = a * (W + 1), wy = top + 2;
    p.poly([[wx, wy], [wx + a * 14, wy - 10], [wx + a * 17, wy - 2], [wx + a * 13, wy + 1], [wx + a * 12, wy + 6], [wx + a * 7, wy + 4]], C[1]);
    p.polyline([[wx, wy], [wx + a * 14, wy - 10], [wx + a * 17, wy - 2]], C[0]);
    for (const t of [0.35, 0.65]) p.line(wx, wy, wx + a * (14 + 3 * t), wy - 10 + 9 * t, C[0]);
  }
  if (demon && !back) p.polyline([[3, -6], [10, -3], [13, -9], [15, -10]], C[1]), p.tri(13, -12, 17, -10, 14, -8, C[2]);
  // legs and feet
  if (wizard) {
    panel(p, [[-W + 1, top + 4], [W - 1, top + 4], [W + 3, 0], [-W - 3, 0]], body, -W - 3, W + 3);
    for (let x = -W; x <= W; x += 3) p.px(x, -1, body[0]);
    p.line(0, top + 6, 0, -1, body[1]);
  } else for (const a of [-1, 1]) {
    const lx = a * (golem ? 4.5 : 3) * big, fx = lx + a * step * 0.6, legW = golem ? 5.5 : bone ? 2 : treant ? 4.5 : 3.2;
    limb(p, lx, top + 12, fx, -2, legW, bone ? BONE : treant ? WOOD : golem ? body : mummy ? BONE : C[0] === skin[0] ? body : body, bone ? 2 : 1);
    if (treant) { p.line(fx, -1, fx + a * 3, 0, WOOD[1]); p.line(fx, -1, fx - a * 2, 0, WOOD[1]); }
    else blob(p, fx + a * 0.5, -1.2, legW * 0.75 + 0.6, 1.6, golem ? body : knight ? STEEL : WOOD);
  }
  // torso
  const tb = top + 13 * big;
  if (!wizard) panel(p, [[-W, top], [W, top], [W - 1.5, tb - 3], [W - 3, tb], [-W + 3, tb], [-W + 1.5, tb - 3]],
    treant ? WOOD : golem ? body : knight ? STEEL : mummy ? BONE : bone ? [c$("#2b2532"), c$("#3f3646"), c$("#5b4e5a"), c$("#7a6a73"), c$("#a3929a")] : demon ? C : [c$("#2c2433"), c$("#4a3a44"), c$("#6a5150"), c$("#8c6c5c"), c$("#b2917a")], -W, W);
  else panel(p, [[-W, top], [W, top], [W + 1, top + 8], [-W - 1, top + 8]], body, -W, W, 3);
  if (bone && !back) { for (let r = 0; r < 3; r++) p.line(-W + 2, top + 3 + r * 2.5, W - 2, top + 3 + r * 2.5, BONE[3 - (r & 1)]); p.line(0, top + 1, 0, tb - 1, BONE[4]); }
  if (mummy) for (let r = 0; r < 4; r++) p.line(-W + 1, top + 2 + r * 3, W - 1, top + 3.5 + r * 3, BONE[r & 1 ? 1 : 4]);
  if (treant) for (let r = 0; r < 4; r++) p.line(-W + 2 + r * 3, top + 2, -W + 3 + r * 3, tb - 2, WOOD[r & 1 ? 1 : 3]);
  if (golem) {
    p.polyline([[-W + 2, top + 3], [-1, top + 6], [1, top + 9], [-2, tb - 2]], lava ? GLOW.gold : body[0]);
    if (lava || crystal) { const c = lava ? GLOW.gold : GLOW.ice; p.poly([[0, top + 4], [2.5, top + 6.5], [0, top + 9], [-2.5, top + 6.5]], c); p.glow?.(0, top + 6.5, 9, c, 0.45); }
  }
  if (knight) { p.line(-W + 1, top + 5, W - 1, top + 5, STEEL[4]); p.rect(-1, top + 1, 2, 10, STEEL[1]); }
  if (!bone && !golem && !mummy && !treant && !wizard && !knight) { p.line(-W + 1, tb - 3, W - 1, tb - 3, WOOD[1]); p.px(0, tb - 3, GOLD[3]); }
  // arms, held things
  for (const a of [-1, 1]) {
    const sx = a * (W - 0.5), reach = a === 1 ? beat * 5 : 0, hx2 = a * (W + 3 + reach), hy2 = top + 11 - beat * 2 + step * a * 0.5;
    const zombie = id === "zombie" || id === "swamp-monster";
    const ex = zombie && !back ? a * (W - 1) : hx2, ey = zombie && !back ? top + 6 : hy2;
    limb(p, sx, top + 2, ex, ey + (zombie ? 0 : 0), golem ? 5 : bone ? 1.8 : treant ? 3.4 : 3, golem ? body : bone ? BONE : treant ? WOOD : wizard ? body : skin, bone ? 2 : 2);
    if (zombie && !back) limb(p, ex, ey, ex + a * 1, ey + 6, 3, skin);
    else if (golem) blob(p, hx2, hy2, 3.6, 3.2, body);
    else if (treant) for (const d of [-1, 0, 1]) p.line(hx2, hy2, hx2 + a * 2 + d * 2, hy2 + 3, WOOD[2]);
    else blob(p, hx2, hy2, 1.8, 1.8, skin);
    if (golem && (crystal || ice)) {
      const x = sx, y = top - 1;
      p.poly([[x - a * 3, y + 3], [x + a * 1, y - 8], [x + a * 5, y - 2], [x + a * 4, y + 3]], crystal ? C[1] : WATER[2]);
      p.poly([[x - a * 1.5, y + 2], [x + a * 1, y - 6], [x + a * 3, y - 2], [x + a * 2.5, y + 2]], crystal ? C[3] : WATER[4]);
    }
    if (lava && a === 1) p.polyline([[sx, top + 2], [sx + 2, top + 5], [sx + 1, top + 8]], GLOW.gold);
  }
  const hand = W + 3 + beat * 5;
  if (wizard) {
    p.line(hand + 1, -1, hand + 1, top - 10, WOOD[1]); p.line(hand + 2, -1, hand + 2, top - 10, WOOD[3]);
    blob(p, hand + 1.5, top - 12, 3, 3, VIOLET); p.glow?.(hand + 1.5, top - 12, 10, GLOW.violet, 0.6); p.px(hand + 0.5, top - 13, c$("#ffffff"));
  }
  if (archer) { p.arc(hand + 2, top + 9, 8, 1.4, -1.3, 1.3, WOOD[3]); p.arc(hand + 2, top + 9, 8, 0.6, -1.3, 1.3, WOOD[1]); p.line(hand + 4.2, top + 1.5, hand + 4.2, top + 16.5, CREAM[4]); }
  if (id === "goblin-warrior" || id === "goblin-king") { limb(p, hand, top + 10, hand + 4, top - 2, 2, WOOD); blob(p, hand + 5, top - 4, 3.2, 3.6, WOOD); for (const [dx, dy] of [[3, -7], [8, -5], [7, -1]]) p.px(hand + dx, top + dy, STEEL[4]); }
  if (knight || id === "dark-knight") {
    p.line(hand, top + 10, hand + 1, top - 8, STEEL[3]); p.line(hand + 1, top + 10, hand + 2, top - 8, STEEL[1]); p.px(hand + 1, top - 9, STEEL[4]);
    p.line(hand - 2, top + 9, hand + 4, top + 9, GOLD[2]);
    if (!back) { panel(p, [[-W - 5, top + 3], [-W + 1, top + 3], [-W + 1, top + 11], [-W - 2, top + 14], [-W - 5, top + 11]], STEEL, -W - 5, -W + 1, 2); p.line(-W - 2, top + 5, -W - 2, top + 12, GOLD[3]); }
  }
  if (id === "desert-pharaoh") { p.line(hand + 1, top + 12, hand + 1, top - 6, GOLD[2]); p.arc(hand - 1, top - 6, 2.5, 1, Math.PI, Math.PI * 2, GOLD[3]); }
  // head
  if (golem) {
    const t2 = hy - (ice ? 7 : crystal ? 6 : 3);
    panel(p, [[hx - 6, hy + 5], [hx - 7, hy - 2], [hx - 3, t2], [hx + 4, t2], [hx + 7, hy - 2], [hx + 6, hy + 5]], body, hx - 7, hx + 7, 2);
    if (!back) eyes(p, hx, hy, side, body, lava ? GLOW.gold : crystal || ice ? GLOW.ice : id === "dark-knight" ? GLOW.red : GLOW.gold, 2.5);
  } else if (treant) {
    blob(p, hx, hy, 7, 6.5, WOOD);
    for (const [x, y, r] of [[-6, -6, 5], [5, -7, 5.5], [0, -10, 5.5], [-9, -1, 3.5], [9, -2, 3.5]]) blob(p, hx + x, hy + y, r, r * 0.85, id.includes("corrupted") ? VIOLET : LEAF);
    if (!back) eyes(p, hx, hy + 1, side, WOOD, id.includes("corrupted") ? GLOW.violet : GLOW.green, 2.5);
  } else if (wizard) {
    blob(p, hx, hy + 1, 6, 5.5, body);
    p.poly([[hx - 8, hy + 1], [hx + 8, hy + 1], [hx + 3, hy - 9], [hx + 6, hy - 15], [hx - 1, hy - 10]], body[1]);
    p.polyline([[hx - 8, hy + 1], [hx - 1, hy - 10], [hx + 6, hy - 15], [hx + 3, hy - 9], [hx + 8, hy + 1]], body[0]);
    p.line(hx - 6, hy, hx + 6, hy, body[3]);
    if (!back) { p.ellipse(hx, hy + 2, 4, 3, c$("#1a1422")); eyes(p, hx, hy + 2, side, body, GLOW.violet, 1.5); }
  } else {
    const hr = bone ? 6 : demon ? 6.5 : 6;
    if (id.startsWith("goblin") || id === "zombie" || id === "swamp-monster" || demon === false && f === "folk")
      for (const a of side ? [-side] : [-1, 1]) { p.tri(hx + a * 4, hy - 2, hx + a * 12, hy - 6, hx + a * 5, hy + 2, skin[1]); p.line(hx + a * 5, hy - 1, hx + a * 10, hy - 5, skin[3]); }
    blob(p, hx, hy, hr, hr * 0.92, mummy ? BONE : skin);
    if (demon) for (const a of [-1, 1]) { p.poly([[hx + a * 3, hy - 4], [hx + a * 7, hy - 9], [hx + a * 6, hy - 13], [hx + a * 9, hy - 9], [hx + a * 6, hy - 3]], CREAM[3]); p.line(hx + a * 6, hy - 12, hx + a * 8, hy - 9, CREAM[1]); }
    if (mummy && id !== "desert-pharaoh") { for (let r = 0; r < 3; r++) p.line(hx - 5, hy - 3 + r * 3, hx + 5, hy - 2 + r * 3, BONE[r & 1 ? 1 : 4]); }
    if (id === "desert-pharaoh") { p.poly([[hx - 7, hy - 3], [hx + 7, hy - 3], [hx + 8, hy + 6], [hx + 4, hy + 2], [hx - 4, hy + 2], [hx - 8, hy + 6]], GOLD[3]); for (let r = 0; r < 3; r++) p.line(hx - 7, hy - 1 + r * 2.5, hx - 5, hy - 1 + r * 2.5, WATER[1]), p.line(hx + 5, hy - 1 + r * 2.5, hx + 7, hy - 1 + r * 2.5, WATER[1]); }
    if (knight && !id.includes("skeleton-king")) { p.ellipse(hx, hy - 1, 6.5, 6, STEEL[2]); p.ellipse(hx - 1, hy - 2, 4.5, 4, STEEL[3]); p.line(hx - 4, hy + 1, hx + 4, hy + 1, c$("#141018")); p.tri(hx - 1, hy - 7, hx + 1, hy - 7, hx, hy - 12, RED[3]); }
    if (!back) {
      if (bone || id === "skeleton-king") { for (const a of side ? [side] : [-1, 1]) p.ellipse(hx + a * 2.5 + side * 2, hy, 1.6, 1.8, c$("#191420")); p.px(hx + side * 2, hy + 2, c$("#191420")); for (let j = -2; j <= 2; j++) p.px(hx + j + side * 2, hy + 4, j & 1 ? BONE[1] : BONE[4]); glowEye(p, hx - 2.5 + side * 2, hy, GLOW.red); if (!side) glowEye(p, hx + 2.5, hy, GLOW.red); }
      else if (id === "desert-pharaoh") { blob(p, hx, hy + 1, 4.5, 4.8, GOLD); for (const s2 of side ? [side] : [-1, 1]) { p.line(hx + s2 * 2.5 - 1 + side, hy, hx + s2 * 2.5 + 1 + side, hy, c$("#1d1826")); glowEye(p, hx + s2 * 2.5 + side, hy, GLOW.ice); } p.line(hx - 1 + side, hy + 4, hx + 1 + side, hy + 4, GOLD[1]); p.rect(hx - 0.5 + side, hy + 5, 1, 3, WATER[1]); }
      else if (mummy) glowEye(p, hx + 2 + side * 2, hy, GLOW.gold);
      else if (!knight || id.includes("skeleton")) {
        eyes(p, hx, hy, side, skin, demon ? GLOW.gold : id === "zombie" || id === "swamp-monster" ? GLOW.green : null, 2.5);
        if (id.startsWith("goblin")) { p.px(hx + side * 3, hy + 2, skin[1]); p.px(hx - 2 + side * 2, hy + 4, CREAM[4]); p.px(hx + 2 + side * 2, hy + 4, CREAM[4]); }
        if (demon) p.line(hx - 2 + side * 2, hy + 3.5, hx + 2 + side * 2, hy + 3.5, c$("#2a1218"));
      }
    }
    if (id === "swamp-monster") for (const a of [-1, 0, 1]) p.polyline([[hx + a * 4, hy - 5], [hx + a * 5, hy + 1], [hx + a * 4.5, hy + 8]], LEAF[1]);
  }
  if (king && !id.includes("pharaoh")) crown(p, hx, hy - (golem ? 7 : 5), 5);
}

// ---------------------------------------------------------------- slimes, ghosts, elementals and other odd shapes
function slime(p, id, C, side, back, wind, beat) {
  const a = Math.round(2 * wind + 2 * beat), y = -8 + a * 0.5, rx = 12 + a, ry = 9 - a * 0.6;
  p.ellipse(0, -0.5, rx + 1, 2.4, C[0], 0.55);
  p.poly([[-rx, -1], [rx, -1], [rx * 0.86, y - ry * 0.55], [0, y - ry], [-rx * 0.86, y - ry * 0.55]], C[0]);
  blob(p, 0, y, rx, ry, C, 0.08);
  p.ellipse(-rx * 0.35, y - ry * 0.45, rx * 0.3, ry * 0.2, C[4]);
  p.px(-rx * 0.5, y - ry * 0.2, c$("#ffffff"));
  for (const [dx, dy, r] of [[4, 2, 1.6], [-2, 4, 1], [7, -1, 1]]) p.ellipse(dx, y + dy, r, r, C[1]);
  if (!back) {
    const ex = side * 3;
    for (const s of side ? [side] : [-1, 1]) { p.ellipse(ex + s * 3.5, y, 1.6, 2.2, c$("#1d1826")); p.px(ex + s * 3.5 - 0.6, y - 1.2, c$("#ffffff")); }
    p.arc(ex, y + 2, 2.4, 1, 0.3, Math.PI - 0.3, c$("#1d1826"));
  }
  if (id.includes("crystal")) for (const [x, h] of [[-4, 7], [1, 10], [5, 6]]) { p.poly([[x - 2, y - ry + 2], [x, y - ry - h + 4], [x + 2, y - ry + 2]], WATER[4]); p.line(x, y - ry - h + 5, x, y - ry + 1, c$("#ffffff")); }
  if (id === "poison-slime") for (const [x, dy] of [[-6, -1], [3, -3], [8, 1]]) { p.ring(x, y - ry * 0.4 + dy, 1.6, 0.8, C[4]); }
  if (id === "red-slime") for (const a2 of [-1, 1]) p.line(a2 * 2 + side * 3, y - 3, a2 * 5 + side * 3, y - 4, c$("#1d1826"));
  if (id === "slime-king") crown(p, 0, y - ry + 1, 6);
}
function ghost(p, id, f, C, side, back, phase, wind, beat) {
  const elemental = f === "elemental", y = -17 + Math.round(2 * wind) - 3 * beat;
  const fire = id.includes("fire"), ice = id.includes("ice"), bolt = id.includes("lightning");
  const glow = fire ? GLOW.gold : ice ? GLOW.ice : bolt ? GLOW.gold : f === "ghost" && id.includes("dark") ? GLOW.red : GLOW.violet;
  // a tapering wisp of a tail that sways
  if (elemental) for (let i = 0; i < 9; i++) {
    const t = i / 8, x = Math.sin(phase * Math.PI * 2 + t * 3) * 3 * t, w = 9 * (1 - t * 0.85);
    p.ellipse(x, y + 4 + t * 12, w, 2.6, i === 8 ? C[1] : t > 0.5 ? C[1] : C[2]);
  } else {
    // a sheet that flares toward a scalloped hem, rippling as it drifts
    const hem = [];
    for (let i = 0; i <= 12; i++) { const u = i / 12, x = -11 + u * 22; hem.push([x + Math.sin(phase * 6.3 + u * 3) * 1.2, y + 13 + (i & 1 ? -2.5 : 1) + Math.sin(phase * 6.3 + u * 6) * 1]); }
    const sheet = [[-9.5, y], [9.5, y], ...hem.reverse()];
    p.poly(sheet, (x) => (x < -3 ? C[3] : x > 5 ? C[1] : C[2]));
    p.polyline([...sheet.slice(1), sheet[0]], C[0]);
  }
  blob(p, 0, y, 9.5, 9, C, 0.05);
  if (fire) for (const [x, h] of [[-5, 8], [0, 12], [5, 9]]) { p.tri(x - 3, y - 6, x + 3, y - 6, x + Math.sin(phase * 12 + x) * 1.5, y - 6 - h, C[3]); p.tri(x - 1.5, y - 6, x + 1.5, y - 6, x, y - 6 - h * 0.55, GLOW.gold); }
  if (ice) for (const [x, h] of [[-6, 6], [-1, 10], [5, 7]]) { p.poly([[x - 2, y - 5], [x, y - 5 - h], [x + 2, y - 5]], WATER[4]); p.line(x, y - 4 - h, x, y - 6, c$("#ffffff")); }
  if (bolt) p.polyline([[-3, y - 12], [1, y - 7], [-1, y - 6], [3, y - 1]], GLOW.gold), p.polyline([[6, y - 10], [8, y - 6], [6, y - 5], [9, y - 1]], GLOW.gold);
  if (elemental) p.glow?.(0, y, 18, glow, 0.35);
  if (!back) {
    eyes(p, 0, y, side, C, elemental || id.includes("dark") ? glow : null, 3);
    if (!elemental) p.ellipse(side * 2, y + 4, 1.6, 2, c$("#1d1826"));
  }
  for (const a of [-1, 1]) blob(p, a * 10, y + 3 + Math.sin(phase * 6.3 + a) * 1.5, 2.4, 3, C);
}
function oddity(p, id, f, C, side, back, phase, wind, beat, bite) {
  const y = -16 + Math.round(2 * wind) - 3 * beat;
  if (f === "mimic") {
    const open = Math.round(2 + 4 * beat);
    panel(p, [[-13, -12], [13, -12], [13, 0], [-13, 0]], WOOD, -13, 13);
    p.rect(-13, -12, 26, 2, GOLD[1]);
    for (let x = -10; x <= 10; x += 4) p.tri(x - 1.5, -12, x + 1.5, -12, x, -9, CREAM[4]);
    p.rect(-12, -14 - open, 24, open + 2, c$("#2a1218"));
    p.ellipse(0, -14 - open + 1, 6, 1.6, RED[3]);
    panel(p, [[-13, -22 - open], [13, -22 - open], [14, -15 - open], [-14, -15 - open]], WOOD, -13, 13, 3);
    for (let x = -10; x <= 10; x += 4) p.tri(x - 1.5, -15 - open, x + 1.5, -15 - open, x, -12 - open, CREAM[4]);
    p.rect(-2, -17 - open, 4, 4, GOLD[3]); p.px(0, -15 - open, c$("#1d1826"));
    if (!back) eyes(p, 0, -19 - open, 0, C, GLOW.gold, 6);
  } else if (f === "snail") {
    blob(p, 6, -3, 9, 3.5, C, 0.1);
    blob(p, -3, -11, 9, 8.5, WOOD);
    p.arc(-3, -11, 5.5, 1.3, 0.3, 5.6, WOOD[0]); p.arc(-3, -11, 2.5, 1, 0.3, 5.6, WOOD[1]);
    for (const x of [10, 13]) { p.line(x, -5, x + 1, -10 + bite / 2, C[2]); p.px(x + 1, -11 + bite / 2, c$("#1d1826")); }
  } else if (f === "mushroom") {
    limb(p, -3, -1, -3 + Math.round(wind), -9, 4, CREAM); limb(p, 3, -1, 3 - Math.round(wind), -9, 4, CREAM);
    blob(p, 0, -10, 7, 6, CREAM);
    p.ellipse(0, y + 2, 15, 9, C[0]); blob(p, 0, y, 14, 8.5, C, 0.1);
    for (const [a, b, r] of [[-7, -3, 2], [1, -6, 2.4], [7, -2, 1.7], [-2, 1, 1.4]]) p.ellipse(a, y + b, r, r * 0.8, CREAM[4]);
    p.line(-13, y + 5, 13, y + 5, C[1]);
    if (!back) { eyes(p, 0, -10, side, CREAM, null, 2.5); p.arc(side * 2, -7, 2, 0.8, 0.2, Math.PI - 0.2, c$("#1d1826")); }
  } else if (f === "plant") {
    limb(p, 0, 0, Math.round(wind * 2), y + 4, 3.5, LEAF);
    for (const a of [-1, 1]) { p.poly([[0, -3], [a * 13, -8], [a * 9, -3]], LEAF[2]); p.line(0, -3, a * 12, -7, LEAF[4]); }
    const jaw = 3 + Math.round(3 * beat + bite);
    blob(p, wind * 2, y - jaw, 10, 6, C); blob(p, wind * 2, y + jaw, 10, 5.5, C, -0.1);
    p.rect(-8 + wind * 2, y - jaw + 3, 16, jaw * 2 - 4, c$("#3a1220"));
    for (let x = -7; x <= 7; x += 3) { p.tri(x - 1 + wind * 2, y - jaw + 3, x + 1 + wind * 2, y - jaw + 3, x + wind * 2, y - jaw + 6, CREAM[4]); p.tri(x - 1 + wind * 2, y + jaw - 1, x + 1 + wind * 2, y + jaw - 1, x + wind * 2, y + jaw - 4, CREAM[4]); }
    for (const [x, dy] of [[-6, -4], [0, -6], [6, -4]]) p.px(x + wind * 2, y - jaw + dy, C[4]);
  } else if (f === "worm") {
    for (let n = 5; n >= 0; n--) {
      const x = -6 + n * 4.5, yy = -6 - n * 0.8 + Math.round(2 * wave(phase, 1, n / 7)), r = 7 - n * 0.6;
      blob(p, x, yy, r, r * 0.8, C);
      p.arc(x, yy, r - 1, 0.8, -2.4, -0.7, C[4]);
    }
    blob(p, -8, -8, 6, 5, C);
    p.ellipse(-12, -7, 3, 3.5, c$("#2a1218"));
    for (const a of [0, 1.2, 2.4, 3.6, 4.8]) p.px(-12 + Math.cos(a) * 2.5, -7 + Math.sin(a) * 2.8, CREAM[4]);
    if (id.includes("queen")) crown(p, -7, -13, 4);
  } else if (f === "jelly") {
    for (let i = 0; i < 5; i++) {
      const x = i * 3.5 - 7, end = y + 14 + Math.round(wave(phase, 1, i / 5) * 3);
      p.polyline([[x, y + 4], [x + 1.5, y + 9], [x - 0.5, end]], C[3]);
    }
    p.ellipse(0, y + 4, 10, 2.5, C[1], 0.8);
    blob(p, 0, y, 10, 8, C, 0.15); p.ellipse(-3, y - 3, 3, 2, C[4], 0.8);
    p.glow?.(0, y, 14, GLOW.violet, 0.3);
  }
}

// ---------------------------------------------------------------- winged things
function winged(p, id, f, C, side, back, phase, wind, bite) {
  const y = -14 + Math.round(3 * wind), flap = wave(phase, f === "bird" ? 1 : 3);
  const dragon = f === "dragon", bee = f === "bee", insect = f === "insect", bat = f === "bat";
  if (dragon) { // tail behind, curling up
    const T = [[0, y + 6], [-6, y + 9], [-12, y + 7], [-15, y + 2]];
    for (let i = 1; i < T.length; i++) limb(p, T[i - 1][0], T[i - 1][1], T[i][0], T[i][1], 4.5 - i, C);
    p.tri(-15, y - 2, -19, y + 3, -13, y + 3, C[3]);
  }
  // wings: a bony leading edge and a membrane with ribs (dragon, bat), feathers (bird), film (insects)
  for (const a of [-1, 1]) {
    const lift = Math.round((dragon ? 6 : 8) * flap), span = dragon ? 19 : bat ? 16 : insect ? 11 : bee ? 9 : 14;
    const root = [a * 4, y - 2], tip = [a * span, y - 10 + lift], mid = [a * span * 0.55, y - 12 + lift * 0.6];
    if (insect || bee) {
      for (const dy of insect && !id.includes("lady") ? [-2, 3] : [0]) { p.ellipse(a * span * 0.55, y - 4 + dy + lift * 0.3, span * 0.5, 3, c$("#dff5ff"), 0.55); p.ellipse(a * span * 0.55, y - 4 + dy + lift * 0.3, span * 0.5, 3, (d) => (d > 0.8 ? c$("#9ec7d8") : 0)); }
    } else if (f === "bird") {
      p.poly([root, [a * span, y - 3 + lift], [a * (span - 2), y + 3 + lift * 0.5], [a * 5, y + 4]], C[1]);
      for (let i = 1; i <= 3; i++) p.line(a * (5 + i * 2.5), y + 4 - i * 0.3, a * (span - 3 + i), y - 1 + lift * 0.8, C[i & 1 ? 0 : 3]);
      p.line(root[0], root[1], a * span, y - 3 + lift, C[3]);
    } else {
      const m = [root, mid, tip, [a * span * 0.85, y + 1 + lift * 0.4], [a * span * 0.6, y - 1 + lift * 0.3], [a * span * 0.42, y + 4], [a * 4, y + 4]];
      p.poly(m, dragon ? C[1] : C[1]);
      p.poly([root, mid, tip, [a * span * 0.7, y - 4 + lift * 0.6], [a * 5, y]], C[2]);
      p.polyline([root, mid, tip], C[0]);
      for (const t of [0.45, 0.75]) p.line(mid[0], mid[1], a * span * (0.4 + t * 0.5), y + 1 + lift * 0.4, C[0]);
      p.line(root[0], root[1] - 1, mid[0], mid[1] - 1, C[3]);
      p.px(tip[0], tip[1] - 1, CREAM[4]);
    }
  }
  const hy = y + bite;
  if (dragon) {
    blob(p, 0, y + 2, 8, 7.5, C);
    p.ellipse(0, y + 4, 4.5, 4.5, (d) => (d > 0.85 ? C[2] : GOLD[3])); for (let r = -2; r <= 3; r += 2.5) p.line(-3, y + 4 + r, 3, y + 4 + r, GOLD[1]);
    for (const a of [-1, 1]) { limb(p, a * 5, y + 7, a * 6, y + 11, 2.6, C); p.px(a * 6 - 1, y + 12, CREAM[4]); p.px(a * 6 + 1, y + 12, CREAM[4]); }
    // neck and head: facing us the snout sits low on the face; side-on it juts forward
    const hx = side * 6, hy2 = y - 11, sx = side ? side * 12 : 0, sy = side ? y - 10 : y - 7;
    limb(p, 0, y - 3, hx, y - 8, 5, C);
    for (const a of side ? [-side] : [-1, 1]) { const bx = hx + a * (side ? 1 : 3); p.poly([[bx - 1, y - 15], [bx + a * 3 - side * 3, y - 23], [bx + 1.5, y - 15]], CREAM[3]); p.line(bx + a * 2 - side * 2, y - 21, bx + 0.5, y - 16, CREAM[1]); }
    blob(p, hx, hy2, 6.5, 5.5, C);
    blob(p, side ? (hx + sx) / 2 + side * 2 : 0, sy, side ? 5 : 4, 3, C, -0.1);
    for (let i = 0; i < 3; i++) p.tri(-1, y - 5 + i * 4, 1, y - 5 + i * 4, 0, y - 8 + i * 4, C[3]);
    const nose = side ? hx + side * 8 : 0;
    if (!back) {
      eyes(p, hx, hy2 - 1, side, C, id.includes("frost") ? GLOW.ice : GLOW.gold, 3);
      if (side) p.px(nose, sy - 1, c$("#1d1826")); else { p.px(-1.5, sy, c$("#1d1826")); p.px(1.5, sy, c$("#1d1826")); }
      const breath = id.includes("frost") ? GLOW.ice : GLOW.gold;
      p.px(nose + side * 1.5, sy + 1, breath); p.glow?.(nose + side * 1.5, sy + 1, 6, breath, 0.4);
    }
    return;
  }
  if (bee) {
    blob(p, 0, hy + 2, 6.5, 5.5, GOLD);
    for (const dy of [0, 3]) p.line(-6, hy + dy, 6, hy + dy, c$("#2a2030"));
    p.tri(-1, hy + 7, 1, hy + 7, 0, hy + 10, c$("#2a2030"));
    blob(p, 0, hy - 5, 4, 3.6, [c$("#1d1826"), c$("#2a2030"), c$("#3c3245"), c$("#564a5d"), c$("#8a7c8e")]);
  } else if (insect) {
    const lady = id.includes("lady"), fly = id.includes("firefly");
    if (lady) { blob(p, 0, hy, 5, 4.5, RED); p.line(0, hy - 4, 0, hy + 4, c$("#1d1826")); for (const [x, yy] of [[-2.5, -1], [2.5, 1], [-2, 2], [2, -2]]) p.px(x, hy + yy, c$("#1d1826")); blob(p, 0, hy - 5, 2.6, 2, [c$("#141018"), c$("#1d1826"), c$("#2a2030"), c$("#3c3245"), c$("#6a5d70")]); }
    else if (fly) { blob(p, 0, hy - 2, 2.5, 3, [c$("#2a2030"), c$("#3c3245"), c$("#564a5d"), c$("#6a5d70"), c$("#8a7c8e")]); p.ellipse(0, hy + 3, 2.8, 3, GOLD[4]); p.glow?.(0, hy + 3, 10, GLOW.green, 0.75); }
    else { for (let i = 0; i < 5; i++) p.ellipse(0, hy + 1 + i * 2.6, 1.8 - i * 0.2, 1.6, C[i & 1 ? 2 : 3]); blob(p, 0, hy - 3, 3.2, 3, C); for (const a of [-1, 1]) p.ellipse(a * 1.6, hy - 3.5, 1.2, 1.4, WATER[4]); }
  } else if (bat) {
    blob(p, 0, hy, 6.5, 6, C);
    for (const a of [-1, 1]) { p.tri(a * 2, hy - 4, a * 6, hy - 11, a * 6, hy - 3, C[1]); p.line(a * 5, hy - 9, a * 5, hy - 5, C[3]); }
    if (!back) { eyes(p, 0, hy - 1, side, C, id.includes("vampire") ? GLOW.red : null, 2.5); p.px(-1 + side * 2, hy + 3, CREAM[4]); p.px(1 + side * 2, hy + 3, CREAM[4]); }
  } else {
    // birds: body, folded tail, head with a beak; species details
    const owl = id === "owl", eagle = id === "eagle", penguin = id === "penguin", parrot = id === "parrot";
    const rooster = id === "rooster", water = /duck|goose/.test(id), turkey = id === "turkey";
    if (turkey) for (let i = -3; i <= 3; i++) { const a = -Math.PI / 2 + i * 0.32; p.beam(0, hy + 2, Math.cos(a) * 13, hy + 2 + Math.sin(a) * 11, 3.4, i & 1 ? WOOD[2] : RED[2]); p.px(Math.cos(a) * 12, hy + 2 + Math.sin(a) * 10, CREAM[4]); }
    if (rooster) for (let i = 0; i < 3; i++) p.arc(-5, hy - 2, 6 - i * 1.5, 1.2, Math.PI * 0.6, Math.PI * 1.4, [LEAF[1], c$("#2a3548"), RED[2]][i]);
    blob(p, 0, hy + 2, 6.5, 6, C);
    if (penguin) p.ellipse(side * 1, hy + 3, 4, 4.5, (d) => (d > 0.85 ? CREAM[2] : CREAM[4]));
    if (owl) for (let i = 0; i < 3; i++) p.line(-2 + i * 2, hy + 3, -1 + i * 2, hy + 5, C[1]);
    const hx = side * 3, headY = hy - (water ? 7 : 5);
    if (water) limb(p, side, hy - 1, hx, headY + 2, 3.2, C);
    blob(p, hx, headY, owl ? 6 : 4.8, owl ? 5 : 4.4, eagle ? CREAM : C);
    if (owl) for (const a of [-1, 1]) p.tri(hx + a * 3, headY - 3, hx + a * 6, headY - 8, hx + a * 5.5, headY - 2, C[1]);
    if (rooster) { p.poly([[hx - 2, headY - 3], [hx - 1, headY - 7], [hx + 1, headY - 5], [hx + 2, headY - 8], [hx + 3, headY - 3]], RED[3]); p.ellipse(hx + side * 2, headY + 3, 1, 1.6, RED[3]); }
    if (parrot) p.line(hx - 3, headY - 2, hx + 3, headY - 2, GOLD[3]);
    if (!back) {
      if (owl) for (const s of side ? [side] : [-1, 1]) { p.ellipse(hx + s * 2.5, headY, 2.3, 2.3, GOLD[4]); p.px(hx + s * 2.5, headY, c$("#1d1826")); }
      else eyes(p, hx, headY - 0.5, side, C, null, 2);
      const bk = water ? GOLD[3] : eagle || parrot ? GOLD[2] : GOLD[3];
      if (water) p.ellipse(hx + side * 3, headY + 2.5, 2.6, 1.4, bk);
      else p.tri(hx + side * 2 - 1.3, headY + 1, hx + side * 2 + 1.3, headY + 1, hx + side * 3.5, headY + (eagle || parrot ? 4 : 3), bk);
    }
    for (const a of [-1, 1]) { p.line(a * 2, hy + 7, a * 2, hy + 10, GOLD[2]); p.line(a * 2, hy + 10, a * 2 + a, hy + 10, GOLD[2]); }
  }
}

// ---------------------------------------------------------------- things on legs (or fins)
function crawler(p, id, f, C, side, back, phase, step, wind, beat, bite, tails) {
  const fish = f === "fish", arach = f === "spider" || id === "scorpion", crab = f === "crab", octo = f === "octopus";
  const y = fish ? -12 : arach || crab ? -8 + step * 0.3 : -10 + step * 0.4;
  if (fish) {
    const sw = Math.round(2 * wave(phase, 2));
    p.poly([[-9, y], [-17, y - 6 + sw], [-15, y], [-17, y + 6 + sw]], C[1]); p.line(-16, y - 4 + sw, -11, y, C[3]);
    p.tri(-2, y - 5, 4, y - 5, -4, y - 10, C[1]);
    blob(p, 0, y, 11, 6, C, 0.05);
    for (let x = -5; x <= 5; x += 3) p.arc(x, y, 3, 0.8, -1, 1, C[1]);
    p.ellipse(1, y + 3, 7, 1.6, C[3]);
    p.ellipse(7, y - 1.5, 1.4, 1.4, c$("#1d1826")); p.px(6.6, y - 2.2, c$("#ffffff"));
    p.line(10, y + 1, 11, y + 1, C[0]);
    if (id.includes("puffer")) for (let a = 0; a < 7; a++) { const t = -2.6 + a * 0.75; p.line(Math.cos(t) * 10, y + Math.sin(t) * 6, Math.cos(t) * 13, y + Math.sin(t) * 8.5, C[3]); }
    if (id.includes("koi")) for (const [x, yy] of [[-4, -2], [2, 1], [-1, -3]]) p.ellipse(x, y + yy, 2, 1.4, CREAM[4]);
    if (id.includes("salmon")) p.line(-8, y + 1, 8, y + 1, RED[4]);
    return;
  }
  if (octo) {
    for (let i = 0; i < 6; i++) {
      const a = Math.PI * (0.15 + i * 0.14), sw = wave(phase, 1, i / 6) * 2, x0 = Math.cos(a) * 6, x1 = Math.cos(a) * 14 + sw;
      p.polyline([[x0, y + 2], [x1, y + 6], [x1 + Math.sign(x1) * 2, y + 9]], C[1]); for (let j = 0; j < 3; j++) p.px(x0 + (x1 - x0) * j / 3, y + 3 + j * 1.3, C[4]);
    }
    blob(p, 0, y - 4, 8.5, 9, C);
    if (!back) eyes(p, 0, y - 1, side, C, null, 3);
    return;
  }
  // legs: arachnids and crabs sprawl, beasts stand
  const legs = arach ? 4 : crab ? 3 : 2;
  for (const a of [-1, 1]) for (let n = 0; n < legs; n++) {
    if (arach || crab) {
      const sx = a * (3 + n * 1.4), kx = a * (10 + n * 2.2), ky = y - 6 + n * 2 + (n + (a > 0 ? 1 : 0)) % 2 * step, fx = a * (13 + n * 2.5);
      p.polyline([[sx, y + n * 1.2], [kx, ky], [fx, 0]], C[0]); p.polyline([[sx, y - 1 + n * 1.2], [kx, ky - 1]], C[3]);
    } else {
      const lx = a * (n ? 5 : 3.5), front = n === 0, sx = lx + (front ? 1 : -1) * step * a * 0.4;
      limb(p, a * (n ? 5.5 : 4), y + 2, sx, -1, 3, C, 1);
      p.rect(sx - 1.4, -1.6, 2.8, 1.6, id.includes("deer") || id.includes("donkey") || id.includes("boar") ? c$("#2a2030") : C[0]);
    }
  }
  if (crab) for (const a of [-1, 1]) { const ex = a * 13, ey = y - 4 - beat * 3; limb(p, a * 6, y - 1, ex, ey, 2.4, C); blob(p, ex + a, ey - 2, 3.5, 3, C); p.line(ex + a * 2, ey - 4, ex + a * 0.5, ey - 1, C[0]); }
  if (id === "scorpion") {
    for (const a of [-1, 1]) { limb(p, a * 5, y - 2, a * 10, y - 8 - beat * 3, 2.2, C); blob(p, a * 11, y - 11 - beat * 3, 3, 2.6, C); p.line(a * 11, y - 13 - beat * 3, a * 11, y - 9 - beat * 3, C[0]); }
    const T = [[0, y + 4], [2, y + 7], [6, y + 4], [7, y - 3], [4, y - 9 - beat * 2]];
    for (let i = 1; i < T.length; i++) blob(p, T[i][0], T[i][1], 2.8 - i * 0.25, 2.6 - i * 0.25, C);
    p.tri(3, y - 11 - beat * 2, 5, y - 11 - beat * 2, 1, y - 14 - beat * 2, CREAM[4]);
  }
  // tail behind the body
  if (tails.has(id)) {
    const fox = id === "fox", sq = id === "squirrel", rac = id === "raccoon", bushy = fox || sq || rac || /wolf/.test(id);
    const tx = -side * 9 || -9, sw = Math.round(wave(phase) * 2);
    if (sq) { blob(p, tx * 0.9, y - 8 + sw, 5, 8, C); p.arc(tx * 0.9, y - 8 + sw, 4, 1, -2, 1, C[4]); }
    else if (bushy) { p.ellipse(tx, y - 2 + sw, 7, 3.4, C[0]); blob(p, tx, y - 2 + sw, 6.4, 3, C); if (fox) p.ellipse(tx - 4.5 * Math.sign(tx), y - 2 + sw, 2.2, 2, CREAM[4]); if (rac) for (const k of [-2, 1, 4]) p.line(tx + k * Math.sign(tx), y - 4 + sw, tx + k * Math.sign(tx), y + sw, c$("#2a2030")); }
    else p.line(0, y, tx * 0.7, y - 3 + sw, C[1]);
  }
  // body
  if (arach) {
    blob(p, -side * 2, y + 3, 8, 7, C); p.ellipse(-side * 2, y + 4, 3, 3.5, id.includes("poison") ? GLOW.green : C[4]);
    blob(p, side * 2, y - 4, 5.5, 4.5, C);
    if (!back) { for (const [ex, ey] of [[-2, -5], [2, -5], [-1, -3], [1, -3]]) glowEye(p, side * 3 + ex, y + ey, id.includes("poison") ? GLOW.green : GLOW.red); p.line(side * 3 - 1.5, y - 1, side * 3 - 1.5, y + 1, CREAM[4]); p.line(side * 3 + 1.5, y - 1, side * 3 + 1.5, y + 1, CREAM[4]); }
    if (id.includes("giant")) for (let a = 0; a < 5; a++) p.px(-side * 2 - 4 + a * 2, y - 1, C[4]);
    return;
  }
  if (crab) {
    p.ellipse(0, y + 1, 11, 6.5, C[0]); blob(p, 0, y, 10, 5.8, C);
    for (const x of [-5, 0, 5]) p.px(x, y - 3, C[4]);
    if (!back) for (const a of side ? [side] : [-1, 1]) { p.line(a * 3, y - 5, a * 3.5, y - 8, C[0]); p.ellipse(a * 3.5, y - 9, 1.4, 1.4, c$("#1d1826")); p.px(a * 3.5 - 0.5, y - 9.6, c$("#ffffff")); }
    if (id === "lobster") { for (let i = 1; i < 4; i++) blob(p, 0, y + 4 + i * 2.5, 5 - i, 2, C); }
    return;
  }
  const turtle = id === "turtle", boar = id.includes("boar"), deer = id === "deer", donkey = id === "donkey";
  const wool = id === "lamb", wolf = id.includes("wolf"), fox = id === "fox";
  if (turtle) {
    blob(p, 0, y - 2, 10, 7, WOOD);
    for (const [x, yy] of [[-4, -4], [3, -4], [-1, 0], [6, 0], [-6, 0]]) { p.ellipse(x, y + yy, 2.6, 2, LEAF[3]); p.ellipse(x, y + yy, 2.6, 2, (d) => (d > 0.7 ? LEAF[1] : 0)); }
    blob(p, side * 9, y + 1, 4, 3.4, C);
    if (!back) eyes(p, side * 9, y, side, C, null, 1.5);
    return;
  }
  blob(p, -side * 2, y, 10, 7, C);
  if (wool) for (const [x, yy] of [[-6, -4], [0, -6], [6, -4], [-7, 1], [7, 1], [-3, 2], [3, 2]]) blob(p, x - side * 2, y + yy, 3.6, 3.2, CREAM);
  if (boar) for (let x = -5; x <= 5; x += 2) p.line(x - side * 2, y - 7, x - side * 2 + 1, y - 10, C[0]);
  if (wolf) for (let x = -4; x <= 4; x += 2) p.line(x, y - 6, x + 1, y - 8, C[1]);
  // head
  const hx = side * 8, hy = y - 6 + bite;
  for (const a of side ? [-side] : [-1, 1]) {
    const ear = donkey ? 9 : deer ? 6 : wolf || fox ? 7 : id === "rabbit" ? 10 : 5;
    p.tri(hx + a * 2.5, hy - 3, hx + a * 4.5, hy - 3 - ear, hx + a * 6, hy - 1, C[1]); p.line(hx + a * 4, hy - 3, hx + a * 4.5, hy - 1 - ear, C[3]);
  }
  if (deer) for (const a of [-1, 1]) { p.polyline([[hx + a * 2, hy - 5], [hx + a * 4, hy - 12], [hx + a * 7, hy - 15]], WOOD[3]); p.line(hx + a * 4, hy - 10, hx + a * 7, hy - 11, WOOD[3]); p.line(hx + a * 3, hy - 8, hx + a * 1, hy - 12, WOOD[3]); }
  blob(p, hx, hy, 6, 5.4, C);
  if (id === "raccoon" && !back) p.rect(hx - 4.5, hy - 1.5, 9, 2.6, c$("#2a2030"));
  if (fox || wolf) p.tri(hx - 2.5 + side * 2, hy + 2, hx + 2.5 + side * 2, hy + 2, hx + side * 5, hy + 6, fox ? CREAM[4] : C[3]);
  if (!back) {
    eyes(p, hx, hy - 0.5, side, C, wolf && id.includes("snow") ? null : null, 2.5);
    const sx = hx + side * 3;
    if (boar) { blob(p, sx, hy + 3, 3, 2.2, RED); for (const a of [-1, 1]) p.polyline([[sx + a * 2.5, hy + 4], [sx + a * 3.5, hy + 1]], CREAM[4]); }
    else p.px(sx, hy + 2.5, c$("#1d1826"));
  }
  if (id === "angry-boar" && !back) p.line(hx - 4 + side * 2, hy - 3, hx - 1 + side * 2, hy - 2, c$("#1d1826")), p.line(hx + 4 + side * 2, hy - 3, hx + 1 + side * 2, hy - 2, c$("#1d1826"));
}

/** Draw one creature, feet at (0, 0). spec: { family, palette }, C its ramp, the rest its pose this frame. */
export function drawCreature(p, spec, id, C, { phase, state, facing, tails }) {
  const side = facing === "left" ? -1 : facing === "right" ? 1 : 0, back = facing === "up", wind = wave(phase);
  const step = ["move", "walk"].includes(state) ? Math.round(2 * wave(phase, 2)) : 0;
  const beat = state.startsWith("attack") ? Math.sin(Math.PI * phase) : 0;
  const bite = state === "eat" ? Math.round(5 * Math.max(0, wave(phase, 2))) : 0;
  const f = spec.family;
  if (bite > 3 && !back) { p.px(side * 10, -2, GOLD[3]); p.px(side * 10 + 2, -1, LEAF[4]); }
  if (f === "slime") slime(p, id, C, side, back, wind, beat);
  else if (["folk", "bone", "golem", "treant", "demon", "mummy", "wizard"].includes(f)) humanoid(p, id, f, C, side, back, step, beat);
  else if (f === "ghost" || f === "elemental") ghost(p, id, f, C, side, back, phase, wind, beat);
  else if (["jelly", "snail", "plant", "mimic", "mushroom", "worm"].includes(f)) oddity(p, id, f, C, side, back, phase, wind, beat, bite);
  else if (["bird", "bat", "bee", "dragon", "insect"].includes(f)) winged(p, id, f, C, side, back, phase, wind, bite);
  else crawler(p, id, f, C, side, back, phase, step, wind, beat, bite, tails);
  void rand; void STEEL; void LEAF;
}

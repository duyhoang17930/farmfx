import { fit, hex, mix, clamp, wrap, lerp, seg, ease, rand, TAU, WHITE } from "../../core/index.js";
import { Grid, toss, spring } from "../_kit/creature.js";
import { twinkle } from "../_kit/sprite.js";

export const meta = {
  name: "Carrot",
  desc: "One tile of tilled soil, top-down 3/4: seed, sprout, feathery fronds, an orange shoulder swelling out, a ripe twinkle, pulled up in a spray of soil. stage 0..4 holds one.",
  tags: ["crop", "carrot", "plant", "grow", "harvest", "vegetable", "loop"],
  size: [32, 48],
  origin: [16, 40],
  duration: 4.8,
  loop: true,
  fps: 30,
  bg: "field",
  options: {
    palette: ["#0c1a0e", "#1a3a16", "#2a5c1e", "#3f8226", "#62a832", "#97cf4a", "#d4f08a"],
    root: ["#3a1406", "#7a2a08", "#c4500e", "#ee7a1a", "#ffa640", "#ffd08a"],
    soil: ["#1a0f08", "#2e1c10", "#4a2e1a", "#664126", "#865a36", "#a87a4c"],
    stage: -1,
    seed: 1,
  },
};

const D = meta.duration;
// the cycle: sprout pops, fronds unfurl, the root swells, it ripens, it's pulled
const T_SPROUT = 0.45, T_LEAF = 0.75, T_ROOT = 1.75, T_RIPE = 2.75, T_PULL = 3.55, T_GONE = 4.15, T_REFILL = 4.4;
const PULL_UP = 0.28, RISE = 18;
const G = new Grid(-16, -40, 32, 48), SOIL = new Grid(-10, -14, 20, 20);

/** The plant's state at loop time t: sprout height, frond growth, root swell, ripe glow, lift out of the ground. */
function state(t, o) {
  if (o.stage >= 0) {
    const s = Math.round(clamp(o.stage, 0, 4));
    return { sprout: s >= 1 ? 1 : 0, leaf: [0, 0.18, 0.7, 1, 1][s], root: [0, 0, 0, 0.55, 1][s], ripe: s === 4 ? 1 : 0, lift: 0, pop: 0, hole: 0, gone: false };
  }
  const sprout = ease.outBack(seg(t, T_SPROUT, T_SPROUT + 0.16));
  const leaf = t < T_LEAF ? 0.18 * sprout : 0.18 + 0.82 * ease.outCubic(seg(t, T_LEAF, T_ROOT));
  const root = ease.inOutSine(seg(t, T_ROOT, T_RIPE));
  const ripe = t >= T_RIPE && t < T_PULL ? 1 : 0;
  const pa = t - T_PULL;
  let lift = 0;
  if (pa > 0 && pa < PULL_UP) lift = 6 * ease.inQuad(pa / PULL_UP);
  else if (pa >= PULL_UP && t < T_GONE) {
    const u = (pa - PULL_UP) / (T_GONE - T_PULL - PULL_UP);
    lift = 6 + RISE * ease.outCubic(u);
  }
  const hole = t >= T_PULL ? 1 - ease.inOutSine(seg(t, T_REFILL, D)) : 0;
  return { sprout, leaf, root, ripe, lift, pop: t - T_SPROUT, pa, hole, gone: t >= T_GONE && t < T_REFILL + 0.2 };
}

/**
 * The tilled tile, seen from above: a 16 x 16 square of dug soil (x -8..8, y -12..4) with soft corners, ploughed in
 * ridges that catch the light on their far side, a lit back lip and a darker front face where it drops to the grass.
 * A planting hole opens at the middle when the carrot comes out.
 */
function tile(p, S, hole) {
  const g = SOIL.clear();
  g.shade(-8, -12, 7, 3, (x, y) => {
    const ax = Math.abs(x), corner = (ax > 7 && (y < -11 || y > 2.5)) ? 1 : 0;
    if (corner) return 0;
    const r = rand(Math.floor(x), Math.floor(y), 5);
    if (y > 2) return S[1];                       // the front face
    if (y < -11) return S[4];                     // the lit back lip
    const ridge = ((Math.floor(y) + 12 + (rand(Math.floor(x / 3), 9) > 0.7 ? 1 : 0)) % 4 + 4) % 4; // ridges across the tile, broken up a little: lit, mid, mid, shade
    let k = ridge === 0 ? 4 : ridge === 3 ? 2 : 3;
    if (r > 0.88) k += 1;
    else if (r < 0.1) k -= 1;
    if (x > 5) k -= 0.5;
    return S[clamp(Math.round(k), 1, 5)];
  });
  if (hole > 0) g.ellipse(0, -0.5, 2.2 * hole + 0.4, 1.1 * hole + 0.3, (nx, ny) => (ny < -0.2 ? S[0] : S[1]));
  g.outline((x, y, nx, ny) => (ny < 0 ? S[0] : mix(S[0], S[1], 0.5)));
  g.draw(p);
}

/** One feathery frond from (x, y) at angle a off vertical, length L: a stem with leaflets in pairs, tips bright. */
function frond(g, C, x, y, a, L, bend) {
  let px = x, py = y;
  const n = Math.max(1, Math.round(L));
  for (let i = 0; i <= n; i++) {
    const u = i / n, ang = a + bend * u * u, sx = Math.sin(ang), cy = -Math.cos(ang);
    px = x + sx * i + bend * u * u * 3;
    py = y + cy * i;
    const c = C[clamp(2 + Math.floor(u * 3.2), 2, 5)];
    g.set(px, py, c);
    // leaflets on alternating sides, sticking out sideways and up a little
    if (i > 1 && i % 2 === 0) {
      const side = (i / 2) % 2 ? 1 : -1, w = u < 0.6 && n > 6 ? 2 : 1;
      for (let k = 1; k <= w; k++) g.set(px + side * k * Math.cos(ang) - sx * 0.3, py - (k === 2 ? 1 : 0), C[clamp(3 + Math.floor(u * 3), 3, 6)]);
    }
  }
  return [px, py];
}

/** The fronds: a fan of four, growing with leaf 0..1, swaying with the wind at loop phase ph. */
function fronds(g, C, leaf, sway, dy, squash) {
  if (leaf <= 0) return;
  const fan = [[-0.62, 0.78], [-0.22, 1], [0.18, 0.95], [0.58, 0.74]];
  if (leaf < 0.25) {
    // the sprout: a stem and two seed leaves
    const h = Math.max(1, Math.round((leaf / 0.18) * 3 * (1 + squash)));
    for (let i = 0; i < h; i++) g.set(0, dy - 1 - i, C[3]);
    const top = dy - h;
    g.set(-1, top, C[4]), g.set(-2, top - 1, C[5]), g.set(1, top, C[4]), g.set(2, top - 1, C[5]);
    return;
  }
  const L = 3 + 8 * ease.outCubic(clamp((leaf - 0.18) / 0.82));
  fan.forEach(([a, k], i) => frond(g, C, i < 2 ? -0.5 : 0.5, dy - 1, a + sway * (0.6 + 0.4 * k), L * k, sway * 0.5 + (i - 1.5) * 0.08));
}

/** The root: just its shoulder above the soil while it grows; the whole tapered carrot when it's out. */
function rootShape(g, R, swell, whole, dy) {
  if (swell <= 0) return;
  const w = 1 + 2 * swell, len = whole ? 9 : 1.5 + 1.2 * swell;
  g.shade(-w - 1, dy - 3, w + 1, dy + len, (x, y) => {
    const v = (y - (dy - 2)) / (len + 2);
    const half = v < 0.2 ? w * Math.sqrt(clamp(v / 0.2 + 0.1)) : w * (1 - ((v - 0.2) / 0.8) ** 1.25);
    if (v < 0 || Math.abs(x) > half + 0.25) return 0;
    let k = 3.3 - (x / Math.max(1, half)) * 1.2 - v * 1.2;
    if (Math.floor(y - dy) % 3 === 1 && v > 0.15 && x > -half + 0.8 && x < half - 0.6) k -= 0.9; // the rings round a carrot
    return R[clamp(Math.round(k), 1, 5)];
  });
}

export function draw(p, t, o) {
  const C = fit(o.palette, 7), R = fit(o.root, 6), S = fit(o.soil, 6), ph = t / D;
  const s = state(t, o), sway = 0.12 * Math.sin(ph * TAU * 3) + 0.05 * Math.sin(ph * TAU * 5 + 1);
  tile(p, S, s.hole);

  // the plant, in its own grid so it gets one outline
  const g = G.clear();
  if (!s.gone) {
    const pullStretch = s.pa > 0 && s.pa < PULL_UP ? 0.25 * (s.pa / PULL_UP) : 0;
    const squash = s.pop > 0 ? 0.35 * spring(s.pop - 0.12, 3, 7) : 0;
    const dy = -Math.round(s.lift), whole = s.lift > 0;
    if ((s.sprout <= 0 && s.lift === 0) || (o.stage < 0 && t >= T_GONE)) {
      // the seed, peeking out of the soil
      g.set(0, -1, S[5]), g.set(1, -1, S[4]);
    } else {
      fronds(g, C, s.leaf, sway * (whole ? 2 : 1), dy - (whole ? 0 : 0), squash);
      rootShape(g, R, Math.max(s.root, whole ? 1 : 0), whole, dy + (whole ? -1 : 0) - Math.round(pullStretch * 4));
    }
    g.outline((x, y, nx, ny) => (ny < 0 && s.root > 0 && y >= dy - 2 && Math.abs(x) < 5 ? R[0] : C[0]));
    // still in the ground: the soil in front of the mound's crown hides the rest of the root
    if (whole && s.lift < 12) g.recolor((x, y, c) => (y > -1 ? 0 : c));
    g.draw(p);
  }

  // ripe: a twinkle hops round the top of the fronds
  if (s.ripe) {
    const k = wrap(t, 0.8) / 0.8, i = Math.floor((o.stage >= 0 ? t : t - T_RIPE) / 0.8);
    const x = Math.round(lerp(-5, 5, rand(i, 7, o.seed))), y = Math.round(lerp(-13, -7, rand(i, 8, o.seed)));
    const size = Math.round(2.4 * Math.sin(Math.PI * k));
    if (size > 0) twinkle(p, x, y, size, hex("#ffe27a"), hex("#fff6c4"));
    if (size > 0) p.light(x, y, hex("#ffd84a"), 0.4 * Math.sin(Math.PI * k));
  }

  // soil: a puff when the sprout pops, a spray when it's pulled
  for (const [t0, n, sp, seedOff] of [[T_SPROUT, 4, 26, 1], [T_PULL + PULL_UP * 0.5, 10, 50, 2]]) {
    if (o.stage >= 0) break;
    const age = t - t0;
    if (age < 0 || age > 0.9) continue;
    for (let i = 0; i < n; i++) {
      const a = lerp(-2.6, -0.5, rand(i, seedOff, o.seed)), v = sp * lerp(0.5, 1, rand(i, seedOff + 9, o.seed));
      const b = toss(lerp(-2, 2, rand(i, 4)), -1, Math.cos(a) * v, Math.sin(a) * v, age, 420, lerp(-9, 3, rand(i, 6)));
      if (b.landed && age - b.at > 0.25) continue;
      const c = S[rand(i, 12) > 0.5 ? 4 : 3];
      p.px(b.x, b.y, c);
      if (rand(i, 13) > 0.6 && !b.landed) p.px(b.x + 1, b.y, S[2]);
    }
  }

  // harvested: the carrot pops into a sparkle at the top of its hop
  if (o.stage < 0 && t >= T_GONE - 0.02 && t < T_GONE + 0.3) {
    const k = seg(t, T_GONE - 0.02, T_GONE + 0.3), y = -Math.round(6 + RISE) + 3;
    twinkle(p, 0, y, Math.round(5 * (1 - k)), R[3], R[5]);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU + 0.3, r = 2 + 6 * ease.outCubic(k);
      if (k < 0.85) p.px(Math.cos(a) * r, y + Math.sin(a) * r * 0.8, i % 2 ? WHITE : R[4]);
    }
    p.glow(0, y, 8, R[4], 0.4 * (1 - k));
  }
}

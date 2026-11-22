import { fit, hex, mix, clamp, lerp, seg, ease, bump, rand, TAU } from "../../core/index.js";
import { Grid } from "../_kit/creature.js";
import { groundShadow } from "../_kit/sprite.js";

export const meta = {
  name: "Chicken",
  desc: "A hen, side-facing (flip for left), top-down 3/4: three grains land around her feet, she pecks each up, flaps, drops a feather, jerks her head about and blinks.",
  tags: ["animal", "chicken", "hen", "bird", "peck", "farm", "loop"],
  size: [48, 48],
  origin: [20, 36],
  duration: 3.2,
  loop: true,
  fps: 30,
  bg: "field",
  options: {
    palette: ["#2a2230", "#5c5266", "#9c92a4", "#cdc6d2", "#ece8f0", "#ffffff"],
    comb: ["#5a0e14", "#b0202a", "#e8423c", "#ff7a66"],
    beak: ["#6a3a0a", "#d88a1a", "#ffc23a", "#ffe48a"],
    grain: ["#6a4a14", "#c89a34", "#f4d868"],
    seed: 1,
  },
};

const D = meta.duration;
const PECKS = [0.7, 1.05, 1.4], PECK = 0.24, T_FLAP = 1.85, FLAP = 0.5;
// grains: where each lands (x, and its own depth y on the ground) and when it's thrown in
const GRAINS = [[11, -2, 0.05], [14, 1, 0.18], [16, -4, 0.3]];
const G = new Grid(-24, -32, 48, 40);
const step = (t) => Math.floor(t * 12) / 12; // the head moves in 12 fps jerks, the way a hen's does

/** How far the head is down into peck i at time t: fast down, a beat on the ground, slower up. */
function peckAt(t) {
  for (let i = 0; i < PECKS.length; i++) {
    const a = t - PECKS[i];
    if (a < 0 || a > PECK) continue;
    return { i, k: a < 0.06 ? ease.outQuad(a / 0.06) : a < 0.11 ? 1 : 1 - ease.inOutSine((a - 0.11) / (PECK - 0.11)), a };
  }
  return { i: -1, k: 0, a: 0 };
}

function pose(t) {
  const pk = peckAt(t), f = seg(t, T_FLAP, T_FLAP + FLAP);
  const flapping = t >= T_FLAP && t < T_FLAP + FLAP;
  // wings beat twice; the body puffs up while they do
  const wing = flapping ? Math.abs(Math.sin(f * TAU * 2)) * bump(f, 0, 1) ** 0.3 : 0;
  const puff = flapping ? 0.12 * bump(f, 0, 1) : 0;
  // idle: the head jerks between a few spots, on 12 fps steps
  const ts = step(t), look = [[0, 0], [1, -1], [1, 0], [-1, 0], [0, -1]];
  const [lx, ly] = t > 2.3 || t < 0.6 ? look[Math.floor(ts * 2.5) % look.length] : [0, 0];
  const blink = (t > 2.72 && t < 2.8) || (t > 0.4 && t < 0.47);
  return { tilt: 0.42 * pk.k, peck: pk.k, pi: pk.i, wing, puff, hx: lx, hy: ly, blink, lift: flapping ? -Math.round(2 * wing) : 0 };
}

function hen(g, C, Cm, Bk, P) {
  g.clear();
  const cs = Math.cos(P.tilt), sn = Math.sin(P.tilt), sy = 1 + P.puff, sx = 1 + P.puff * 0.5;
  // into the hen's own frame: tipped forward round her legs, puffed up
  const local = (x, y) => {
    const dx = x, dy = y + 5;
    return [(dx * cs + dy * sn) / sx, (-dx * sn + dy * cs) / sy - 5];
  };
  const world = (u, v) => {
    const X = u * sx, Y = (v + 5) * sy;
    return [X * cs - Y * sn, X * sn + Y * cs - 5];
  };
  const inBody = (u, v) => ((u + 1) / 7.6) ** 2 + ((v + 9) / 5.6) ** 2 <= 1 || ((u - 4) / 3.6) ** 2 + ((v + 12) / 3.4) ** 2 <= 1;
  const TA = -0.5, tc = Math.cos(TA), ts = Math.sin(TA);
  const inTail = (u, v) => {
    const dx = u + 7, dy = v + 13.5, a = dx * tc + dy * ts, b = -dx * ts + dy * tc;
    return (a / 3.2) ** 2 + (b / 5.4) ** 2 <= 1;
  };
  // body and tail, lit from the top left, darker underneath
  g.shade(-20, -28, 20, 2, (x, y) => {
    const [u, v] = local(x, y);
    if (inTail(u, v)) return inTail(u - 1, v - 1.2) ? (u > -7 ? C[5] : C[4]) : C[3];
    if (!inBody(u, v)) return 0;
    if (!inBody(u + 1.4, v + 2.2)) return C[2];
    if (v > -6) return C[3];
    return inBody(u - 1.5, v - 1.8) && v < -11 ? C[5] : C[4];
  });
  // tail feather lines
  for (const [a, b] of [[[-6.5, -12], [-8.5, -17]], [[-4.8, -11], [-5.8, -16.5]]]) {
    const [x0, y0] = world(...a), [x1, y1] = world(...b);
    g.line(x0, y0, x1, y1, C[2]);
  }
  // the wing: folded on her side, or raised in a beat
  // a fan of feathers from the shoulder: lit on top, grey under, spread wider as it rises
  const wa = 0.22 - P.wing * 1.75 - P.tilt, wl = Math.round(7 + 5 * P.wing), spread = 0.35 + 0.6 * P.wing;
  const [wx, wy] = world(1 + P.wing, -10 - 2 * P.wing);
  if (P.wing > 0.15) {
    // raised: a solid fan, so the silhouette really changes
    const tips = [0, 1, 2].map((f) => {
      const a = wa + (f - 1) * spread * 0.5, len = wl - Math.abs(f - 1) * 1.5 - (f === 2 ? 1 : 0);
      return [wx - Math.cos(a) * len, wy + Math.sin(a) * len];
    });
    g.poly([[wx + 1, wy + 1], [wx - 1, wy - 1.5], ...tips, [wx - 2, wy + 2]], (x, y) => (y < wy - wl * 0.6 ? C[5] : C[4]));
  }
  for (let f = 0; f < 3; f++) {
    const a = wa + (f - 1) * spread * 0.5, len = wl - Math.abs(f - 1) * 1.5 - (f === 2 ? 1 : 0);
    for (let i = 1; i <= len; i++) {
      const u = i / len, x = wx - Math.cos(a) * i, y = wy + Math.sin(a) * i;
      g.set(x, y, f === 0 ? C[5] : f === 1 ? C[4] : C[2]);
      if (P.wing < 0.2 && u < 0.6) g.set(x, y + 1, C[3]);
    }
  }
  if (P.wing > 0.2) g.set(wx, wy, C[3]);
  // neck and head: the head reaches down to the ground in a peck
  const [nx, ny] = world(4, -13);
  const [gx, gy] = GRAINS[Math.max(0, P.pi)];
  const hx = lerp(nx + 1 + P.hx, gx - 2.5, P.peck), hy = lerp(ny - 4 + P.hy + P.lift, gy - 2, P.peck);
  g.tube([[nx, ny], [lerp(nx + 1, hx, 0.5), lerp(ny - 1, hy, 0.5)], [hx, hy]], (u) => lerp(2.4, 2.6, u), (u, v) => (v > 0.6 ? C[3] : C[4]));
  g.ellipse(hx, hy, 2.8, 2.6, (nx2, ny2) => (nx2 + ny2 < -0.6 ? C[5] : ny2 > 0.55 ? C[3] : C[4]));
  // comb on top, wattle under the beak, then the beak
  const dir = P.peck > 0.3 ? 1 : 0;
  for (const [cx, cy, r] of [[-1, -3, 1.2], [0.6, -3.4, 1.3], [2, -2.8, 1]]) g.ellipse(hx + cx + dir, hy + cy + dir * 0.5, r, r, (a, b) => (b < -0.3 ? Cm[3] : Cm[2]));
  g.set(hx + 2, hy + 2, Cm[1]), g.set(hx + 2, hy + 3, Cm[2]), g.set(hx + 3, hy + 2, Cm[1]);
  const bx = hx + 3, by = hy - 0.5 + dir;
  g.set(bx, by, Bk[2]), g.set(bx + 1, by, Bk[3]), g.set(bx, by + 1, Bk[1]), g.set(bx + 2, by + 0.5 * dir, Bk[2]);
  // eye
  if (P.blink) g.set(hx + 1, hy - 0.5, C[2]), g.set(hx, hy - 0.5, C[2]);
  else g.set(hx + 1, hy - 1, hex("#100c14")), g.set(hx + 1, hy - 2, C[5]);
  // legs and toes
  for (const lx of [-2, 1]) {
    const [x0, y0] = world(lx, -4.5);
    g.line(x0, y0, lx, -1, Bk[1]);
    g.set(lx - 1, -1, Bk[1]), g.set(lx + 1, -1, Bk[2]), g.set(lx + 2, -1, Bk[1]);
  }
  g.outline((x, y, ox, oy) => (oy > 0 ? hex("#1a1420") : C[0]));
}

export function drawBack(p, t, o) {
  groundShadow(p, -1, 0, 9, 2.6);
}

export function draw(p, t, o) {
  const C = fit(o.palette, 6), Cm = fit(o.comb, 4), Bk = fit(o.beak, 4), Gr = fit(o.grain, 3), P = pose(t);

  // grains: tossed in from the top right, bounce once, then wait to be pecked up
  GRAINS.forEach(([gx, gy, t0], i) => {
    const eaten = t > PECKS[i] + 0.07, age = t - t0;
    if (age < 0 || eaten) return;
    const fall = 0.28, y = gy + (age < fall ? -26 * (1 - ease.inQuad(age / fall)) : -Math.round(3 * bump(age, fall, fall + 0.16)));
    const x = age < fall ? lerp(gx + 6, gx, ease.outQuad(age / fall)) : gx;
    p.px(x, y - 1, Gr[2]);
    p.px(x + 1, y - 1, Gr[1]);
    p.px(x, y, Gr[0]);
  });

  hen(G, C, Cm, Bk, P);
  G.draw(p);

  // a feather shaken loose in the flap drifts down, rocking, and fades as it lands
  const fa = t - (T_FLAP + 0.2);
  if (fa > 0 && fa < D - T_FLAP - 0.25) {
    const L = D - T_FLAP - 0.25, u = fa / L, x = -6 - 10 * u + 3 * Math.sin(fa * 7), y = -20 + 22 * ease.outQuad(u);
    const tip = Math.sin(fa * 7) > 0 ? 1 : -1;
    const a = u < 0.75 ? 1 : 1 - (u - 0.75) / 0.25;
    p.dot(x, y, C[5], a), p.dot(x + tip, y - 1, C[4], a), p.dot(x - tip, y + 1, C[3], a);
  }

  // a puff of dust off the ground on each peck
  PECKS.forEach((t0, j) => {
    const [gx, gy] = GRAINS[j];
    const a = t - t0 - 0.06;
    if (a < 0 || a > 0.3) return;
    for (let i = 0; i < 3; i++) {
      const s = i - 1, k = a / 0.3;
      p.dot(gx + s * (2 + 4 * k), gy - 2 * k * (1 + (i % 2)), hex("#8a7a64"), 1 - k);
    }
  });
}

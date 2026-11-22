import { fit, hex, mix, clamp, lerp, seg, ease, rand, wrap, TAU, READY } from "../../core/index.js";

export const meta = {
  name: "Water",
  desc: "The farmer tips a watering can over the soil: a fan of drops arcs from the rose, splashes and rings, and a dark wet patch spreads and glistens.",
  tags: ["farming", "water", "watering can", "soil", "wet", "chore", "ground", "one-shot"],
  size: [120, 80],
  origin: [44, 64],
  duration: 2.2,
  loop: false,
  fps: 30,
  bg: "ground",
  actor: 2,
  options: {
    palette: ["#0a1a30", "#16406a", "#2a72a8", "#4ea4d8", "#8cd2f4", "#d4f2ff", "#ffffff"],
    soil: ["#140c06", "#2a1a0e", "#3a2412"],
    seed: 5,
  },
};

// the rose at the end of the spout while it pours (local px), and where the water lands
const ROSE = [17, -12], POUR = 1.2, RATE = 95, GRAV = 380, WET = [25, 9];

// the can carried low at his side, then raised and tipped forward over the patch
const STAND_ = { weapon: "can", crouch: 0, fx: 5, fy: -16, sa: 0, bx: -3, by: -15, ffx: 4, fbx: -3 };
const LIFT = { ...STAND_, crouch: 1, lean: 1, fx: 9, fy: -20, sa: -0.15, bx: 1, by: -17, ffx: 6 };
const TIP = { ...STAND_, crouch: 2, lean: 3, fx: 12, fy: -21, sa: 1.0, bx: 2, by: -18, ffx: 7, fbx: -4 };
export const act = {
  poses: [
    [-0.5, STAND_],
    [-0.22, LIFT],
    [0, TIP, "out"],
    [POUR * 0.5, { ...TIP, sa: 1.1, crouch: 3 }],
    [POUR, { ...TIP, sa: 1.05 }],
    [POUR + 0.22, LIFT, "out"],
    [POUR + 0.6, STAND_],
  ],
};

/** Drop i of the shower: when it left the rose, and its throw. Pure, so the shower is a function of t. */
function drop(i, seed) {
  const t0 = i / RATE + rand(i, 1, seed) * 0.01, sp = lerp(18, 46, rand(i, 2, seed)), a = lerp(0.1, 0.9, rand(i, 3, seed));
  const vx = Math.cos(a) * sp, vy = Math.sin(a) * sp;
  // when it reaches the floor (y = 0) from ROSE: solve y0 + vy t + g t^2 / 2 = 0
  const T = (-vy + Math.sqrt(vy * vy - 2 * GRAV * ROSE[1])) / GRAV;
  return { t0, vx, vy, T, lx: ROSE[0] + vx * T };
}

export function draw(p, t, o) {
  const C = fit(o.palette, 7), S = fit(o.soil, 3);
  const end = meta.duration, fade = 1 - seg(t, end - 0.5, end - 0.04);

  // the wet patch: grows while water lands, darkest in the middle, with glints that come and go
  const wet = ease.outCubic(seg(t, 0.12, POUR + 0.1));
  if (wet > 0 && fade > 0) {
    const rx = 2 + WET[1] * wet, ry = 1 + 1.6 * wet;
    for (let y = -1; y <= 2; y++)
      for (let x = Math.floor(WET[0] - rx - 1); x <= WET[0] + rx + 1; x++) {
        const nx = (x + 0.5 - WET[0]) / rx, ny = (y + 0.5 - 0.6) / ry, d = nx * nx + ny * ny + (rand(x, y, 7) - 0.5) * 0.35;
        if (d > 1) continue;
        p.dot(x, y, y < 0 ? S[2] : d < 0.45 ? S[0] : S[1], fade * (y < 0 ? 0.6 : 1));
      }
    for (let i = 0; i < 5; i++) {
      const ph = wrap(t * 1.3 + rand(i, 9, o.seed), 1);
      if (ph < 0.25 && wet > 0.3) {
        const x = Math.round(WET[0] + (rand(i, 10, o.seed) - 0.5) * 2 * rx * 0.8), y = rand(i, 11) > 0.5 ? 0 : 1;
        p.dot(x, y, ph < 0.12 ? C[6] : C[4], fade);
        p.light(x, y, C[4], 0.25 * fade);
      }
    }
  }

  // the shower: drops leave the rose in a fan, fall, and splash where they land
  const n = Math.ceil(POUR * RATE);
  for (let i = 0; i < n; i++) {
    const d = drop(i, o.seed), age = t - d.t0;
    if (age < 0) break;
    if (age < d.T) {
      const x = ROSE[0] + d.vx * age, y = ROSE[1] + d.vy * age + 0.5 * GRAV * age * age;
      p.px(x, y, i % 3 ? C[4] : C[5]);
      if (age > 0.03) p.dot(x - d.vx * 0.02, y - (d.vy + GRAV * age) * 0.02, C[3], 0.6); // a short tail along its path
      continue;
    }
    const s = age - d.T;
    if (s > 0.16) continue;
    // a splash: two droplets kicked up either side, then a tiny ring on the wet soil
    const k = s / 0.16, h = 3 * k * (1 - k) * 2;
    p.dot(d.lx - 1 - k * 2, -h, C[5], 1 - k);
    p.dot(d.lx + 1 + k * 2, -h, C[4], 1 - k);
    if (k > 0.3) (p.dot(d.lx - 2, 0, C[3], 1 - k), p.dot(d.lx + 2, 0, C[3], 1 - k));
  }

  // after he tips it back up, the rose drips a few times
  for (let j = 0; j < 3; j++) {
    const a = t - (POUR + 0.05 + j * 0.17);
    if (a < 0 || a > 0.5) continue;
    const y = ROSE[1] + 2 + 0.5 * GRAV * a * a;
    if (y < 0) p.px(ROSE[0] - 4 - j, y, C[4]);
  }
  // a soft cool light over the water while it runs
  if (t < POUR + 0.1) p.glow(WET[0], -2, 12, C[3], 0.12 * Math.min(1, t * 5));
}

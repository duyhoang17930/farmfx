import { fit, hex, clamp, lerp, seg, ease, rand, wrap } from "../../core/index.js";
import { groundShadow } from "../_kit/sprite.js";
import { keyed, spots } from "../_kit/person.js";
import { drawWorkingCharacter } from "../characters/_draw.js";

export const meta = {
  name: "Water",
  desc: "Top-down 3/4, four facings: the farmer lifts a watering can and tips it over the tile in front; drops arc down and splash, and a wet patch spreads and glints.",
  tags: ["farming", "water", "watering can", "soil", "wet", "chore", "character", "four-way", "loop"],
  size: [176, 72],
  origin: [88, 48],
  duration: 1.9,
  loop: true,
  fps: 30,
  bg: "field",
  options: {
    facing: "all",
    look: "farmer",
    season: "original",
    colors: null,
    palette: ["#0a1a30", "#16406a", "#2a72a8", "#4ea4d8", "#8cd2f4", "#d4f2ff", "#ffffff"],
    soil: ["#1a1008", "#2e1c10"],
    seed: 5,
  },
};

const POUR0 = 0.42, POUR1 = 1.25, RATE = 70, GRAV = 260, FADE0 = 1.4, FADE1 = 1.82;
const CAN = ["#2c4650", "#5a8590", "#8fb4bc", "#d4eef0"].map(hex);
const ROSE = [6.5, -0.5]; // the rose, from the fist on the handle, can upright and facing right

// per facing (drawn facing right; left is the mirror): the can's grip and tilt over time, where the water lands
// (x range in front, depth range on the ground), and whether the can is behind him
const keysFor = (rest, lift, pour) => [
  [0, rest],
  [0.28, lift],
  [POUR0, pour, "out"],
  [0.85, { ...pour, a: pour.a + 0.1 }],
  [POUR1, pour],
  [1.45, lift],
  [1.7, rest],
  [1.9, rest],
];
const PLAN = {
  right: { keys: keysFor({ grip: [3, -4], a: 0 }, { grip: [6, -8], a: -0.1, lean: 1 }, { grip: [7, -8], a: 1.15, lean: 2 }), land: [0, 4], wet: [13, 2], behind: false },
  down: { keys: keysFor({ grip: [6, -4], a: 0 }, { grip: [7, -7], a: -0.1 }, { grip: [7, -7], a: 1.15 }), land: [5, 10], wet: [11, 8], behind: false },
  up: { keys: keysFor({ grip: [5, -4], a: 0 }, { grip: [5, -14], a: -0.1 }, { grip: [5, -16], a: 1.15 }), land: [-9, -6], wet: [10, -7], behind: true },
};
PLAN.left = PLAN.right;

const rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
const roseAt = (k) => {
  const [rx, ry] = rot(ROSE[0], ROSE[1], k.a);
  return [k.grip[0] + rx, k.grip[1] + ry];
};

/** The can in the person's grid, hanging from the fist by its top handle, tipped by a. */
function can(g, flip, grip, a) {
  const set = (x, y, c) => {
    const [rx, ry] = rot(x, y, a);
    g.set((grip[0] + rx) * flip, grip[1] + ry, c);
  };
  for (let x = -2; x <= 1; x += 0.5) set(x, -0.5, CAN[0]); // the handle arch, over the fist
  for (let y = 0; y <= 5; y += 0.5)
    for (let x = -3; x <= 2; x += 0.5) {
      const c = y < 1 ? CAN[3] : x < -2 ? CAN[2] : x > 1.4 || y > 4.5 ? CAN[0] : y > 2.5 && y < 3.2 ? CAN[0] : CAN[1];
      if (y >= 0.8) set(x, y + 0.5, c);
    }
  for (let u = 0; u <= 1; u += 0.1) set(2 + u * 4, 4 - u * 4.2, u < 0.5 ? CAN[1] : CAN[2]); // the spout
  for (let s = -1; s <= 1; s += 0.5) set(ROSE[0] + s * 0.4, ROSE[1] + s, CAN[3]);
}

export function draw(p, t, o) {
  const C = fit(o.palette, 7), Sl = fit(o.soil, 2);
  for (const { f, x: ox } of spots(o.facing, 44)) {
    const plan = PLAN[f], flip = f === "left" ? -1 : 1, k = keyed(plan.keys, t);
    const fade = 1 - seg(t, FADE0, FADE1), wet = ease.outCubic(seg(t, POUR0 + 0.15, POUR1));
    const wx = ox + plan.wet[0] * flip, wy = plan.wet[1];

    // the wet patch: a translucent dark ellipse, twice as wide as tall, soaked darker in the middle, with glints
    if (wet > 0 && fade > 0) {
      const rx = 1.5 + 5 * wet, ry = 1 + 2.5 * wet;
      for (let y = Math.floor(wy - ry); y <= Math.ceil(wy + ry); y++)
        for (let x = Math.floor(wx - rx); x <= Math.ceil(wx + rx); x++) {
          const d = ((x + 0.5 - wx) / rx) ** 2 + ((y + 0.5 - wy) / ry) ** 2 + (rand(x, y, 7) - 0.5) * 0.3;
          if (d <= 1) p.blend(x, y, d < 0.5 ? Sl[0] : Sl[1], fade * (d < 0.5 ? 0.7 : 0.5));
        }
      for (let i = 0; i < 4; i++) {
        const ph = wrap(t * 1.4 + rand(i, 9, o.seed), 1);
        if (ph < 0.22 && wet > 0.4) p.dot(Math.round(wx + (rand(i, 10, o.seed) - 0.5) * rx * 1.4), Math.round(wy + (rand(i, 11, o.seed) - 0.5) * ry), ph < 0.1 ? C[6] : C[4], fade);
      }
    }

    // the shower: each drop leaves the rose where the can was when it left, falls, and splashes at its own depth
    const shower = () => {
      const n = Math.ceil((POUR1 - POUR0) * RATE);
      for (let i = 0; i < n; i++) {
        const t0 = POUR0 + 0.06 + i / RATE, age = t - t0;
        if (age < 0) break;
        const [rx, ry] = roseAt(keyed(plan.keys, t0)), x0 = ox + rx * flip;
        const vx = lerp(4, 22, rand(i, 2, o.seed)) * flip, vy = lerp(-4, 14, rand(i, 3, o.seed));
        const ly = Math.max(ry + 3, lerp(plan.land[0], plan.land[1], rand(i, 4, o.seed)));
        const T = (-vy + Math.sqrt(vy * vy + 2 * GRAV * (ly - ry))) / GRAV;
        if (age < T) {
          const x = x0 + vx * age, y = ry + vy * age + 0.5 * GRAV * age * age;
          p.px(x, y, i % 3 ? C[4] : C[5]);
          if (age > 0.03) p.dot(x - vx * 0.025, y - (vy + GRAV * age) * 0.025, C[3], 0.6);
          continue;
        }
        const s = (age - T) / 0.16, lx = x0 + vx * T;
        if (s > 1) continue;
        const h = 6 * s * (1 - s);
        p.dot(lx - 1 - s * 2, ly - h, C[5], 1 - s), p.dot(lx + 1 + s * 2, ly - h, C[4], 1 - s);
        if (s > 0.3) for (const [dx, dy] of [[-2, 0], [2, 0], [-1, -1], [1, 1]]) p.dot(lx + dx * (0.6 + s), ly + dy * (0.5 + s * 0.5), C[3], 1 - s);
      }
    };

    groundShadow(p, ox, 0, 6, 2);
    if (plan.behind) shower();
    const tool = (g, fl) => can(g, fl, k.grip, k.a);
    drawWorkingCharacter(p, ox, 0, f, o.look, {
      hands: [k.grip, f === "up" || f === "down" ? [-7, -5] : [k.grip[0] - 2, k.grip[1] + 2]],
      lean: k.lean ?? 0,
      behind: plan.behind ? tool : null, front: plan.behind ? null : tool,
    }, o);
    if (!plan.behind) shower();
    // after he tips it back up, the rose drips a couple of times
    for (let j = 0; j < 2; j++) {
      const a = t - (POUR1 + 0.05 + j * 0.15);
      if (a < 0 || a > 0.4) continue;
      const [rx, ry] = roseAt(keyed(plan.keys, POUR1 + 0.05 + j * 0.15)), y = ry + 0.5 * GRAV * a * a;
      if (y < plan.land[1]) p.px(ox + rx * flip, y, C[4]);
    }
  }
}

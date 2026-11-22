import { fit, hex, clamp, lerp, seg, ease, rand } from "../../core/index.js";
import { toss } from "../_kit/creature.js";
import { groundShadow } from "../_kit/sprite.js";
import { drawPerson, keyed, spots } from "../_kit/person.js";

export const meta = {
  name: "Hoe",
  desc: "Top-down 3/4, four facings: the farmer heaves a hoe overhead and chops the tile in front; clods fly, dust puffs, and a patch of tilled soil opens there.",
  tags: ["farming", "hoe", "till", "soil", "dig", "chore", "character", "four-way", "loop"],
  size: [176, 80],
  origin: [88, 52],
  duration: 1.8,
  loop: true,
  fps: 30,
  bg: "field",
  options: {
    facing: "all",
    look: "farmer",
    soil: ["#1e120a", "#3a2414", "#5a3820", "#7a4e2c", "#9a683a", "#ba8a54"],
    seed: 3,
  },
};

const HIT = 0.5, OPEN = 0.78, FADE0 = 1.3, FADE1 = 1.72;
const WOOD = ["#4a2a14", "#8a5a30", "#b47c44"].map(hex), IRON = ["#3a3c4a", "#7a8094", "#c8ccd8"].map(hex);

// per facing, drawn facing right (left is the mirror): where the chop lands, and the grip and blade over time
const REST_R = { grip: [4, -8], head: [12, 1], lean: 0, bob: 0 };
const REST_D = { grip: [3, -8], head: [7, 3], bob: 0 };
const REST_U = { grip: [3, -9], head: [4, -14], bob: 0 };
const PLAN = {
  right: {
    target: [16, 1], flat: false,
    keys: [
      [0, REST_R],
      [0.3, { grip: [0, -24], head: [-6, -36], lean: -1, bob: -1 }],
      [0.42, { grip: [-1, -26], head: [-8, -37], lean: -1, bob: -1 }],
      [0.46, { grip: [4, -22], head: [13, -28], lean: 1, bob: 0 }, "snap"],
      [HIT, { grip: [6, -11], head: [16, 0], lean: 2, bob: 1 }, "snap"],
      [0.62, { grip: [6, -11], head: [16, 0], lean: 2, bob: 1 }],
      [OPEN, { grip: [5, -10], head: [13, 0], lean: 1, bob: 1 }],
      [1.05, REST_R],
      [1.8, REST_R],
    ],
  },
  down: {
    target: [0, 10], flat: true,
    keys: [
      [0, REST_D],
      [0.3, { grip: [1, -25], head: [1, -38], bob: -1 }],
      [0.42, { grip: [0, -27], head: [0, -40], bob: -1 }],
      [0.46, { grip: [0, -19], head: [0, -4], bob: 0 }, "snap"],
      [HIT, { grip: [0, -10], head: [0, 10], bob: 1 }, "snap"],
      [0.62, { grip: [0, -10], head: [0, 10], bob: 1 }],
      [OPEN, { grip: [0, -9], head: [0, 7], bob: 1 }],
      [1.05, REST_D],
      [1.8, REST_D],
    ],
  },
  up: {
    target: [0, -15], flat: true,
    keys: [
      [0, REST_U],
      [0.3, { grip: [1, -26], head: [1, -38], bob: -1 }],
      [0.42, { grip: [0, -28], head: [0, -41], bob: -1 }],
      [0.46, { grip: [0, -23], head: [0, -32], bob: 0 }, "snap"],
      [HIT, { grip: [0, -17], head: [0, -15], bob: 1 }, "snap"],
      [0.62, { grip: [0, -17], head: [0, -15], bob: 1 }],
      [OPEN, { grip: [0, -16], head: [0, -13], bob: 1 }],
      [1.05, REST_U],
      [1.8, REST_U],
    ],
  },
};
PLAN.left = PLAN.right;

/** The hoe in the person's grid: a wooden shaft from just behind the hands to the head, and the iron blade. */
function hoe(g, flip, grip, head, flat) {
  const set = (x, y, c) => g.set(x * flip, y, c);
  const dx = head[0] - grip[0], dy = head[1] - grip[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  for (let s = -5; s <= L; s += 0.5) set(grip[0] + ux * s, grip[1] + uy * s, s > L - 1 ? WOOD[0] : ux > 0.3 || uy < -0.3 ? WOOD[2] : WOOD[1]);
  if (flat && Math.abs(uy) > 0.6) {
    // seen end-on (facing down or up): the blade is a short bar across the end of the shaft
    for (let x = -2; x <= 2; x++) (set(head[0] + x, head[1], x < 0 ? IRON[2] : IRON[1]), set(head[0] + x, head[1] + 1, IRON[0]));
  } else {
    // side-on: bent back off the shaft, towards the farmer's feet
    const bx = -uy, by = ux;
    for (let s = 0; s <= 4; s += 0.5) (set(head[0] + bx * s, head[1] + by * s, s > 3 ? IRON[2] : IRON[1]), set(head[0] + bx * s + ux, head[1] + by * s + uy, IRON[0]));
  }
}

/** The tilled patch in front of him: flat dug soil, ploughed in ridges, a lit back lip, a dark front edge. */
function patch(p, S, cx, cy, open, fade, seed) {
  if (open <= 0 || fade <= 0) return;
  const rx = 2 + 5 * open, ry = 1 + 2.5 * open;
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const ex = Math.abs(x + 0.5 - cx) / rx, ey = Math.abs(y + 0.5 - cy) / ry;
      if (ex > 1 || ey > 1 || (ex > 0.8 && ey > 0.7)) continue;
      const r = rand(x, y, seed);
      if ((ex > 0.85 || ey > 0.8) && r > 0.6) continue;
      const ridge = (((y - Math.floor(cy)) % 3) + 3) % 3;
      let c = ey > 0.75 && y > cy ? S[1] : ey > 0.75 ? S[4] : S[ridge === 0 ? 4 : ridge === 2 ? 2 : 3];
      if (r > 0.92) c = S[5];
      p.dot(x, y, c, fade);
    }
}

export function draw(p, t, o) {
  const S = fit(o.soil, 6), dust = S[4];
  for (const { f, x: ox } of spots(o.facing, 44)) {
    const plan = PLAN[f], flip = f === "left" ? -1 : 1, k = keyed(plan.keys, t);
    const tx = ox + plan.target[0] * flip, ty = plan.target[1];
    const fade = 1 - seg(t, FADE0, FADE1), open = ease.outCubic(seg(t, HIT, OPEN));

    patch(p, S, tx, ty, open, fade, o.seed);
    groundShadow(p, ox, 0, 6, 2);
    // raised over his head, the hoe is behind it (unless he faces away); lowered, it's in front (unless he faces away)
    const raised = k.head[1] < -26, inFront = raised ? f === "up" : f !== "up";
    const tool = (g, fl) => hoe(g, fl, k.grip, k.head, plan.flat);
    const far = [k.grip[0] - (k.head[0] - k.grip[0]) * 0.18, k.grip[1] - (k.head[1] - k.grip[1]) * 0.18];
    drawPerson(p, ox, 0, f, o.look, {
      hands: [k.grip, far], lean: k.lean ?? 0, bob: Math.round(k.bob ?? 0),
      behind: inFront ? null : tool, front: inFront ? tool : null,
    });

    // the bite: clods thrown up from the tile, landing at their own depths, and a puff of dust
    const age = t - HIT;
    if (age >= 0 && age < 0.9) {
      for (let i = 0; i < 8; i++) {
        const a = lerp(-2.7, -0.45, rand(i, 1, o.seed)), v = lerp(35, 70, rand(i, 2, o.seed));
        const b = toss(tx + lerp(-2, 2, rand(i, 3)), ty - 1, Math.cos(a) * v, Math.sin(a) * v, age, 420, ty + lerp(-3, 3, rand(i, 4, o.seed)));
        if (b.landed && age - b.at > 0.3) continue;
        const c = S[rand(i, 5) > 0.5 ? 4 : 3];
        p.px(b.x, b.y, c);
        if (i % 3 === 0) (p.px(b.x + 1, b.y, S[2]), p.px(b.x, b.y - 1, S[5]));
      }
      for (let i = 0; i < 4; i++) {
        const u = age / 0.7, dx = (i - 1.5) * (3 + 6 * u);
        if (u < 1) p.disc(tx + dx, ty - 1 - 3 * u - (i % 2), 1.5 + 2 * u, dust, 0.55 * (1 - u));
      }
      if (age < 0.05) for (const [dx, dy] of [[0, -1], [-2, -1], [2, -1], [-1, -2], [1, -2]]) p.px(tx + dx, ty + dy, hex("#fff2c8"));
    }
  }
}

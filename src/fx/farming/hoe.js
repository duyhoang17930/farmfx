import { Particles, Bits, P, B, Rng, fit, hex, clamp, lerp, seg, ease, rand, READY } from "../../core/index.js";

export const meta = {
  name: "Hoe",
  desc: "The farmer heaves a hoe overhead and chops it into the ground: clods fly and bounce, dust rolls, and a dark furrow opens as he drags the blade back.",
  tags: ["farming", "hoe", "till", "soil", "dig", "chore", "ground", "one-shot"],
  size: [120, 80],
  origin: [44, 64],
  duration: 1.8,
  loop: false,
  fps: 30,
  bg: "ground",
  actor: 2,
  options: {
    soil: ["#140c06", "#2a1a0e", "#4a2e18", "#6a4426", "#8c6038", "#b08250"],
    dust: "#8a7560",
    seed: 3,
  },
};

// the blade bites the floor at BITE, then is dragged back to DRAG; the furrow is what it leaves
const BITE = 27, DRAG = 20, T_DRAG = 0.3, T_DRAGGED = 0.52;

// both hands on the haft, the blade resting on the floor in front of him
const REST_ = { ...READY, weapon: "hoe", two: true, sa: 0.95, fx: 10, fy: -20, crouch: 2 };
const TOP = { ...REST_, x: -2, crouch: 0, lean: -4, fx: 2, fy: -42, sa: -2.0, ffx: 8, fbx: -6, toeB: true };
const CHOP = { ...REST_, x: 0, crouch: 6, lean: 7, fx: 13, fy: -21, sa: 0.55, ffx: 10, fbx: -9 };
export const act = {
  poses: [
    [-0.62, { ...REST_, x: -1 }],
    [-0.4, { ...REST_, x: -2, crouch: 4, lean: -1, fx: 12, fy: -30, sa: -0.9 }],
    [-0.16, TOP],
    [-0.04, { ...TOP, x: -1, fx: 6, fy: -39, sa: -1.5 }, "snap"],
    [0, CHOP, "snap"],
    [T_DRAG, { ...CHOP, crouch: 5 }],
    [T_DRAGGED, { ...CHOP, x: -2, crouch: 4, lean: 4, fx: 8, fy: -19, sa: 0.7 }],
    [0.95, { ...REST_, x: -1, crouch: 3 }],
    [1.25, { ...REST_, x: -1 }],
  ],
  hits: [{ t: 0, stop: 0.09, shake: 0.14, amp: 1, target: false }],
};

export function create(o) {
  const S = fit(o.soil, 6), R = new Rng(o.seed), floor = () => 0, DUST = hex(o.dust);
  const ps = new Particles({ rng: R, ground: floor }), bits = new Bits({ ground: floor });
  const ramp = o.soil.slice(1);
  // clods: thrown up and mostly back towards him, a few forward, bouncing once and settling
  for (let i = 0; i < 9; i++) {
    const back = i < 6 ? -1 : 1, sp = R.range(50, 120);
    bits.add({ kind: B.CHUNK, x: BITE + R.range(-2, 2), y: -1, vx: back * R.range(0.25, 0.7) * sp, vy: -sp, a: R.range(0, 6), va: R.range(-12, 12), s: R.range(0.9, 2), ramp, g: 0.9, bounce: 0.3, life: R.range(1.0, 1.5) });
  }
  // grit and a roll of dust
  for (let i = 0; i < 14; i++) ps.spawn(P.GRIT, BITE + R.range(-3, 3), -1, R.range(-70, 45), -R.range(40, 110), R.range(0.5, 0.9), o.soil[R.int(3, 5)], 1);
  for (let i = 0; i < 7; i++) ps.spawn(P.DUST, BITE + R.range(-4, 4), -R.range(1, 4), R.range(-30, 20), -R.range(4, 14), R.range(0.6, 1.1), DUST, R.range(2.5, 4.5));
  // the drag throws a second, smaller spray off the blade
  for (let i = 0; i < 6; i++) ps.spawn(P.GRIT, DRAG + R.range(-1, 2), -1, -R.range(20, 60), -R.range(30, 70), R.range(0.4, 0.7), o.soil[R.int(2, 4)], 1, T_DRAG + 0.1 + R.range(0, 0.1));
  for (let i = 0; i < 4; i++) ps.spawn(P.DUST, DRAG + R.range(-2, 4), -2, -R.range(10, 30), -R.range(3, 8), R.range(0.5, 0.8), DUST, R.range(2, 3.5), T_DRAG + 0.08);

  let t = 0;
  // the furrow: a dark bite in the floor that opens back from BITE as the blade is dragged, with turned soil heaped on
  // its near lip; it holds, then dithers away so the effect ends empty
  const furrow = (p) => {
    const open = ease.outQuad(seg(t, 0, 0.06)), back = ease.inOutSine(seg(t, T_DRAG, T_DRAGGED));
    const x0 = lerp(BITE - 2, DRAG - 2, back), x1 = BITE + 3, fade = 1 - seg(t, meta.duration - 0.55, meta.duration - 0.05);
    if (open <= 0 || fade <= 0) return;
    for (let x = Math.floor(x0); x <= x1; x++) {
      const u = (x - x0) / Math.max(1, x1 - x0), end = Math.min(1, (x - x0 + 1) / 2, (x1 - x + 1) / 2);
      const depth = Math.round(1 + open * end * 1.6);
      for (let y = 0; y < depth; y++) p.dot(x, y, y === 0 ? S[0] : S[1], fade);
      // the turned lip: lumps of fresh soil along the far side, lit on top
      const lump = rand(x, 4, o.seed) > 0.35 ? 1 : 0;
      p.dot(x, -1, S[lump ? 4 : 3], fade * open);
      if (lump && rand(x, 5, o.seed) > 0.5) p.dot(x, -2, S[5], fade * open);
      p.dot(x, depth, S[3], fade * open * (u > 0.1 && u < 0.9 ? 1 : 0.5));
    }
  };

  return {
    update(dt) {
      t += dt;
      ps.update(dt);
      bits.update(dt);
    },
    drawBack(p) {
      ps.draw(p, "back");
    },
    draw(p) {
      furrow(p);
      // the moment of the bite: a short white chip of light where iron meets earth
      if (t < 0.05) for (const [dx, dy] of [[0, -1], [-1, -2], [1, -2], [-2, -1], [2, -1]]) p.px(BITE + dx, dy, hex("#fff2c8"));
      bits.draw(p);
      ps.draw(p, "front");
    },
  };
}

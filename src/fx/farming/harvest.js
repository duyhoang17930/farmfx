import { ease, fit, hex, lerp, rand, seg, TAU } from "../../core/index.js";
import { toss } from "../_kit/creature.js";
import { CONTACT, DURATION, FIELD_OPTIONS, fieldWork } from "../_kit/field-work.js";
import { twinkle } from "../_kit/sprite.js";

const SOIL = ["#442c26", "#6d4830", "#96633b"].map(hex);
const LEAF = ["#2e4e2c", "#577f38", "#a0b753"].map(hex);
const GOLD = hex("#ffdc7e");

export const meta = {
  name: "Harvest",
  desc: "Four facings: the farmer stoops, tugs a ripe root free, and lifts it with a flick of soil and a gold glint.",
  tags: ["harvest", "farming", "crop", "chore", "four-way"], size: [176, 64], origin: [88, 44],
  duration: DURATION, fps: 24, loop: true, bg: "field",
  events: { pull: CONTACT + 0.045 },
  options: { ...FIELD_OPTIONS, palette: ["#64303f", "#945063", "#c3747e", "#e79b94", "#f6c3a8"] },
};

function root(p, x, y, C, full, a, bend) {
  p.ellipse(x, y, 3.7, full ? 3.6 : 2.2, C[0], a);
  p.ellipse(x - 0.35, y - 0.55, 2.9, full ? 2.6 : 1.4, C[3], a);
  p.dot(x - 1, y - 1, C[4], a);
  if (full) p.line(x, y + 2, x + 1, y + 5, C[1], a);
  p.line(x, y - 2, x + bend, y - 6, LEAF[0], a);
  p.line(x - 1, y - 3, x - 3 + bend, y - 6, LEAF[1], a);
  p.line(x + 1, y - 3, x + 3 + bend, y - 6, LEAF[1], a);
  p.dot(x - 3 + bend, y - 7, LEAF[2], a);
}

export function draw(p, t, o) {
  const C = fit(o.palette, 5);
  const age = t - CONTACT;
  fieldWork(p, t, o, true, {
    plot(x, y) {
      p.ellipse(x, y + 1, 7, 3.1, SOIL[0]);
      p.ellipse(x, y, 6.5, 2.7, SOIL[1]);
      p.line(x - 4, y - 1, x + 4, y - 1, SOIL[2]);
      const plant = Math.max(1 - seg(age, 0.04, 0.18), seg(t, 1.37, 1.68));
      p.ellipse(x, y, 2.8, 1.45, SOIL[0], 1 - plant);
      if (plant > 0) root(p, x, y - 1, C, false, plant, Math.round(Math.sin(t / DURATION * TAU * 2)));
    },
    action(x, y, _time, { hand: [hx, hy] }) {
      if (age < 0.045 || age >= 0.7) return;
      const u = ease.outCubic(seg(age, 0.045, 0.34));
      const px = lerp(x, hx, u), py = lerp(y - 1, hy + 3, u) - 2 * Math.sin(Math.PI * u);
      const a = 1 - seg(age, 0.52, 0.66);
      root(p, px, py, C, true, a, -1);
      if (age > 0.26 && age < 0.51) twinkle(p, px - 4, py - 6, 3 * Math.sin(Math.PI * seg(age, 0.26, 0.51)), GOLD);
      if (age > 0.37) return;
      for (let i = 0; i < 7; i++) {
        const b = toss(x, y - 1, lerp(-32, 32, rand(i, 1, o.seed)), lerp(-32, -9, rand(i, 2, o.seed)), age - 0.045, 240, y + lerp(-1, 3, rand(i, 3, o.seed)));
        p.dot(b.x, b.y, SOIL[1 + (i % 2)], 1 - seg(age, 0.21, 0.37));
      }
    },
  });
}

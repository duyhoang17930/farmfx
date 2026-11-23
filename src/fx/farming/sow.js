import { ease, fit, lerp, rand, seg } from "../../core/index.js";
import { CONTACT, DURATION, FIELD_OPTIONS, fieldWork } from "../_kit/field-work.js";

export const meta = {
  name: "Sow",
  desc: "Four facings: the farmer flicks seeds by hand into a prepared furrow, where they settle into the soil.",
  tags: ["sow", "seed", "farming", "chore", "four-way"], size: [176, 64], origin: [88, 44],
  duration: DURATION, fps: 24, loop: true, bg: "field",
  options: { ...FIELD_OPTIONS, palette: ["#4c3228", "#704c31", "#ad7a43", "#e5b863", "#f8d996"] },
};

export function draw(p, t, o) {
  const C = fit(o.palette, 5);
  fieldWork(p, t, o, false, {
    held(g, x, y) {
      g.ellipse(x, y + 2, 2.5, 2.8, C[1]);
      g.ellipse(x - 0.6, y + 1.6, 1.7, 1.8, C[2]);
      g.line(x - 1, y, x + 1, y, C[4]);
    },
    plot(x, y, time) {
      p.ellipse(x, y + 1, 7, 3.2, C[0]);
      p.ellipse(x - 0.3, y, 6.7, 2.7, C[1]);
      p.line(x - 4, y - 1, x + 3, y - 1, C[2]);
      p.line(x - 3, y, x + 4, y, C[0]);
      const gone = ease.outCubic(seg(time, 1.1, 1.48));
      for (let i = 0; i < 3; i++) {
        const appear = seg(time, CONTACT + 0.26 + i * 0.035, CONTACT + 0.32 + i * 0.035);
        p.dot(x - 4 + i * 3, y, C[3 + Number(i === 0)], appear * (1 - gone));
      }
    },
    action(x, y, time, { release: [sx, sy] }) {
      for (let i = 0; i < 5; i++) {
        const age = time - CONTACT - i * 0.019, life = 0.24 + i * 0.02;
        if (age < 0 || age >= life) continue;
        const u = age / life;
        const dx = lerp(-5, 4, rand(i, 2, o.seed));
        const dy = lerp(-1.7, 1.6, rand(i, 3, o.seed));
        const px = lerp(sx, x + dx, u), py = lerp(sy, y + dy, u) - 7 * Math.sin(u * Math.PI);
        p.px(px, py, C[3 + Number(i % 3 === 0)]);
        if (i % 2 === 0) p.px(px + 1, py, C[2]);
      }
    },
  });
}

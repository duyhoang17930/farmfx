import { ease, seg, TAU } from "../../core/index.js";
import { asset, GOLD } from "../_kit/art.js";
import { glints } from "../_kit/farm-feedback.js";

export const { meta, draw } = asset({
  name: "Plot unlock",
  desc: "A golden ground ripple and opening padlock celebrate the purchase of new land.",
  tags: ["plot", "unlock", "land", "feedback"], size: [80, 64], origin: [40, 43],
  duration: 0.92, fps: 24, loop: false, palette: GOLD,
}, (p, u, C, o) => {
  if (u >= 1) return;
  const spread = ease.outCubic(u);
  const radius = 4 + spread * 27;
  const ripple = 1 - seg(u, 0.22, 0.72);
  if (ripple > 0) {
    for (let i = 0; i < 12; i++) {
      const angle = i * TAU / 12;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.38;
      p.line(x * 0.89, y * 0.89, x, y, C[3], ripple);
      p.dot(x, y, C[4], ripple);
    }
    p.glow(0, 0, 19, C[3], 0.22 * ripple);
  }
  const alpha = 1 - seg(u, 0.42, 0.82);
  const y = -5 - 19 * spread;
  const open = Math.round(3 * seg(u, 0.04, 0.21));
  if (alpha > 0) {
    p.polyline([[-3, y - 1], [-3, y - 6], [-1, y - 8], [2, y - 8], [4, y - 6], [4, y - 1 - open]], C[1], alpha);
    p.polyline([[-2, y - 2], [-2, y - 6], [-1, y - 7], [2, y - 7], [3, y - 6], [3, y - 2 - open]], C[4], alpha);
    p.rect(-5, y - 3, 11, 8, C[0], alpha);
    p.rect(-4, y - 2, 9, 6, C[3], alpha);
    p.line(-3, y - 2, 3, y - 2, C[4], alpha);
    p.line(0, y, 0, y + 2, C[0], alpha);
  }
  glints(p, u, C, o, 9);
});

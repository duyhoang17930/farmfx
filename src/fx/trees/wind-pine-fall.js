import { ease, Painter, seg } from "../../core/index.js";
import { asset, WOOD } from "../_kit/art.js";
import { puff } from "../_kit/farm-feedback.js";
import * as pine from "./wind-pine.js";

export const { meta, draw } = asset({
  name: "Wind pine fall",
  desc: "The wind pine tips from its cut base, settles near the ground and fades into a dust puff.",
  tags: ["tree", "harvest", "fall"], size: [144, 96], origin: [72, 66],
  duration: 0.78, fps: 24, loop: false, palette: pine.meta.options.palette, options: { direction: 1 },
}, (p, t, C, o) => {
  if (t >= 1) return;
  const fall = ease.inQuad(seg(t, 0.04, 0.65));
  const angle = Math.sign(o.direction) * (1.49 * fall - 0.045 * Math.sin(t * 30) * (1 - fall));
  const trunk = new Painter(p.frame).place(p.tx, p.ty, p.fx < 0, Math.atan2(p.sn, p.cs) + p.fx * angle);
  trunk.fade = p.fade * (1 - seg(t, 0.62, 0.96));
  pine.draw(trunk, 0, { ...pine.meta.options, palette: C, seed: o.seed, shadow: false });
  if (t > 0.5) puff(p, seg(t, 0.5, 1), WOOD, o, 8);
});

import { fit } from "../../core/index.js";
import { explorer, HOOD } from "../_kit/island-explorer.js";

export const meta = {
  name: "Island explorer",
  desc: "An original moss-hooded adventurer with four-direction idle and walk cycles.",
  tags: ["player", "character", "walk", "idle"], size: [48, 48], origin: [24, 36],
  duration: 0.8, fps: 15, loop: true, bg: "field",
  options: { facing: "down", anim: "walk", palette: HOOD },
};

export function draw(p, t, o) {
  const phase = t / meta.duration;
  const walk = o.anim === "walk";
  const step = walk ? Math.floor(phase * 4 + 1e-6) % 4 : -1;
  const bob = !walk && phase >= 1 / 3 && phase < 2 / 3 ? 1 : 0;
  explorer(p, fit(o.palette, 5), o.facing, { step, bob });
}

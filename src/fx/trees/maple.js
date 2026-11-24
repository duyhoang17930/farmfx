import { wave } from "../_kit/art.js";
import { MAPLE, maple, tree } from "../_kit/tree-crowns.js";

export const { meta, draw } = tree("Maple", "A broad autumn maple with a forked trunk and copper-red foliage.",
  MAPLE, (p, phase, C, bark, seed) => {
    maple(p, C, bark, Math.round(wave(phase) * 1.15), seed);
  });

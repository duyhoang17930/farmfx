import { asset, LEAF } from "../_kit/art.js";
import { sprout } from "../_kit/tree-crowns.js";

export const { meta, draw } = asset({
  name: "Sapling", desc: "A small, two-leaf sapling that sways gently.",
  tags: ["tree", "growth", "sapling"], size: [32,32], origin: [16,24],
  palette: LEAF, duration: 3, fps: 12,
}, (p, phase, C) => {
  sprout(p,phase,C);
});

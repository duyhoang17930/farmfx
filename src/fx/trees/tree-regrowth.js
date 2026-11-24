import { clamp, fit } from "../../core/index.js";
import { asset, LEAF, WOOD } from "../_kit/art.js";
import { branch, crown, MAPLE, maple, sprout, trunk } from "../_kit/tree-crowns.js";
import { groundShadow } from "../_kit/sprite.js";
import { draw as drawStump } from "../tiles/stump.js";

export const { meta, draw } = asset({
  name: "Tree regrowth", desc: "Four selectable stages from cut stump to sapling, young tree and mature maple.",
  tags: ["tree", "growth", "stump"], size: [64,64], origin: [32,56],
  palette: MAPLE, duration: 6, fps: 12, options: { stage: -1, leaves: LEAF },
}, (p, phase, C, o) => {
  const stage = o.stage < 0 ? (phase >= 0.95 ? 0 : Math.floor(phase * 4)) : clamp(Math.round(o.stage),0,3);
  if (stage === 0) {
    drawStump(p,0,{ palette: WOOD });
  } else if (stage === 1) {
    sprout(p,0,fit(o.leaves,5));
  } else if (stage === 2) {
    const leaves = fit(o.leaves,5);
    groundShadow(p,0,0,9,2.8);
    branch(p,[[0,-8],[-7,-17],[-8,-21]],4,WOOD);
    branch(p,[[1,-10],[6,-18],[8,-21]],4,WOOD);
    trunk(p,WOOD,{ top:-26,bend:0,width:3 });
    crown(p,-7,-23,9,8,leaves,o.seed);
    crown(p,7,-24,9,9,leaves,o.seed+1);
    crown(p,0,-30,10,8,leaves,o.seed+2);
  } else {
    groundShadow(p,0,-1,13,3.6);
    maple(p,C,WOOD,0,o.seed);
  }
});

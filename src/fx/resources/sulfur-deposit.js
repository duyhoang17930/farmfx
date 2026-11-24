import { deposit, slab } from "../_kit/resource-stone.js";
import { round } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = deposit("Sulfur deposit", "Yellow sulfur nodules clustered in the vents of a rust-dark crust.",
  ["#59432a","#907032","#bea73c","#ebd154","#fff18a"], (p, _phase, C) => {
    groundShadow(p, 0, -1, 12, 3);
    slab(p, 0, -1, 13, 10, C);
    for (const [x,y,rx,ry] of [[-4,-10,5,3],[3,-11,4,3],[7,-6,4,3],[-8,-5,3,2],[0,-5,4,3]]) {
      round(p, x, y, rx, ry, C);
    }
    p.px(-4,-10,C[0]);
    p.px(3,-11,C[1]);
  });

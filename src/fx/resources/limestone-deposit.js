import { deposit, slab } from "../_kit/resource-stone.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = deposit("Limestone deposit", "Two rough chalky slabs with cool seams and broken ivory edges.",
  ["#4a4948","#6b6f66","#909584","#bdc3a9","#e1e0c4"], (p, _phase, C) => {
    groundShadow(p, 0, -1, 12, 3);
    slab(p, -3, -5, 10, 13, C);
    slab(p, 2, -1, 11, 10, C);
    p.polyline([[3,-10],[0,-7],[3,-5],[1,-2]], C[1]);
    p.line(-7,-16,-3,-17,C[3]);
    p.px(-11,0,C[3]);
  });

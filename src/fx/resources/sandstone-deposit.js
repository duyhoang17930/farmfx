import { deposit, slab } from "../_kit/resource-stone.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = deposit("Sandstone deposit", "Staggered ochre shelves with amber sediment bands.",
  ["#583e34","#86573c","#b77b49","#dca66b","#f5d197"], (p, _phase, C) => {
    groundShadow(p, 0, -1, 13, 3);
    slab(p, 0, -1, 13, 9, C);
    slab(p, 2, -6, 10, 9, C);
    slab(p, 4, -10, 7, 8, C);
    p.line(-10,-4,5,-4,C[4]);
    p.line(-6,-9,-2,-9,C[4]);
  });

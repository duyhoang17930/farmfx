import { forage, leaf } from "../_kit/resource-forage.js";
import { wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = forage("Fiber bush", "A swaying tuft of flax blades and seed heads.",
  ["#304435","#4b6542","#70884c","#9bb35f","#d0cf85"], (p, phase, C) => {
    groundShadow(p, 0, 0, 10, 2.6);
    const sway = Math.round(wave(phase) * 1.4);
    for (const [x,tx,ty] of [[-3,-11,-9],[-2,-6,-15],[0,-1,-16],[1,4,-13],[3,9,-9],[2,7,-16]]) {
      leaf(p, x, 0, tx+sway, ty, C);
    }
    for (const [x,y] of [[-7,-14],[-1,-19],[7,-17]]) {
      p.line(0,-3,x+sway,y,C[1]);
      p.ellipse(x+sway,y,1.6,2.1,C[3]);
      p.px(x+sway,y-1,C[4]);
    }
    leaf(p, 0, 0, -8+sway, -7, C);
    leaf(p, 1, 0, 9+sway, -7, C);
  }, { moving: true });

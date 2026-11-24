import { forage, leaf } from "../_kit/resource-forage.js";
import { wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = forage("Seaweed", "Three olive-teal fronds that bend in a shallow current.",
  ["#27454a","#36655b","#508f70","#75ac78","#b8c788"], (p, phase, C) => {
    groundShadow(p, 0, 0, 8, 2.4);
    for (const [x,toX,h] of [[-3,-9,13],[3,7,17],[0,-1,20]]) {
      const lean = wave(phase, 1, x * 0.04) * 2.2;
      const stem = [[x,0],[x+1+lean/3,-h/3],[toX-2+lean/1.4,-h*0.65],[toX+lean,-h]];
      p.polyline(stem,C[0]);
      p.line(x,0,x+1,-4,C[2]);
      leaf(p, ...stem[1], toX-3+lean, -h*0.69, C);
      leaf(p, ...stem[2], toX+4+lean, -h*0.82, C);
      leaf(p, ...stem[2], ...stem[3], C);
    }
  }, { moving: true });

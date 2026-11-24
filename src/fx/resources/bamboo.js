import { forage, leaf } from "../_kit/resource-forage.js";
import { wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = forage("Bamboo", "Three segmented green culms with swaying pointed leaves.",
  ["#324637","#526847","#7a8e4d","#a9b55d","#d5d384"], (p, phase, C) => {
    groundShadow(p, 0, 0, 11, 2.8);
    for (const [x,top,h] of [[-4,-8,24],[4,8,22],[0,1,31]]) {
      const sway = wave(phase, 1, x * 0.035) * 1.35;
      const at = (y) => x + (top + sway - x) * y / h;
      p.beam(x,-1,at(h),-h,4,C[0]);
      p.line(x,-1,at(h),-h,C[3]);
      p.line(x+1,-1,at(h)+1,-h,C[2]);
      for (let y = 6; y < h; y += 7) {
        p.line(at(y)-1,-y,at(y)+1,-y,C[1]);
        p.px(at(y)-1,-y-1,C[4]);
      }
      const side = x < 0 ? -1 : 1;
      leaf(p, at(h-5), -h+5, at(h) + 6*side, -h-1, C);
      leaf(p, at(h-8), -h+8, at(h) - 5*side, -h+3, C);
    }
  }, { moving: true, size: [32,48], origin: [16,40] });

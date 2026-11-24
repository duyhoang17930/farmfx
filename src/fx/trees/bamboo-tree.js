import { wave } from "../_kit/art.js";
import { leaf } from "../_kit/resource-forage.js";
import { tree } from "../_kit/tree-crowns.js";

export const { meta, draw } = tree("Bamboo tree", "A mature stand of five tall, segmented bamboo culms with narrow leaves.",
  ["#2b403d","#446549","#6d9054","#9eb469","#c7cb83"], (p, phase, C) => {
    for (const [x,tip,h] of [[-6,-15,41],[7,16,37],[-3,-7,47],[4,8,49],[0,3,32]]) {
      const sway = wave(phase,1,x*0.039)*1.25;
      const at = (y) => x+(tip+sway-x)*y/h;
      p.beam(x,0,at(h),-h,5,C[0]);
      p.beam(x,-1,at(h),-h,3,C[2]);
      p.line(x-1,-2,at(h)-1,-h,C[3]);
      for (let y = 7; y < h; y += 7) {
        p.line(at(y)-2,-y,at(y)+1,-y,C[1]);
        p.px(at(y)-1,-y-1,C[4]);
      }
      const side = x < 0 ? -1 : 1;
      leaf(p, at(h-6), -h+6, at(h)+side*10, -h-2, C);
      leaf(p, at(h-7), -h+7, at(h)-side*8, -h+2, C);
      leaf(p, at(h-14), -h+14, at(h)+side*10, -h+9, C);
    }
  });

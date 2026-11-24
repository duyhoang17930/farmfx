import { deposit } from "../_kit/resource-stone.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = deposit("Salt deposit", "Rose-and-white salt cubes rising from a pale crust.",
  ["#65566b","#937a8a","#bfa4ad","#e6cace","#fff0e3"], (p, _phase, C) => {
    groundShadow(p, 0, -1, 12, 3);
    p.poly([[-13,-3],[-9,-7],[2,-8],[10,-6],[13,-2],[6,0],[-9,0]], C[0]);
    p.ellipse(0,-3,11,3,C[2]);
    for (const [x,y,s] of [[-4,-13,7],[3,-10,5],[-8,-7,4],[8,-6,4],[0,-5,7]]) {
      p.poly([[x-s,y],[x,y-3],[x+s,y],[x+s,y+4],[x,y+7],[x-s,y+4]], C[0]);
      p.poly([[x-s+1,y],[x,y-2],[x+s-1,y],[x,y+2]], C[4]);
      p.poly([[x-s+1,y+1],[x-1,y+3],[x-1,y+5],[x-s+1,y+3]], C[3]);
      p.poly([[x,y+3],[x+s-1,y+1],[x+s-1,y+3],[x,y+5]], C[2]);
    }
  });

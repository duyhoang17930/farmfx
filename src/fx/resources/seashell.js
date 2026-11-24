import { forage } from "../_kit/resource-forage.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = forage("Seashell", "A small blush scallop shell with raised radial ribs.",
  ["#594151","#8c5f70","#bb8490","#e4b2ae","#ffded0"], (p, _phase, C) => {
    groundShadow(p, 0, 0, 8, 2.4);
    p.poly([[-3,0],[-9,-6],[-9,-9],[-6,-11],[-2,-12],[3,-12],[7,-10],[10,-7],[3,0]], C[0]);
    p.poly([[-2,-1],[-8,-6],[-8,-9],[-5,-10],[-1,-11],[3,-11],[7,-9],[9,-7],[2,-1]], C[3]);
    for (const [x,y] of [[-7,-8],[-4,-10],[0,-11],[4,-10],[7,-8]]) {
      p.line(0,-2,x,y,C[2]);
      p.line(0,-3,x-1,y,C[4]);
    }
    p.line(-2,-1,2,-1,C[1]);
  });

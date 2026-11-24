import { bone, forage } from "../_kit/resource-forage.js";
import { CREAM } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = forage("Bone pile", "Crossed weathered bones beneath a small cracked skull.",
  CREAM, (p, _phase, C) => {
    groundShadow(p, 0, 0, 11, 2.8);
    bone(p,-9,-3,10,-5,C);
    bone(p,2,-2,8,-5,C);
    bone(p,-6,-1,11,-3,C);
    p.ellipse(-2,-9,6.1,5.4,C[0]);
    p.ellipse(-2,-9.5,5.2,4.6,C[3]);
    p.line(-5,-12,-2,-13,C[4]);
    p.rect(-5,-7,7,3,C[2]);
    p.rect(-4,-8,2,2,C[0]);
    p.rect(0,-8,2,2,C[0]);
    p.px(-1,-6,C[0]);
    p.line(-2,-13,-1,-10,C[1]);
    p.px(-4,-4,C[4]);
    p.px(-1,-4,C[4]);
  });

import { forage } from "../_kit/resource-forage.js";
import { LEAF, RED, round } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = forage("Cactus", "A ribbed desert cactus with two side arms and a small coral flower.",
  LEAF, (p, _phase, C) => {
    groundShadow(p, 0, 0, 9, 2.7);
    p.beam(-1,-7,-8,-10,5,C[0]);
    p.beam(-8,-10,-8,-15,5,C[0]);
    p.beam(-2,-8,-8,-10,3,C[2]);
    p.beam(-8,-10,-8,-15,3,C[2]);
    p.beam(2,-9,8,-12,5,C[0]);
    p.beam(8,-12,8,-16,5,C[0]);
    p.line(2,-9,8,-12,C[2]);
    p.line(8,-12,8,-17,C[3]);
    p.beam(0,-3,0,-19,7,C[0]);
    p.beam(0,-3,0,-19,5,C[2]);
    p.line(-2,-4,-2,-19,C[3]);
    p.line(2,-4,2,-19,C[1]);
    for (const [x,y] of [[-1,-17],[1,-14],[-1,-10],[1,-7],[-8,-14],[8,-16]]) p.px(x,y,C[4]);
    round(p, 0, -21, 3, 2.2, RED);
  });

import { deposit, slab } from "../_kit/resource-stone.js";
import { CREAM } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = deposit("Fossil deposit", "An exposed spiral shell embedded in a tilted sediment slab.",
  ["#4c393d","#66504a","#8a735e","#ae9372","#d0b388"], (p, _phase, C) => {
    groundShadow(p, 0, -1, 13, 3);
    slab(p, 0, -2, 13, 17, C);
    p.ellipse(1,-11,7,5.3,CREAM[1]);
    p.polyline([[7,-8],[4,-6],[-2,-6],[-5,-8],[-6,-11],[-3,-14],[2,-15],
      [6,-13],[6,-10],[4,-8],[0,-8],[-2,-10],[-1,-12],[2,-12],[3,-11],[2,-10]], CREAM[4]);
    p.px(-3,-7,CREAM[3]);
    p.px(5,-13,CREAM[3]);
    p.line(-8,-6,-5,-4,C[1]);
  });

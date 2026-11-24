import { forage, leaf } from "../_kit/resource-forage.js";
import { CREAM, LEAF, WOOD, round, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = forage("Cotton bush", "Rust-colored stems carry five fluffy cotton bolls on a wild bush.",
  CREAM, (p, phase, C) => {
    groundShadow(p, 0, 0, 11, 2.6);
    const sway = Math.round(wave(phase) * 1.25);
    for (const [x,y] of [[-8,-10],[-5,-15],[1,-17],[7,-13],[8,-8]]) {
      p.line(0,0,x+sway,y,WOOD[1]);
      leaf(p, Math.round(x/2), Math.round(y/2), x+sway*1.5, y+5, LEAF);
      round(p, x+sway, y, 3.7, 2.9, C);
      p.px(x+sway-1,y-1,C[4]);
      p.px(x+sway+1,y-2,C[3]);
    }
    leaf(p, -1, -1, -5+sway, -9, LEAF);
    leaf(p, 2, -1, 6+sway, -8, LEAF);
  }, { moving: true });

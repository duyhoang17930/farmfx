import { asset, GOLD, STEEL, WATER, WOOD } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = asset({
  name: "Weather workbench",
  desc: "A carpenter's station with a brass gauge, tool rack and a cyan chart on the worktop.",
  tags: ["workbench", "crafting", "coast"], size: [48, 32], origin: [24, 26],
  duration: 1, fps: 1, palette: WOOD,
}, (p, _t, C) => {
  groundShadow(p, 0, 1, 17, 3, 0.91);
  for (const x of [-13, 11]) {
    p.rect(x, -12, 4, 14, C[0]);
    p.rect(x + 1, -11, 2, 11, C[2]);
    p.px(x + 1, 0, C[4]);
  }
  p.rect(-12, -4, 26, 2, C[0]);
  p.rect(-11, -4, 23, 1, C[2]);
  p.poly([[-17,-12],[-10,-20],[15,-20],[18,-13],[15,-9],[-16,-9]], C[0]);
  p.poly([[-15,-13],[-9,-19],[14,-19],[17,-13],[14,-11],[-15,-11]], C[3]);
  p.line(-10, -18, 13, -18, C[4]);
  p.line(-14, -12, 15, -12, C[4]);
  p.line(-11, -14, -7, -14, C[2]);
  p.rect(-12, -10, 25, 4, C[1]);
  p.rect(-10, -9, 10, 2, C[2]);
  p.rect(2, -9, 10, 2, C[2]);
  p.px(-6, -8, GOLD[4]);
  p.px(7, -8, GOLD[4]);
  p.poly([[0,-13],[4,-18],[11,-17],[12,-15],[9,-13]], WATER[1]);
  p.poly([[1,-14],[4,-17],[10,-17],[10,-15],[8,-14]], WATER[3]);
  p.line(4, -15, 7, -16, WATER[4]);
  p.rect(-6, -24, 1, 7, STEEL[0]);
  p.circle(-6, -23, 3, GOLD[0]);
  p.circle(-6, -23, 2, GOLD[3]);
  p.line(-6, -23, -5, -24, STEEL[1]);
  p.line(-2, -15, 0, -18, STEEL[4]);
  p.px(-1, -19, STEEL[3]);
});

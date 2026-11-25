import { asset, GOLD, STEEL, WATER, WOOD } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = asset({
  name: "Weather workbench",
  desc: "A carpenter's station with a brass gauge, tool rack and a cyan chart on the worktop.",
  tags: ["workbench", "crafting", "coast"], size: [48, 48], origin: [24, 34],
  duration: 1, fps: 1, palette: WOOD,
}, (p, _t, C) => {
  groundShadow(p, 0, 1, 17, 4, 0.8);
  p.rect(-8,-16,3,13,C[0]);
  p.rect(11,-17,3,12,C[1]);
  for (const x of [-13, 11]) {
    p.rect(x, -12, 4, 14, C[0]);
    p.rect(x + 1, -11, 2, 11, C[2]);
    p.px(x + 1, 0, C[4]);
  }
  p.rect(-12, -4, 26, 2, C[0]);
  p.rect(-11, -4, 23, 1, C[2]);
  p.poly([[-18,-13],[-10,-24],[15,-24],[19,-14],[16,-9],[-17,-9]], C[0]);
  p.poly([[-16,-13],[-9,-23],[14,-23],[17,-14],[14,-11],[-16,-11]], C[3]);
  p.poly([[14,-23],[17,-14],[14,-11],[15,-10],[18,-14],[15,-22]], C[1]);
  p.line(-9, -22, 13, -22, C[4]);
  p.line(-12, -19, 12, -19, C[2]);
  p.line(-15, -15, 14, -15, C[2]);
  p.line(-15, -12, 14, -12, C[4]);
  p.rect(-12, -10, 25, 4, C[1]);
  p.rect(-10, -9, 10, 2, C[2]);
  p.rect(2, -9, 10, 2, C[2]);
  p.px(-6, -8, GOLD[4]);
  p.px(7, -8, GOLD[4]);
  p.poly([[-1,-14],[3,-21],[11,-20],[12,-16],[9,-13]], WATER[1]);
  p.poly([[0,-15],[4,-20],[10,-19],[10,-16],[8,-14]], WATER[3]);
  p.line(4, -17, 7, -18, WATER[4]);
  p.line(4, -16, 7, -16, WATER[2]);
  p.rect(-6, -29, 1, 8, STEEL[0]);
  p.circle(-6, -28, 3, GOLD[0]);
  p.circle(-6, -28, 2, GOLD[3]);
  p.line(-6, -28, -5, -29, STEEL[1]);
  p.line(-2, -15, 0, -18, STEEL[4]);
  p.px(-1, -19, STEEL[3]);
});

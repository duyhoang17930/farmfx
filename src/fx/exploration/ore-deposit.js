import { asset, GOLD, STEEL } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = asset({
  name: "Ore deposit",
  desc: "A split slate boulder with exposed metal seams, distinct from a plain gatherable rock.",
  tags: ["ore", "rock", "mining", "resource"], size: [32, 32], origin: [16, 24],
  duration: 1, fps: 1, palette: GOLD,
}, (p, _phase, ore) => {
  groundShadow(p, 0, -1, 11, 3.5);
  p.poly([[-12, -4], [-10, -10], [-5, -15], [4, -17], [11, -12], [13, -5], [8, -1], [-6, 0]], STEEL[0]);
  p.poly([[-11, -5], [-9, -10], [-5, -14], [4, -16], [10, -12], [12, -6], [7, -5], [1, -6], [-5, -4]], STEEL[2]);
  p.poly([[-9, -10], [-5, -14], [4, -16], [8, -13], [2, -12], [-1, -9], [-7, -8]], STEEL[3]);
  p.poly([[-11, -5], [-5, -4], [1, -6], [7, -5], [12, -6], [8, -2], [-6, -1]], STEEL[1]);
  p.line(-4, -14, 0, -15, STEEL[4]);
  p.poly([[-8, -11], [-4, -11], [-1, -13], [2, -12], [-1, -9], [-4, -9], [-6, -6], [-8, -7]], ore[0]);
  p.poly([[-7, -10], [-4, -10], [-1, -12], [0, -12], [-2, -10], [-5, -9], [-7, -7]], ore[3]);
  p.line(-5, -10, -2, -11, ore[4]);
  p.poly([[2, -8], [5, -11], [8, -10], [9, -8], [6, -8], [4, -5], [1, -4]], ore[1]);
  p.poly([[3, -8], [5, -10], [7, -10], [7, -9], [5, -8], [4, -6], [2, -5]], ore[3]);
  p.line(5, -10, 7, -10, ore[4]);
  p.line(-6, -3, -3, -3, ore[2]);
});

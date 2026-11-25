import { ramp } from "../../core/index.js";
import { asset, STEEL, WATER, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

const copper = ramp(["#554530", "#9e784e", "#d5aa77"]);

export const { meta, draw } = asset({
  name: "Mist beacon",
  desc: "A copper-braced weather station with a crystal chamber that lights up when restored.",
  tags: ["beacon", "machine", "crystal"], size: [48, 64], origin: [24, 53],
  duration: 2, palette: WATER, options: { active: true },
}, (p, t, C, o) => {
  groundShadow(p, 0, 1, 16, 4, 0.9);
  p.poly([[-16,-4],[-9,-9],[11,-9],[16,-3],[10,3],[-12,3]], STEEL[0]);
  p.poly([[-14,-4],[-8,-8],[10,-8],[14,-4],[9,0],[-11,0]], STEEL[3]);
  p.line(-11, 0, 9, 0, STEEL[2]);
  p.rect(-7, -29, 14, 24, STEEL[0]);
  p.rect(-5, -28, 10, 21, STEEL[2]);
  p.rect(-3, -26, 6, 17, o.active ? C[3] : STEEL[1]);
  p.poly([[0,-45],[7,-36],[0,-27],[-7,-36]], C[0]);
  p.poly([[0,-42],[5,-36],[0,-30],[-5,-36]], o.active ? C[3] : STEEL[1]);
  p.line(0, -41, -4, -36, o.active ? C[4] : STEEL[2]);
  for (const x of [-1, 1]) {
    p.line(x * 5, -13, x * 12, -5, copper[0]);
    p.line(x * 5, -15, x * 12, -7, copper[1]);
    p.px(x * 11, -7, copper[2]);
    p.line(x * 7, -28, x * 10, -37, STEEL[2]);
    p.px(x * 10, -38, o.active ? C[4] : STEEL[2]);
  }
  if (o.active) {
    p.glow(0, -36, 14, C[3], 0.29 + 0.1 * wave(t));
    p.px(Math.round(11 * wave(t)), -43 - Math.round(2 * wave(t)), C[4]);
    p.px(0, -20, C[4]);
  }
});

import { ramp } from "../../core/index.js";
import { asset, STEEL, WATER, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

const copper = ramp(["#554530", "#9e784e", "#d5aa77"]);

export const { meta, draw } = asset({
  name: "Mist beacon",
  desc: "A copper-braced weather station with a crystal chamber that lights up when restored.",
  tags: ["beacon", "machine", "crystal"], size: [64, 80], origin: [32, 62],
  duration: 2, palette: WATER, options: { active: true },
}, (p, t, C, o) => {
  groundShadow(p, 0, 1, 16, 4, 0.79);
  p.poly([[-16,-4],[-9,-9],[11,-9],[16,-3],[10,3],[-12,3]], STEEL[0]);
  p.poly([[-14,-4],[-8,-8],[10,-8],[14,-4],[9,0],[-11,0]], STEEL[3]);
  p.line(-11, 0, 9, 0, STEEL[2]);
  p.line(-11, -5, -6, -7, STEEL[4]);
  p.line(5,-2,10,-3,copper[2]);
  p.rect(-7, -29, 14, 24, STEEL[0]);
  p.rect(-5, -28, 10, 21, STEEL[2]);
  p.rect(-3, -26, 6, 17, o.active ? C[3] : STEEL[1]);
  p.line(-5,-25,-5,-10,STEEL[4]);
  for (const y of [-24,-19,-14]) {
    p.line(-2,y,1,y,o.active ? C[4] : STEEL[3]);
    p.px(2,y+1,o.active ? C[2] : STEEL[0]);
  }
  p.poly([[0,-47],[8,-37],[5,-31],[0,-27],[-8,-37]], C[0]);
  p.poly([[0,-45],[6,-37],[4,-32],[0,-29],[-6,-37]], o.active ? C[3] : STEEL[2]);
  p.poly([[0,-45],[3,-36],[0,-29],[6,-37]], o.active ? C[2] : STEEL[1]);
  p.line(0, -44, -5, -37, o.active ? C[4] : STEEL[3]);
  for (const x of [-1, 1]) {
    p.line(x * 5, -13, x * 12, -5, copper[0]);
    p.line(x * 5, -15, x * 12, -7, copper[1]);
    p.px(x * 11, -7, copper[2]);
    p.line(x * 7, -28, x * 10, -37, STEEL[2]);
    p.px(x * 10, -38, o.active ? C[4] : STEEL[2]);
  }
  if (o.active) {
    p.glow(0, -37, 19, C[3], 0.35 + 0.09 * wave(t));
    p.glow(0, -2, 13, C[3], 0.13 + 0.04 * wave(t, 1, 0.2));
    for (let i = 0; i < 3; i++) {
      const x = 13 * wave(t,1,i / 3), y = -36 + 6 * wave(t,1,i / 3 + 0.25);
      p.px(x,y,C[4]);
      if (i === 0) p.dot(x+1,y,C[3],0.7);
    }
  }
});

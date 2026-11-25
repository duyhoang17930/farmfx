import { ramp, rand } from "../../core/index.js";
import { asset, STEEL, WATER, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

const copper = ramp(["#554530", "#9e784e", "#d5aa77"]);

export const { meta, draw } = asset({
  name: "Mist beacon",
  desc: "A copper-braced weather station with a levitating crystal, orbiting shards and soft light when restored.",
  tags: ["beacon", "machine", "crystal"], size: [64, 96], origin: [32, 72],
  duration: 3.2, palette: WATER, options: { active: true },
}, (p, t, C, o) => {
  groundShadow(p, 0, 1, 16, 4, 0.75);
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
  const coreY = o.active ? -46 + Math.round(2 * wave(t)) : -37;
  if (o.active) {
    p.ellipse(0, -29, 6, 2.3, C[3], 0.7);
    p.line(-3, -29, 3, -29, C[4], 0.83);
    p.glow(0, coreY, 16, C[3], 0.36 + 0.09 * wave(t));
    p.glow(0, -2, 13, C[3], 0.12 + 0.04 * wave(t, 1, 0.2));
  }
  const orbit = [0, 0.34, 0.72].map((phase, i) => {
    const depth = wave(t, 1, phase + 0.25);
    return {
      depth, x: Math.round((12 + i * 2) * wave(t, 1, phase)),
      y: coreY + Math.round(depth * (3 + i) + (i - 1) * 4),
    };
  });
  const shard = ({ x, y, depth }) => {
    p.poly([[x,y-3],[x+2,y],[x,y+2],[x-2,y]], C[1]);
    p.line(x,y-2,x-1,y,depth >= 0 ? C[4] : C[3]);
    p.px(x,y,C[3]);
  };
  if (o.active) orbit.filter(({ depth }) => depth < 0).forEach(shard);
  p.poly([[0,coreY-10],[8,coreY],[5,coreY+6],[0,coreY+10],[-8,coreY]], C[0]);
  p.poly([[0,coreY-8],[6,coreY],[4,coreY+5],[0,coreY+8],[-6,coreY]], o.active ? C[3] : STEEL[2]);
  p.poly([[0,coreY-8],[3,coreY+1],[0,coreY+8],[6,coreY]], o.active ? C[2] : STEEL[1]);
  p.line(0, coreY-7, -5, coreY, o.active ? C[4] : STEEL[3]);
  for (const x of [-1, 1]) {
    p.line(x * 5, -13, x * 12, -5, copper[0]);
    p.line(x * 5, -15, x * 12, -7, copper[1]);
    p.px(x * 11, -7, copper[2]);
    p.line(x * 7, -28, x * 10, -37, STEEL[2]);
    p.px(x * 10, -38, o.active ? C[4] : STEEL[2]);
  }
  if (o.active) {
    orbit.filter(({ depth }) => depth >= 0).forEach(shard);
    for (let i = 0; i < 7; i++) {
      const life = (t + rand(i, 11, o.seed)) % 1;
      const side = i % 2 ? 1 : -1;
      const x = side * (6 + 10 * rand(i, 13, o.seed)) + 2 * wave(life, 1, i / 7);
      const y = -28 - (16 + 11 * rand(i, 17, o.seed)) * life;
      const alpha = Math.sin(Math.PI * life) * 0.83;
      p.dot(x, y, C[i % 3 ? 4 : 3], alpha);
      if (i % 3 === 0) p.dot(x, y+1, C[2], alpha * 0.7);
    }
  }
});

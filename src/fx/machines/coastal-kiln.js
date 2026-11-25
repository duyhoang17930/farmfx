import { asset, GOLD, STEEL, WATER, WOOD, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = asset({
  name: "Coastal kiln",
  desc: "A stone kiln with a sea-glass flue cap and a firebox that glows when working.",
  tags: ["machine", "kiln", "smelting"], size: [48, 64], origin: [24, 52],
  duration: 2, palette: ["#514255", "#896477", "#b18684", "#d8ab8c", "#f3cfaa"],
  options: { active: true },
}, (p, t, C, o) => {
  groundShadow(p, 0, 0, 17, 4, 0.93);
  p.poly([[-17,-3],[-13,-9],[12,-9],[17,-4],[17,0],[13,3],[-13,3],[-17,0]], STEEL[0]);
  p.poly([[-16,-3],[-12,-7],[12,-7],[16,-3],[11,0],[-13,0]], STEEL[3]);
  p.line(-13, 1, 10, 1, STEEL[2]);
  p.poly([[-13,-2],[-13,-15],[-9,-24],[-3,-27],[6,-27],[11,-22],[14,-13],[14,-3],
    [7,0],[-9,0]], C[0]);
  p.poly([[-12,-3],[-12,-14],[-8,-23],[-2,-25],[6,-25],[10,-21],[10,-11],[9,-2],[-8,-1]], C[2]);
  p.poly([[-11,-14],[-8,-22],[-2,-25],[6,-25],[9,-21],[5,-17],[-4,-15]], C[3]);
  p.line(-8, -20, -3, -23, C[4]);
  p.line(-4, -16, 6, -18, C[4]);
  p.line(-12, -10, -9, -11, C[3]);
  p.line(10, -10, 13, -12, C[1]);
  for (const [x, y] of [[-11,-5],[-9,-15],[0,-20],[9,-6],[8,-14]]) p.line(x, y, x + 2, y, C[1]);
  p.poly([[-8,-1],[-8,-9],[-5,-15],[0,-17],[5,-15],[8,-10],[8,-2],[5,0],[-6,0]], WOOD[0]);
  p.poly([[-7,-2],[-7,-8],[-4,-13],[0,-14],[4,-12],[6,-9],[6,-2]], C[1]);
  p.poly([[-5,-2],[-5,-8],[-3,-11],[1,-12],[4,-9],[4,-2]], STEEL[0]);
  p.line(-7, -9, -5, -12, C[4]);
  p.line(-8, 0, 7, 0, STEEL[4]);
  p.rect(2, -32, 7, 10, C[0]);
  p.rect(3, -31, 4, 7, C[2]);
  p.poly([[0,-32],[2,-35],[9,-35],[11,-32],[9,-29],[1,-29]], WATER[0]);
  p.line(2, -33, 8, -33, WATER[4]);
  p.line(2, -31, 9, -31, WATER[3]);

  if (!o.active) return;
  const flicker = Math.round(wave(t, 3));
  p.poly([[-4,-2],[-4,-5],[-2,-7],[0,-5],[1,-9-flicker],[4,-5],[4,-2]], GOLD[2]);
  p.poly([[-3,-2],[-2,-5],[0,-3],[2,-6+flicker],[3,-2]], GOLD[4]);
  p.glow(0, -5, 12, GOLD[3], 0.22);
  for (let i = 0; i < 4; i++) {
    const u = (t + i / 4) % 1;
    p.dot(6 + Math.sin(u * 4 + i) * 3, -36 - u * 12, i % 2 === 0 ? GOLD[3] : C[4], Math.sin(Math.PI * u));
  }
});

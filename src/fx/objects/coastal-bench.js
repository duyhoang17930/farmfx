import { asset, WOOD } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = asset({
  name: "Coastal bench",
  desc: "A bench with a broad plank seat and a receding side and rear legs in top-down three-quarter view.",
  tags: ["bench", "furniture", "coast"], size: [48,32], origin: [24,25],
  duration: 1, fps: 1, palette: WOOD,
}, (p,_t,C) => {
  groundShadow(p, 0, 1, 16, 3, 0.76);
  for (const [x,y] of [[-10,-4],[10,-4],[-14,0],[11,0]]) {
    p.rect(x,y-7,3,8,C[0]);
    p.line(x+1,y-6,x+1,y,C[2]);
  }
  p.rect(-10,-18,2,10,C[0]);
  p.rect(11,-17,2,11,C[0]);
  p.poly([[-12,-19],[11,-19],[14,-17],[13,-12],[-12,-12]],C[0]);
  p.poly([[-11,-18],[11,-18],[12,-17],[12,-14],[-11,-14]],C[2]);
  p.line(-11,-18,10,-18,C[4]);
  p.poly([[-16,-8],[-11,-13],[13,-13],[16,-8],[14,-5],[-16,-5]],C[0]);
  p.poly([[-15,-8],[-10,-12],[12,-12],[14,-9],[13,-8]],C[3]);
  p.line(-10,-12,12,-12,C[4]);
  p.line(-13,-10,13,-10,C[2]);
  p.line(-15,-8,13,-8,C[4]);
  p.line(-15,-6,13,-6,C[2]);
});

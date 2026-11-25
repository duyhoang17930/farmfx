import { asset, WOOD } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = asset({
  name: "Coastal bench",
  desc: "A bench with a broad plank seat and a receding side and rear legs in top-down three-quarter view.",
  tags: ["bench", "furniture", "coast"], size: [48,32], origin: [24,25],
  duration: 1, fps: 1, palette: WOOD,
}, (p,_t,C) => {
  groundShadow(p, 0, 1, 16, 3, 0.75);
  for (const [x,y] of [[-9,-7],[11,-7],[-14,0],[10,0]]) {
    p.rect(x,y-7,3,8,C[0]);
    p.line(x+1,y-6,x+1,y,C[2]);
  }
  p.rect(-9,-20,2,10,C[0]);
  p.rect(12,-20,2,11,C[0]);
  p.poly([[-10,-22],[13,-22],[15,-20],[14,-15],[-10,-15]],C[0]);
  p.poly([[-9,-21],[13,-21],[14,-20],[13,-17],[-9,-17]],C[2]);
  p.line(-9,-21,12,-21,C[4]);
  p.poly([[-17,-7],[-10,-16],[14,-16],[15,-8],[14,-4],[-17,-4]],C[0]);
  p.poly([[-16,-7],[-9,-15],[13,-15],[14,-8],[13,-7]],C[3]);
  p.line(-9,-15,13,-15,C[4]);
  p.line(-12,-12,13,-12,C[2]);
  p.line(-15,-9,13,-9,C[2]);
  p.line(-16,-7,13,-7,C[4]);
  p.line(-16,-5,13,-5,C[2]);
});

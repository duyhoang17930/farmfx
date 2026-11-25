import { asset, WOOD } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = asset({
  name: "Coastal waypost",
  desc: "A small carved direction sign with a bevel, visible upper face and shaded side.",
  tags: ["signpost", "wood", "coast"], size: [48,32], origin: [24,25],
  duration: 1, fps: 1, palette: WOOD, options: { label: "VUON", pointing: "right" },
}, (p,_t,C,o) => {
  const dir = o.pointing === "left" ? -1 : 1;
  const shape = (points,color) => p.poly(points.map(([x,y])=>[x*dir,y]),color);
  groundShadow(p, 0, 0, 8, 2.3, 0.75);
  p.rect(-2,-17,5,18,C[0]);
  p.line(-1,-16,-1,0,C[3]);
  p.line(2,-16,2,0,C[1]);
  shape([[-12,-22],[8,-22],[15,-16],[8,-10],[-12,-10]],C[0]);
  shape([[-11,-21],[7,-21],[13,-16],[7,-12],[-11,-12]],C[2]);
  shape([[-11,-21],[7,-21],[9,-19],[-11,-19]],C[4]);
  shape([[7,-12],[13,-16],[14,-16],[8,-10],[-11,-10],[-11,-12]],C[1]);
  p.text(String(o.label).slice(0,4),0,-18,C[0],{font:"mini",align:"center"});
  p.px(-10,-15,C[4]);
});

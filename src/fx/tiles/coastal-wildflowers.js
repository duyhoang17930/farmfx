import { clamp, ramp } from "../../core/index.js";
import { asset, GOLD, LEAF, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

const colors = [
  ramp(["#805d68","#bd8791","#e7aeb0","#ffe8ba","#fff4d2"]),
  ramp(["#596282","#898bb8","#b7b2db","#e2d1f0","#fff0db"]),
  ramp(["#6c6447","#a48352","#e1ba68","#f8dea0","#fff1c8"]),
];
const clusters = [
  [[-7,-8],[-4,-11],[1,-9],[5,-5]],
  [[-6,-6],[-2,-9],[3,-12],[7,-8]],
  [[-9,-7],[-5,-4],[0,-11],[5,-9],[9,-6]],
  [[-4,-7],[0,-12],[3,-8],[7,-5]],
];
const sizes = [0.8, 1, 1.2];

export const { meta, draw } = asset({
  name: "Coastal wildflowers",
  desc: "Wind-bent wildflowers with four cluster shapes, three bloom colors and picked stems.",
  tags: ["flowers", "foliage", "coast"], size: [32,32], origin: [16,24], duration: 2.4,
  palette: ["#805d68","#bd8791","#e7aeb0","#ffe8ba","#fff4d2"],
  options: { shape: 0, growth: 1, tint: 0, condition: "fresh" },
}, (p,t,C,o) => {
  const size = sizes[clamp(Math.round(o.growth),0,2)];
  const shape = clamp(Math.round(o.shape),0,3);
  const tint = clamp(Math.round(o.tint),0,2);
  const petal = tint ? colors[tint] : C;
  groundShadow(p, 0, 0, 10*size, 2, 0.55);
  for (const [i,[x,y]] of clusters[shape].entries()) {
    const wind = Math.round(wave(t,1,(i + o.seed * 0.4) * 0.14));
    const tx = Math.round(x * size) + wind;
    const ty = Math.round(y * size);
    const foot = Math.round(x * size * 0.57);
    const bend = Math.round(tx * 0.67);
    p.line(foot,1,bend,Math.round(ty*0.52),LEAF[1]);
    p.line(bend,Math.round(ty*0.52),tx,o.condition === "picked" ? Math.round(ty*0.65) : ty,LEAF[2]);
    const side = i % 2 ? -1 : 1;
    p.poly([[foot,0],[foot+side*3,-3],[foot+side*5,-3],[foot+side*2,-1]],LEAF[3]);
    p.px(foot+side*3,-3,LEAF[4]);
    if (o.condition === "picked" || o.condition === "damaged" && i % 2 === 0) continue;
    if (shape === 3) p.line(tx,ty-2,tx,ty+1,petal[1]);
    else p.line(tx-2,ty,tx+2,ty,petal[1]);
    p.line(tx-1,ty-1,tx+1,ty-1,petal[3]);
    p.line(tx-1,ty+1,tx+1,ty+1,petal[2]);
    p.px(tx,ty,i % 2 ? GOLD[3] : petal[4]);
  }
});

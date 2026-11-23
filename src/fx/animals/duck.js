import { smallAnimal } from "../_kit/wildlife.js";
import { CREAM, GOLD, LEAF, WATER, round, wave } from "../_kit/art.js";
export const { meta, draw } = smallAnimal("Duck","A mallard paddling and dipping its beak, facing right; flip for left.","duck",CREAM,(p,ph,C,o)=>{
  const x=Math.round(wave(ph)*2),d=Math.max(0,wave(ph,1,0.55)),y=-9+Math.round(d*5);
  if(o.water){p.ellipse(x,0,15,4,WATER[2]);p.ellipse(x-3,1,12,2.3,WATER[3]);p.line(x-10,-2,x-6-Math.round(d*2),-2,WATER[4]);}
  p.poly([[x-7,-7],[x-13,-11],[x-11,-5],[x-7,-3]],C[1]);
  round(p,x-2,-5,9.3,5.6,C);round(p,x-4,-6,5.8,3.4,C);
  p.line(x-8,-6,x-2,-4,CREAM[1]);p.line(x-7,-5,x-2,-3,LEAF[1]);
  round(p,x+6,y,4.7,5.1,LEAF); p.px(x+7,y-1,C[0]);p.px(x+7,y-2,C[4]);
  p.poly([[x+8,y+1],[x+14,y+1],[x+12,y+3],[x+8,y+3]],GOLD[3]);p.line(x+9,y+2,x+12,y+2,GOLD[1]);
},{water:true});

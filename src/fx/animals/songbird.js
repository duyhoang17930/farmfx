import { smallAnimal } from "../_kit/wildlife.js";
import { CREAM, GOLD, STEEL, round, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";
export const { meta, draw } = smallAnimal("Songbird","A small blue songbird that hops, flutters and pecks, facing right; flip for left.","songbird",STEEL,(p,ph,C)=>{
  const hop=Math.max(0,wave(ph,2,0.38)),y=-Math.round(hop*6),x=Math.round(wave(ph)*5);
  groundShadow(p,x,0,5,1.6);
  for(const d of [-1,1])p.line(x+d,y-4,x+d*2,y,GOLD[2]);
  p.poly([[x-2,y-5],[x-12,y-10],[x-9,y-6],[x-6,y-3]],C[1]);
  round(p,x,y-6,5.3,4.2,C);p.ellipse(x+1,y-4,3.7,2.7,CREAM[3]);
  const w=wave(ph,6)*Number(hop>.5);
  p.poly([[x-4,y-7],[x-3,y-9+w*4],[x+2,y-8],[x-1,y-4]],C[1]);p.line(x-3,y-7,x,y-6,C[3]);
  round(p,x+4,y-9+Math.max(0,wave(ph+.47))*3,3.8,3.7,C);
  p.px(x+5,y-10,C[0]);p.px(x+7,y-8,GOLD[3]);p.px(x+8,y-8,GOLD[4]);
});

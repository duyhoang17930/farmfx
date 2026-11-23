import { smallAnimal } from "../_kit/wildlife.js";
import { GOLD, WATER, round, wave } from "../_kit/art.js";
export const { meta, draw } = smallAnimal("Pond fish","An orange fish with a fanned tail and optional water ripples, facing right; flip for left.","fish",GOLD,(p,ph,C,o)=>{
  const x=wave(ph)*6,y=-7+wave(ph,2)*2,tail=wave(ph,4);
  if(o.water){p.ellipse(0,0,17,7,WATER[2]);p.line(x-7,y+6,x-1,y+6,WATER[4]);p.line(x+4,y+5,x+8,y+5,WATER[3]);}
  p.poly([[x-4,y],[x-12,y-4+tail],[x-9,y+tail],[x-12,y+5+tail]],C[1]);
  p.line(x-10,y-2+tail,x-6,y,C[3]);round(p,x,y,8.4,4.1,C);p.line(x-3,y-3,x+1,y-5,C[2]);
  p.line(x-1,y,x-3,y+3,C[1]);p.px(x+5,y-1,C[0]);p.px(x+5,y-2,C[4]);
},{water:true});

import { smallAnimal } from "../_kit/wildlife.js";
import { CREAM, RED, round } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";
export const { meta, draw } = smallAnimal("Rabbit","A round brown rabbit with long ears, a white tail and a short hop, facing right; flip for left.","rabbit",["#403240","#63505a","#906e69","#b88c73","#e1b294"],(p,ph,C)=>{
  const hop=Math.sin(Math.PI*Math.min(1,Math.max(0,(ph-0.3)/0.42))),y=-Math.round(hop*8),x=Math.round(hop*2);
  groundShadow(p,0,0,8-hop*2,2);
  round(p,x-8,y-7,2.9,2.8,CREAM);round(p,x-3,y-7,6.6,5.7,C);
  round(p,x-1,y-2-hop*3,4.6,2.15,C);round(p,x+4,y-10,4.6,4.6,C);
  p.beam(x+1,y-13,x-1,y-22+hop*2,3.6,C[1]);p.line(x,y-16,x-1,y-21+hop*2,RED[3]);
  p.beam(x+4,y-13,x+5,y-23+hop*3,3.5,C[2]);p.line(x+4,y-16,x+5,y-22+hop*3,RED[3]);
  p.px(x+6,y-11,C[0]);p.px(x+6,y-12,C[4]);p.px(x+8,y-9,RED[2]);
});

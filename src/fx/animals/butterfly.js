import { smallAnimal } from "../_kit/wildlife.js";
import { GOLD, VIOLET, wave } from "../_kit/art.js";
export const { meta, draw } = smallAnimal("Butterfly","A violet butterfly flapping over a drifting path, viewed from above and facing up.","butterfly",VIOLET,(p,ph,C)=>{
  const x=wave(ph)*8,y=-15+wave(ph,2)*3,w=2+5*Math.abs(wave(ph,6));
  for(const d of [-1,1]){
    p.poly([[x,y],[x+d*w,y-5],[x+d*(w+2),y-3],[x+d*w,y+2],[x+d*3,y+3]],C[0]);
    p.ellipse(x+d*w*.68,y-2,Math.max(1,w*.45),2.6,C[3]);p.px(x+d*w*.8,y-3,C[4]);p.px(x+d*w*.45,y+1,GOLD[3]);
  }
  p.line(x,y-3,x,y+3,C[0]);p.line(x,y-3,x-2,y-5,C[0]);p.line(x,y-3,x+2,y-5,C[0]);
});

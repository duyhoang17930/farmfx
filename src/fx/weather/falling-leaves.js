import { weather } from "../_kit/farm-feedback.js";
import { GOLD, RED, wave } from "../_kit/art.js";
import { rand, wrap } from "../../core/index.js";
export const { meta, draw } = weather("Falling leaves","Rust and gold leaves spiral down, turning edge-on before they fade.",GOLD,(p,ph,C,o,w,h)=>{
  for(let i=0;i<21;i++){
    const u=wrap(ph+rand(i,4,o.seed),1),x=-w+12+(2*w-24)*rand(i,5,o.seed)+wave(ph,2,i*.21)*7;
    const y=-h+3+(2*h-6)*u,a=Math.min(1,8*u,6*(1-u)),k=wave(ph,5,i*.2);
    const R=i%3===0?RED:C;
    p.poly([[x-2,y+1],[x-1,y-1-k],[x+2,y-2],[x+1,y+1+k]],R[2],a);
    p.dot(x,y-1,R[4],a);p.dot(x-2,y+1,R[0],a);
  }
},{duration:5});

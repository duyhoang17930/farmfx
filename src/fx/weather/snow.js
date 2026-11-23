import { weather } from "../_kit/farm-feedback.js";
import { CREAM, wave } from "../_kit/art.js";
import { rand, wrap } from "../../core/index.js";
export const { meta, draw } = weather("Snow","Soft snowfall with three sizes of flakes drifting at different speeds.",CREAM,(p,ph,C,o,w,h)=>{
  for(let i=0;i<o.count;i++){
    const u=wrap(ph*(i%4===0?2:1)+rand(i,4,o.seed),1),x=(-w+5)+(w*2-10)*rand(i,5,o.seed)+wave(ph,2,i*.37)*3;
    const y=-h+2+(2*h-4)*u,a=Math.min(1,6*u,6*(1-u));
    p.dot(x,y,C[i%3===0?4:3],a);
    if(i%5===0){p.dot(x-1,y,C[3],a*.7);p.dot(x,y-1,C[4],a*.83);}
  }
},{duration:5,bg:"dark",options:{count:58}});

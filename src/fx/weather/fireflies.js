import { weather } from "../_kit/farm-feedback.js";
import { GOLD, LEAF, wave } from "../_kit/art.js";
import { rand } from "../../core/index.js";
export const { meta, draw } = weather("Fireflies","Small warm lights pulse at different times as they wander over a dark field.",GOLD,(p,ph,C,o,w,h)=>{
  for(let i=0;i<20;i++){
    const x=-w+11+(2*w-22)*rand(i,3,o.seed)+wave(ph,1,i*.62)*5;
    const y=-h+12+(2*h-24)*rand(i,2,o.seed)+wave(ph,2,i*.34)*5;
    const a=Math.max(0,wave(ph,2,i*.215))**2;
    if(a<.12)continue;
    p.dot(x,y,C[4],a);p.glow(x,y,5,i%4===0?LEAF[4]:C[3],a*.56);
    if(a>.82)p.dot(x+1,y,C[3],a*.6);
  }
},{bg:"dark",duration:4});

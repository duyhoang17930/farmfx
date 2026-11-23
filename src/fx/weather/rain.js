import { weather } from "../_kit/farm-feedback.js";
import { WATER } from "../_kit/art.js";
import { rand, wrap } from "../../core/index.js";
export const { meta, draw } = weather("Rain","Slanted rain streaks and tiny ground splashes cycle over a field.",WATER,(p,ph,C,o,w,h)=>{
  for(let i=0;i<o.count;i++){
    const s=rand(i,3,o.seed),u=wrap(ph*(2+(i%3))+s,1);
    const x=-w+7+(2*w-13)*rand(i,5,o.seed)-6*u;
    const y=-h+8+u*(h*2-16)*(.55+rand(i,8,o.seed)*.45);
    if(u<.87)p.line(x+3,y-5,x,y,i%4===0?C[4]:C[3],.58);
    else{const k=(u-.87)/.13;p.ellipse(x,y,1+k*2,.7+k*.5,C[4],.6*(1-k));p.dot(x-1,y-2*k,C[4],1-k);}
  }
},{options:{count:46}});

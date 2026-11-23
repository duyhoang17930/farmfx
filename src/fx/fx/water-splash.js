import { burst } from "../_kit/farm-feedback.js";
import { WATER } from "../_kit/art.js";
import { ease, rand, seg, TAU } from "../../core/index.js";
import { toss } from "../_kit/creature.js";
export const { meta, draw } = burst("Water splash","A shallow crown of water with arcing drops and two spreading rings.","splash",WATER,.9,(p,u,C,o)=>{
  for(let j=0;j<2;j++){
    const k=seg(u,.12+j*.1,.91+j*.06);
    if(k<=0||k>=1)continue;
    const r=2+ease.outCubic(k)*(12-j*4);
    for(let i=0;i<42;i++){const a=i/42*TAU;p.dot(Math.cos(a)*r,Math.sin(a)*r*.34,C[i%7===0?4:3],(1-k)*.85);}
  }
  for(let i=0;i<11;i++){
    const a=i*2.399,v=12+rand(i,3,o.seed)*36, b=toss(0,-.5,Math.cos(a)*v,-v,u,206,Math.sin(a)*4);
    if(!b.landed)p.line(b.x,b.y,b.x-b.vx*.021,b.y-b.vy*.019,C[i%3?3:4],1-seg(u,.58,.9));
  }
});

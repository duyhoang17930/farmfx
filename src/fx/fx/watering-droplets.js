import { burst } from "../_kit/farm-feedback.js";
import { WATER } from "../_kit/art.js";
import { rand, seg } from "../../core/index.js";
export const { meta, draw } = burst("Watering droplets","A short arc of irrigation droplets lands in staggered twinkles.","water",WATER,1.15,(p,u,C,o)=>{
  for(let i=0;i<15;i++){
    const age=u-i*.026,k=seg(age,0,.43),x=-9+18*k+rand(i,4,o.seed)*5,y=-19+19*k-6*Math.sin(Math.PI*k);
    if(age>0&&k<1)p.line(x-1,y-2,x,y,C[3+i%2],.86);
    if(age>=.43&&age<.67)p.line(x-1,y,x+2,y,C[4],1-seg(age,.43,.67));
  }
});

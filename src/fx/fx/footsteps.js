import { burst, puff } from "../_kit/farm-feedback.js";
import { WOOD } from "../_kit/art.js";
import { seg } from "../../core/index.js";
export const { meta, draw } = burst("Footsteps","Two alternating little boot prints that fade against the ground.","steps",WOOD,1.2,(p,u,C,o)=>{
  for(const [x,y,delay] of [[-3,1,0],[3,-7,.24]]){
    if(u<delay)continue;
    const a=1-seg(u,delay+.18,.96);
    p.ellipse(x,y,1.9,2.5,C[0],a*.87);
    p.ellipse(x,y+3,1.25,1,C[0],a*.85);
    p.line(x-1,y-1,x+1,y-1,C[3],a*.75);
  }
  puff(p,u,C,o,3);
});

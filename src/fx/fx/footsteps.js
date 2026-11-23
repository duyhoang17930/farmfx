import { burst, puff } from "../_kit/farm-feedback.js";
import { WOOD } from "../_kit/art.js";
import { seg } from "../../core/index.js";
export const { meta, draw } = burst("Footsteps","Two alternating little boot prints that fade against the ground.","steps",WOOD,1.2,(p,u,C,o)=>{
  for(const [x,y,delay] of [[-3,1,0],[3,-7,.24]]){
    if(u<delay)continue;
    const a=1-seg(u,delay+.18,.96);
    p.ellipse(x,y,1.9,2.6,C[1],a*.7);
    p.ellipse(x,y+2.4,1.1,1,C[0],a*.67);
  }
  puff(p,u,C,o,3);
});

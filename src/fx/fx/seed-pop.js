import { burst, glints } from "../_kit/farm-feedback.js";
import { LEAF, WOOD } from "../_kit/art.js";
import { ease, seg } from "../../core/index.js";
export const { meta, draw } = burst("Seed sprout pop","A two-leaf sprout springs out of a little scattering of dry soil.","growth",LEAF,.9,(p,u,C,o)=>{
  const a=1-seg(u,.6,.98),h=6+ease.outBack(seg(u,.05,.52))*8;
  p.line(0,0,0,-h,C[2],a);p.line(0,-h+1,-5,-h-3,C[3],a);p.line(0,-h+1,4,-h-3,C[4],a);
  p.dot(-5,-h-4,C[4],a);p.dot(5,-h-3,C[3],a);
  for(const x of [-5,-3,3,5])p.dot(x,-1-Math.sin(u*Math.PI)*Math.abs(x)*.6,WOOD[3],a*(1-u));
  glints(p,u,C,o,3);
});

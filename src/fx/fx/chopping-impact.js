import { burst, chips, puff } from "../_kit/farm-feedback.js";
import { WOOD, GOLD } from "../_kit/art.js";
import { seg } from "../../core/index.js";
export const { meta, draw } = burst("Chopping impact","A quick edge flash kicks out sapwood chips and a little sawdust.","chop",WOOD,.8,(p,u,C,o)=>{
  chips(p,u,C,o,11,"wood");puff(p,u,C,o,4);
  const k=1-seg(u,0,.15);p.line(-5,-11,3,-5,GOLD[4],k);p.line(-3,-8,5,-5,C[4],k*.8);
});

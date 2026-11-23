import { burst, glints } from "../_kit/farm-feedback.js";
import { GOLD } from "../_kit/art.js";
import { ease, seg } from "../../core/index.js";
export const { meta, draw } = burst("Item pickup","A small golden token arcs up through a neat burst of pickup glints.","pickup",GOLD,.84,(p,u,C,o)=>{
  const y=-3-17*ease.outCubic(u),a=1-seg(u,.46,.9);
  p.ellipse(0,y,3+Math.sin(u*Math.PI)*2,4,C[1],a);
  p.ellipse(-.45,y-.65,2+Math.sin(u*Math.PI)*1.8,2.9,C[3],a);
  p.line(-1,y-1,1,y-1,C[4],a);glints(p,u,C,o,6);
});

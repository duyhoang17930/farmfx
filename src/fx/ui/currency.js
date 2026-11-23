import { frame, icon, label, ui } from "../_kit/farm-ui.js";
import { GOLD } from "../_kit/art.js";
export const { meta, draw } = ui("Currency","A flipping coin and a configurable gold balance on a compact HUD panel.",80,32,{amount:1250},(p,ph,C,o)=>{
  frame(p,-31,-10,62,20,C);icon(p,"coin",-21,0,ph);label(p,o.amount,-12,-2,9,GOLD[4]);
});

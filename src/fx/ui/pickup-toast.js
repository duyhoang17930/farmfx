import { frame, icon, label, ui } from "../_kit/farm-ui.js";
import { CREAM, GOLD } from "../_kit/art.js";
import { ease, seg } from "../../core/index.js";
export const { meta, draw } = ui("Pickup toast","A short pickup notification with a configurable item, name and quantity.",112,48,
  {item:"apple",title:"APPLE",quantity:3},(p,ph,C,o)=>{
  if(ph>=.9)return;
  const y=Math.round(6*(1-ease.outCubic(seg(ph,0,.18)))-10*ease.inCubic(seg(ph,.73,.9)));
  frame(p,-48,-10+y,96,20,C);icon(p,o.item,-37,y,ph);label(p,o.title,-27,-2+y,14,CREAM[4]);label(p,"+"+o.quantity,31,-2+y,4,GOLD[4]);
},{duration:1.4,loop:false});

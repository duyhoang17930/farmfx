import { frame, label, ui } from "../_kit/farm-ui.js";
import { CREAM, GOLD, VIOLET, round } from "../_kit/art.js";
import { clamp } from "../../core/index.js";
export const { meta, draw } = ui("Day clock","A configurable day and time readout with a sun or moon icon.",112,32,{day:7,hour:-1,minute:30},(p,ph,C,o)=>{
  frame(p,-50,-12,100,24,C);
  const hour=clamp(Math.floor(o.hour<0?ph*24:o.hour),0,23),night=hour<6||hour>=18;
  const x=-38,y=0;
  if(night){p.ellipse(x,y,5,5,VIOLET[3]);p.ellipse(x+2,y-2,4,3,C[1]);p.px(x-1,y+3,VIOLET[4]);}
  else {round(p,x,y,4,4,GOLD);for(const [dx,dy] of [[0,-6],[-6,0],[6,0],[0,6]])p.px(x+dx,y+dy,GOLD[4]);}
  label(p,"DAY "+o.day,-27,-6,10,CREAM[4]);
  label(p,String(hour).padStart(2,"0")+":"+String(clamp(Math.floor(o.minute),0,59)).padStart(2,"0"),-27,2,8,GOLD[4]);
});

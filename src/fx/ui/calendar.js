import { frame, label, ui } from "../_kit/farm-ui.js";
import { CREAM, GOLD, RED, wave } from "../_kit/art.js";
import { clamp } from "../../core/index.js";
export const { meta, draw } = ui("Calendar","A 28-day seasonal calendar with a configurable current day and marked dates.",128,80,
  {season:"SPRING",day:10,events:[5,13,21]},(p,ph,C,o)=>{
  frame(p,-58,-34,116,68,C);p.rect(-55,-31,110,62,CREAM[3]);
  label(p,o.season,-50,-28,22,C[0]);
  const events=Array.isArray(o.events)?o.events:[],day=clamp(Math.round(o.day),1,28);
  for(let i=0;i<28;i++){
    const x=-51+(i%7)*15,y=-19+Math.floor(i/7)*12;
    p.rect(x,y,13,10,i+1===day?GOLD[wave(ph)>0.7?4:3]:CREAM[2]);label(p,i+1,x+2,y+2,2,C[0]);
    if(events.includes(i+1))p.px(x+10,y+7,RED[2]);
  }
});

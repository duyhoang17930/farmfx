import { ui } from "../_kit/farm-ui.js";
import { GOLD, LEAF, wave } from "../_kit/art.js";
export const { meta, draw } = ui("Quest marker","A bobbing quest pin that can display a new quest, a hint or a completed check.",32,32,{state:"new"},(p,ph,C,o)=>{
  const y=-3+Math.round(wave(ph)*2),P=o.state==="done"?LEAF:GOLD;
  p.ellipse(0,y,7,8,P[0]);p.ellipse(0,y-1,6,6.8,P[2]);p.tri(-3,y+5,3,y+5,0,y+10,P[1]);
  p.ellipse(-1,y-2,4.3,4.7,P[3]);
  p.text(o.state==="done"?"+":o.state==="hint"?"?":"!",0,y-3,P[0],{font:"mini",align:"center"});
  p.px(-3,y-5,P[4]);p.glow(0,y,8,P[2],.2);
});

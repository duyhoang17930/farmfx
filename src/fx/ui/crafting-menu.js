import { frame, icon, label, slot, ui } from "../_kit/farm-ui.js";
import { CREAM, GOLD, wave } from "../_kit/art.js";
export const { meta, draw } = ui("Crafting menu","A recipe panel with configurable ingredient slots, quantities and output.",112,64,
  {title:"CRAFT",ingredients:[{id:"wood",count:3},{id:"stone",count:2}],result:"seed"},(p,ph,C,o)=>{
  frame(p,-52,-26,104,52,C);label(p,o.title,-46,-20,19);
  const things=Array.isArray(o.ingredients)?o.ingredients.slice(0,3):[];
  things.forEach((item,i)=>{const x=-46+i*17;slot(p,x,-7,C);icon(p,item?.id,x+7,0,ph);label(p,item?.count,x+4,11,2,CREAM[4]);});
  const x=10+Math.round(wave(ph)*2);
  p.line(x,-1,x+9,-1,GOLD[4]);p.tri(x+6,-5,x+11,-1,x+6,3,GOLD[3]);slot(p,30,-7,C,true);icon(p,o.result,37,0,ph);
});

import { frame, icon, label, ui } from "../_kit/farm-ui.js";
import { CREAM, GOLD } from "../_kit/art.js";
export const { meta, draw } = ui("Item tooltip","A small icon tooltip with a title and two short configurable text lines.",128,48,
  {item:"berry",title:"WILD BERRY",lines:["A TART FORAGED FRUIT.","ENERGY +8"]},(p,ph,C,o)=>{
  frame(p,-59,-19,118,38,C);p.tri(-34,17,-25,17,-29,21,C[0]);icon(p,o.item,-47,-5,ph);
  label(p,o.title,-36,-13,21,GOLD[4]);
  const lines=Array.isArray(o.lines)?o.lines:[];
  for(let i=0;i<2;i++)label(p,lines[i],-36,-2+i*10,22,CREAM[4]);
});

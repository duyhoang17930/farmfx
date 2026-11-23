import { frame, icon, label, slot, ui } from "../_kit/farm-ui.js";
import { CREAM, GOLD, wave } from "../_kit/art.js";
import { clamp } from "../../core/index.js";
export const { meta, draw } = ui("Shop interface","A shop panel with editable stock, prices, gold total and highlighted row.",128,96,{
  title:"FARM STORE",amount:850,selected:-1,items:[{id:"seed",name:"SEEDS",price:15},{id:"milk",name:"MILK",price:60},{id:"ore",name:"ORE",price:45}]},(p,ph,C,o)=>{
  frame(p,-60,-43,120,86,C);p.rect(-57,-40,114,80,CREAM[3]);
  label(p,o.title,-52,-36,17,C[0]);icon(p,"coin",30,-32,ph);label(p,o.amount,37,-34,4,C[0]);
  const rows=Array.isArray(o.items)?o.items.slice(0,3):[];
  const pick=clamp(o.selected<0?Math.round(1-wave(ph,1,.25)):Math.floor(o.selected),0,2);
  rows.forEach((item,i)=>{
    const y=-25+i*20;p.rect(-52,y,103,17,i===pick?GOLD[3]:CREAM[2]);slot(p,-51,y+1,C,i===pick);
    icon(p,item?.id,-44,y+8,ph);label(p,item?.name,-31,y+6,12,C[0]);label(p,item?.price,32,y+6,4,C[0]);
  });
});

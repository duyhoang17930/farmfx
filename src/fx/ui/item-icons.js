import { ITEM_IDS, frame, icon, itemGrid, ui } from "../_kit/farm-ui.js";
export const { meta, draw } = ui("Item icons","Twelve inventory icons for produce, materials and animal goods. Set item to show a single icon.",112,48,{item:null},(p,ph,C,o)=>{
  if(o.item){icon(p,o.item,0,0,ph);return;}
  frame(p,-54,-21,108,42,C);itemGrid(p,C,ph,{items:ITEM_IDS,selected:0},{x:-50,y:-16,cols:6,rows:2});
});

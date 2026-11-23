import { ITEM_IDS, frame, itemGrid, label, ui } from "../_kit/farm-ui.js";
export const { meta, draw } = ui("Inventory slots","A sixteen-slot backpack panel with item icons and a moving selection.",96,96,{items:ITEM_IDS,selected:-1,title:"BACKPACK"},(p,ph,C,o)=>{
  frame(p,-38,-44,76,88,C);label(p,o.title,-31,-40,16);
  itemGrid(p,C,ph,o,{x:-33,y:-29,cols:4,rows:4});
});

import { frame, itemGrid, ui } from "../_kit/farm-ui.js";
export const { meta, draw } = ui("Hotbar","Six quick slots with configurable items and selection.",128,32,{items:["carrot","wheat","seed","fish","wood","ore"],selected:-1},(p,ph,C,o)=>{
  frame(p,-56,-12,112,24,C);itemGrid(p,C,ph,o,{x:-50,y:-8,cols:6,rows:1});
});

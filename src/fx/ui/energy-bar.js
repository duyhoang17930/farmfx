import { meter, ui } from "../_kit/farm-ui.js";
export const { meta, draw } = ui("Energy bar","A blue energy meter with a lightning icon and configurable 0-to-1 fill.",96,32,{value:-1},(p,ph,C,o)=>meter(p,ph,C,o,"energy"));

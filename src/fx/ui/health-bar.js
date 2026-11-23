import { meter, ui } from "../_kit/farm-ui.js";
export const { meta, draw } = ui("Health bar","A heart meter with a configurable 0-to-1 fill level.",96,32,{value:-1},(p,ph,C,o)=>meter(p,ph,C,o,"health"));

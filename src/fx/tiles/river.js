import { asset, WATER, WOOD } from "../_kit/art.js";
import { stream } from "../_kit/landscape.js";
export const { meta, draw } = asset({name:"River",desc:"A flowing 16 px straight reach with earthen banks; orient north-south or east-west.",
  tags:["river","water","tile"],size:[16,16],origin:[8,12],palette:WATER,duration:2.4,options:{facing:"north-south",tileOffset:0,bank:WOOD}},stream);

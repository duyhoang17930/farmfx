import { cabin, doorway } from "../_kit/architecture.js";
import { STEEL, WOOD, box } from "../_kit/art.js";
export const { meta, draw } = cabin({name:"Storage shed",desc:"A narrow plank shed with a tin roof, sliding door and stacked supply boxes.",
  w:30,h:17,peak:8,roof:STEEL,palette:WOOD,decoration(p,_ph,C,_o,open){
    doorway(p,-12,0,15,15,C,open);p.line(-14,-15,13,-15,STEEL[3]);
    box(p,4,0,8,6,3,WOOD);box(p,7,-6,6,5,2,WOOD);
  }});

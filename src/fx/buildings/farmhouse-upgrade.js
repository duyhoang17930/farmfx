import { cabin, doorway, gable, window } from "../_kit/architecture.js";
import { CREAM, RED, STEEL, WOOD, post } from "../_kit/art.js";
export const { meta, draw } = cabin({name:"Expanded farmhouse",desc:"An upgraded two-storey farmhouse with a side wing, upper windows and a covered porch.",
  w:42,h:29,peak:14,roof:STEEL,palette:CREAM,decoration(p,_ph,C,o,open){
    gable(p,20,-2,21,16,8,C,STEEL,4);
    window(p,14,-14,7,6,o.lit);window(p,-18,-23,7,7,o.lit);window(p,-5,-23,8,7,o.lit);window(p,7,-23,7,7,o.lit);
    doorway(p,-8,0,11,13,C,open);
    window(p,-19,-13,7,7,o.lit);
    p.poly([[-12,-13],[10,-13],[14,-10],[-15,-10]],RED[2]);p.line(-15,-10,14,-10,RED[4]);
    post(p,-13,0,10,WOOD);post(p,12,0,10,WOOD);p.rect(-14,0,27,2,WOOD[2]);
  }});

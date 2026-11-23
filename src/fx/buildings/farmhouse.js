import { cabin, doorway, window } from "../_kit/architecture.js";
import { CREAM, LEAF, RED, WOOD, box, round } from "../_kit/art.js";
export const { meta, draw } = cabin({name:"Farmhouse",desc:"A cream cottage with a red roof, brick chimney, warm windows and an opening front door.",
  w:40,h:21,peak:13,roof:RED,palette:CREAM,decoration(p,_ph,C,o,open){
    box(p,8,-29,5,11,2,RED);p.line(8,-37,12,-37,RED[1]);
    window(p,-17,-16,8,8,o.lit);window(p,4,-16,8,8,o.lit);
    doorway(p,-7,0,9,14,C,open);
    p.rect(-8,0,11,2,WOOD[2]);p.rect(-9,2,13,2,WOOD[1]);
    round(p,-16,-3,5,2.5,WOOD);for(const x of [-19,-16,-13])p.ellipse(x,-5,1.8,1.5,LEAF[3]);
  }});

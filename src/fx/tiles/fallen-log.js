import { asset, LEAF, WOOD, round } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";
export const { meta, draw } = asset({name:"Fallen log",desc:"A hollow fallen log with split bark, growth rings and small patches of moss.",tags:["log","wood","forage"],size:[48,32],origin:[24,24],palette:WOOD},(p,_ph,C)=>{
  groundShadow(p,0,1,15,3);
  p.beam(-11,-5,12,-10,11,C[0]);
  p.beam(-10,-6,12,-11,9,C[2]);
  p.line(-10,-10,12,-15,C[3]);p.line(-12,-3,11,-8,C[1]);p.line(-10,-7,9,-11,C[1]);
  round(p,-12,-5,5,5.5,C);
  p.ellipse(-12,-5,2.9,3.4,C[1]);p.ellipse(-12,-5,1.5,2.1,C[0]);
  p.line(-15,-8,-14,-9,C[4]);
  p.line(0,-12,5,-13,LEAF[2]);p.line(2,-13,6,-14,LEAF[3]);
});

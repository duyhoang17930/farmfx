import { asset, RED, STEEL, WOOD, round, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";
export const { meta, draw } = asset({name:"Grain silo",desc:"A ribbed steel grain silo with a red cap, access ladder and a flickering level indicator.",
  tags:["silo","grain","building"],size:[48,64],origin:[24,52],palette:STEEL},(p,ph,C)=>{
  groundShadow(p,0,0,15,3.5);
  p.ellipse(0,-5,13,5,C[0]);p.rect(-13,-40,26,35,C[0]);p.rect(-12,-39,23,34,C[2]);
  p.rect(-9,-39,7,34,C[3]);p.rect(7,-39,4,34,C[1]);
  for(let y=-8;y>-38;y-=5){p.line(-12,y,11,y,C[1]);p.line(-10,y-1,9,y-1,C[3]);}
  round(p,0,-39,14,8,RED);p.line(-5,-44,3,-44,RED[4]);
  for(const x of [5,9])p.line(x,-3,x,-43,WOOD[1]);for(let y=-5;y>=-42;y-=4)p.line(5,y,9,y,WOOD[3]);
  p.rect(-6,-26,3,9,C[0]);p.rect(-5,-24,1,wave(ph)>0?6:5,RED[3]);
});

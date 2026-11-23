import { asset, WOOD, round } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";
export const { meta, draw } = asset({name:"Stump",desc:"A low tree stump with three roots and a warm, ringed cut surface.",tags:["stump","wood"],palette:WOOD},(p,_ph,C)=>{
  groundShadow(p,0,0,9,2.7);
  p.poly([[-9,0],[-6,-4],[-5,-10],[6,-10],[6,-4],[9,0],[4,-1],[1,2],[-2,0]],C[1]);
  p.line(-4,-8,-5,-2,C[3]);p.line(3,-8,3,-2,C[2]);p.line(4,-4,7,-1,C[0]);
  round(p,0,-10,7,3.7,C);
  p.ellipse(0,-10,4,1.85,C[2]);p.ellipse(0,-10,2.5,1.05,C[4]);p.px(0,-10,C[2]);
});

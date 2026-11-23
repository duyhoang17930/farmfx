import { asset, GOLD, STEEL, WATER, WOOD, post, round, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";
export const { meta, draw } = asset({name:"Water well",desc:"A stone well with a wooden canopy and a bucket rising from the water.",
  tags:["well","water","building"],size:[48,48],origin:[24,38],duration:3.2,palette:STEEL},(p,ph,C)=>{
  groundShadow(p,0,0,14,3.5);
  p.ellipse(0,-4,12,6,C[0]);p.rect(-11,-12,22,8,C[2]);p.ellipse(0,-12,12,6,C[3]);p.ellipse(0,-12,8,3.9,WATER[0]);
  p.line(-5,-11,4,-11,WATER[2]);for(const x of [-8,-2,4,9])p.line(x,-9,x,-5,C[1]);
  post(p,-10,-6,20);post(p,10,-6,20);
  p.poly([[-15,-24],[0,-35],[15,-24],[10,-23],[-12,-23]],WOOD[1]);
  p.poly([[-14,-25],[-1,-34],[12,-25]],WOOD[3]);p.line(-12,-26,-1,-33,WOOD[4]);
  const by=-13-Math.round(4+3*wave(ph));
  p.line(0,-25,0,by,GOLD[2]);p.poly([[-3,by], [4,by],[3,by+6],[-2,by+6]],WOOD[1]);
  p.line(-2,by+1,3,by+1,C[3]);p.line(-2,by+4,2,by+4,WOOD[3]);
});

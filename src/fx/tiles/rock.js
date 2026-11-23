import { asset, STEEL, LEAF } from "../_kit/art.js";
import { drawRock, stoneShape } from "../_kit/nature.js";
import { fit, Rng } from "../../core/index.js";
import { groundShadow } from "../_kit/sprite.js";
export const { meta, draw } = asset({name:"Mossy rock",desc:"An angular boulder with a lit upper plane and optional moss.",tags:["rock","stone","forage"],palette:STEEL,options:{moss:true}},(p,_ph,C,o)=>{
  groundShadow(p,0,0,9,2.5);
  drawRock(p,0,-6,9,0,stoneShape(new Rng(o.seed),6),fit(C,7));
  if(o.moss){
    p.poly([[-7,-8],[-6,-12],[-2,-12],[1,-10],[-1,-9],[-4,-9],[-5,-7]],LEAF[1]);
    p.line(-6,-10,-3,-11,LEAF[3]);p.px(-5,-9,LEAF[2]);
  }
});

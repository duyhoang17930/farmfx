import { asset, GOLD, wave } from "../_kit/art.js";
import { noise2, rand } from "../../core/index.js";
export const { meta, draw } = asset({name:"Sand",desc:"A seamless 16 px shore tile with wind ridges and occasional pale grains.",
  tags:["sand","beach","tile"],size:[16,16],origin:[8,12],palette:GOLD,options:{tileX:0,tileY:0}},(p,ph,C,o)=>{
  for(let y=0;y<16;y++) for(let x=0;x<16;x++){
    const X=x+o.tileX*16,Y=y+o.tileY*16, n=noise2(X/9,Y/6,o.seed), f=rand(X,Y,o.seed+4);
    const ridge=wave((Y+n*2+X*0.16)/5)>0.8;
    p.px(x-8,y-12,C[f>0.95 ? (wave(ph+f)>0.75?4:3) : f<0.07 ? 1 : ridge ? 3 : 2]);
  }
});

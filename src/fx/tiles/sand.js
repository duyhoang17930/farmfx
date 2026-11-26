import { asset, wave } from "../_kit/art.js";
import { mix, noise2, rand } from "../../core/index.js";
import { groundTones, terrainPalettes } from "../_kit/world-terrain.js";
export const { meta, draw } = asset({name:"Sand",desc:"A seamless 16 px shore tile with wind ridges and occasional pale grains.",
  tags:["sand","beach","tile"],size:[16,16],origin:[8,12],palette:terrainPalettes.sand,options:{tileX:0,tileY:0}},(p,ph,C,o)=>{
  const base=mix(C[2],C[3],.82), tones=groundTones(C,base), ridgeColor=mix(base,C[4],.22);
  for(let y=0;y<16;y++) for(let x=0;x<16;x++){
    const X=x+o.tileX*16,Y=y+o.tileY*16, n=noise2(X/9,Y/6,o.seed), f=rand(X,Y,o.seed+4);
    const ridge=n>.12&&wave((Y+n*2+X*0.16)/7)>.86;
    p.px(x-8,y-12,f>.996&&wave(ph+f)>.75?ridgeColor:ridge?ridgeColor:n<-.4?tones[0]:base);
  }
});

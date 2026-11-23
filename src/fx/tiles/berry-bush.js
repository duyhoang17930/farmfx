import { asset, LEAF, RED, round, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";
export const { meta, draw } = asset({name:"Berry bush",desc:"A low, swaying bramble with optional coral berries.",tags:["bush","berry"],palette:LEAF,options:{berries:true}},(p,ph,C,o)=>{
  const x=Math.round(wave(ph));
  groundShadow(p,0,0,10,3);
  for(const [dx,y,rx,ry] of [[-6,-6,5.5,4],[6,-7,5,4],[0,-12,7,5],[0,-6,8,5]])round(p,x+dx,y,rx,ry,C);
  if(o.berries)for(const [dx,y] of [[-7,-7],[-2,-10],[4,-8],[6,-12],[0,-5]])round(p,x+dx,y,1.6,1.5,RED);
});

import { asset, CREAM, wave } from "../_kit/art.js";
import { rand, wrap } from "../../core/index.js";
export const { meta, draw } = asset({name:"Chimney smoke",desc:"A slow continuous plume of pale smoke rises, widens and fades.",tags:["smoke","chimney"],size:[48,48],origin:[24,40],duration:3.2,palette:CREAM},(p,ph,C,o)=>{
  for(let i=0;i<7;i++){
    const u=wrap(ph+i/7,1),x=12*u*u+wave(ph,1,i*.31)*u*2+rand(i,8,o.seed)*u*4,y=-u*28;
    const a=Math.sin(Math.PI*u)*.48;
    p.disc(x,y,2+u*4,C[2],a);p.disc(x-1,y-1.3,1.3+u*3.2,C[4],a*.71);
  }
});

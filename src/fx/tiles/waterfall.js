import { asset, cacheArt, STEEL, WATER, round, wave } from "../_kit/art.js";
import { rand, wrap } from "../../core/index.js";
const watercourse = cacheArt(48,64,-24,-50,(p,C)=>{
  p.poly([[-18,-38],[-14,-45],[14,-45],[19,-38],[18,-6],[-17,-4]],STEEL[0]);
  for(const x of [-16,-12,10,15]){p.line(x,-39,x-1,-10,STEEL[1]);p.line(x+1,-36,x+1,-18,STEEL[2]);}
  round(p,0,-4,20,7.5,C);
  p.poly([[-12,-45],[11,-45],[9,-38],[10,-9],[16,-4],[-15,-4],[-10,-10],[-10,-37]],C[1]);
  p.poly([[-9,-43],[8,-43],[6,-35],[7,-8],[12,-5],[-11,-5],[-7,-10],[-7,-36]],C[2]);
});
export const { meta, draw } = asset({name:"Waterfall",desc:"A layered ribbon of falling water over dark stone, with a frothy basin and rising mist.",
  tags:["fall","water","cliff"],size:[48,64],origin:[24,50],palette:WATER,duration:2.4},(p,ph,C,o)=>{
  watercourse(p,C);
  for(let i=0;i<21;i++){
    const x=-8+16*rand(i,2,o.seed),y=-40+32*wrap(ph*(i%2+1)+rand(i,3,o.seed),1);
    p.line(x,y,x+wave(ph+i)*0.55,y+3+i%3,C[(i%3===0)?4:3],0.75);
  }
  for(let i=0;i<10;i++){
    const k=wrap(ph+rand(i,4,o.seed),1),x=(rand(i,3,o.seed)-0.5)*(13+17*k);
    p.disc(x,-5-6*k,1.4+2*k,C[4],0.65*(1-k));
    p.dot(x,-3+wave(ph+i)*2.8,C[4],(1-k)*0.7);
  }
});

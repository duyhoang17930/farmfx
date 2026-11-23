import { asset, WOOD, WATER, post, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";
export const { meta, draw } = asset({name:"Footbridge",desc:"A wood plank crossing with raised rails. Water is optional in the preview.",
  tags:["bridge","water","wood"],size:[48,32],origin:[24,21],palette:WOOD,options:{water:true}},(p,ph,C,o)=>{
  if(o.water){p.rect(-13,-20,26,30,WATER[2]);for(let i=0;i<7;i++)p.line(-11+i%3*5,-18+4*i,-5+i%3*5+wave(ph+i)*2,-18+4*i,WATER[3]);}
  groundShadow(p,0,-1,19,6);
  p.poly([[-21,-9],[-13,-14],[13,-14],[21,-9],[21,1],[13,-2],[-13,-2],[-21,1]],C[1]);
  p.poly([[-21,-9],[-13,-14],[13,-14],[21,-9],[21,-2],[13,-7],[-13,-7],[-21,-2]],C[3]);
  for(let x=-19;x<20;x+=3){const y=Math.round(-14+Math.max(0,Math.abs(x)-13)*0.62);p.line(x,y,x,y+7,C[1]);}
  for(const [x,y] of [[-17,-10],[17,-10],[-17,0],[17,0]])post(p,x,y,8,C);
  p.polyline([[-17,-16],[-9,-20],[9,-20],[17,-16]],C[4]);
  p.polyline([[-17,-6],[-9,-10],[9,-10],[17,-6]],C[4]);
});

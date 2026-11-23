import { asset, CREAM, STEEL, WOOD, round } from "../_kit/art.js";
import { doorway } from "../_kit/architecture.js";
import { groundShadow } from "../_kit/sprite.js";
import { TAU } from "../../core/index.js";
export const { meta, draw } = asset({name:"Windmill",desc:"A stone mill tower with four slowly turning cloth sails around a wooden hub.",
  tags:["mill","windmill","building"],size:[80,80],origin:[40,65],duration:4,palette:CREAM},(p,ph,C)=>{
  groundShadow(p,0,0,16,3.5);
  p.poly([[-15,0],[-10,-39],[0,-49],[10,-39],[15,0]],C[1]);
  p.poly([[-13,-1],[-9,-36],[-1,-44],[6,-35],[9,-1]],C[3]);
  for(let j=1;j<7;j++){const y=-j*5; p.line(-12+j*0.45,y,12-j*0.55,y,C[2]);p.line(j%2?3:-5,y,-1+j%2*4,y+4,C[2]);}
  p.poly([[-12,-39],[0,-51],[13,-39],[10,-36],[-9,-36]],STEEL[2]);
  doorway(p,-5,0,9,13,C,0);
  for(let i=0;i<4;i++){
    const a=TAU*(ph/4+i/4),dx=Math.cos(a),dy=Math.sin(a);
    const at=(u,v)=>[dx*u-dy*v,-36+dy*u+dx*v];
    p.poly([at(5,-1),at(25,-1),at(25,7),at(9,6)],WOOD[1]);
    p.poly([at(9,0),at(24,0),at(24,6),at(10,5)],C[4]);
    p.line(...at(0,0),...at(25,0),WOOD[3]);
    p.line(...at(14,1),...at(14,5),C[2]);p.line(...at(19,1),...at(19,6),C[2]);
  }
  round(p,0,-36,4,3.5,WOOD);
});

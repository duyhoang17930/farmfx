import { mix, noise2, ramp } from "../../core/index.js";
import { asset } from "../_kit/art.js";
import { waterGlint } from "../_kit/world-terrain.js";

export const SEA_COLORS=["#3d8296","#509bad","#64adba","#8bc4c4","#c7e9d9"];
const mud=ramp(["#887554","#a99066","#c8ad7b"]);
const sides="NESW", diagonals=["NE","SE","SW","NW"];

export const { meta, draw } = asset({
  name:"Coastal pond",desc:"A modular stillwater pond with soft earthen banks and inside and outside corners.",
  tags:["tile","water","pond"],size:[16,16],origin:[8,12],duration:3,fps:12,palette:SEA_COLORS,
  options:{ banks:"ES", corners:[], tileX:0, tileY:0 },
},(p,t,C,o)=>{
  const inner=new Set(o.corners);
  const crest=mix(C[1],C[2],.6);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){
    const ds=[y,15-x,15-y,x];
    const wx=o.tileX*16+x, wy=o.tileY*16+y;
    const n=noise2(wx/5,wy/5,o.seed);
    let depth=16;
    for(let i=0;i<4;i++){
      const d=ds[i], next=ds[(i+1)%4], corner=diagonals[i];
      if(o.banks.includes(sides[i])) depth=Math.min(depth,d);
      if(o.banks.includes(corner[0])&&o.banks.includes(corner[1])) depth=Math.min(depth,9-Math.hypot(Math.max(0,9-d),Math.max(0,9-next)));
      if(inner.has(corner)) depth=Math.min(depth,d+next);
    }
    if(depth<1+(n<-.25?1:0))continue;
    const color=depth<3.6?mud[depth<1.9?2:depth<2.8?1:0]
      :depth<7&&n>.16?crest:waterGlint(wx,wy,t,o.seed)?crest:C[1];
    p.px(x-8,y-12,color);
  }
});

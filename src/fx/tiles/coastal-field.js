import { noise2, ramp } from "../../core/index.js";
import { asset } from "../_kit/art.js";

const dry=["#8d6b54","#ae895e","#b89466","#c7a676","#d5b783"];
const wet=ramp(["#6d6256","#8d765e","#9d8263","#aa8f6e","#c4a47f"]);
export const { meta, draw } = asset({
  name:"Coastal field",desc:"Connected dry or watered soil with continuous furrows and a soft outer edge.",
  tags:["tile","farming","soil"],size:[16,16],origin:[8,12],duration:1,fps:1,palette:dry,
  options:{ joins:"EW", wet:false, tileX:0, tileY:0 },
},(p,_t,C,o)=>{
  const S=o.wet?wet:C, j=o.joins;
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){
    const wx=o.tileX*16+x, wy=o.tileY*16+y;
    const n=noise2(wx/6,wy/4,o.seed);
    const edge=Math.min(j.includes("N")?16:y,j.includes("E")?16:15-x,
      j.includes("S")?16:15-y,j.includes("W")?16:x);
    if(edge<1||edge===1&&n<-.3) continue;
    const groove=(wy+Math.round(noise2(wx/13,0,o.seed)))%5;
    const shade=edge===1?1:groove===1?1:groove===2?3:n>.25?3:2;
    p.px(x-8,y-12,S[shade]);
  }
});

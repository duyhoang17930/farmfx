import { ramp } from "../../core/index.js";
import { asset, GOLD, STEEL, WATER, WOOD, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

const roof = ramp(["#355050","#4a6860","#648777","#8eaa8c","#b8c5a0"]);
const barnWall = ramp(["#604759","#8b5960","#b6796d","#d79880","#efbea0"]);
const glass = ramp(["#3b545c","#527585","#72a4a8","#9bbeb4","#d6dfc5"]);

export const { meta, draw } = asset({
  name:"Coastal farmstead",desc:"A coop, glasshouse or barn with the same three-quarter projection, larger foundations and top-left lighting.",
  tags:["building","ranch","coast"],size:[112,96],origin:[53,75],duration:3.5,fps:16,
  palette:WOOD,options:{ style:"barn", open:true },
},(p,t,C,o)=>{
  const coop=o.style==="coop", green=o.style==="greenhouse";
  const half=coop?22:green?29:32, depth=coop?11:14, base=coop?-7:0;
  const eave=base-(coop?18:24), ridge=eave-(green?12:15);
  const W=green?glass:coop?C:barnWall, R=green?glass:roof;
  groundShadow(p,2,1,half+7,5,.75);
  if(coop) for(const x of [-half+4,half-4]) {
    p.rect(x,-10,4,11,C[0]); p.line(x+1,-9,x+1,-1,C[3]);
  }
  p.poly([[-half,eave],[half,eave],[half+depth,eave-depth],[half+depth,base-depth],[half,base],[-half,base]],W[0]);
  p.poly([[half-1,eave],[half+depth-1,eave-depth+1],[half+depth-1,base-depth],[half-1,base-1]],W[1]);
  p.rect(-half+1,eave+1,2*half-2,base-eave-1,W[2]);
  for(let x=-half+4;x<half-2;x+=green?9:6){
    p.line(x,eave+1,x,base-2,W[1]);
    p.line(x+1,eave+1,x+1,base-3,W[3]);
  }
  p.line(-half+1,base-1,half-1,base-1,W[0]);
  p.poly([[-half-2,eave],[-half+8,ridge],[-half+8+depth,ridge-depth],
    [half-8+depth,ridge-depth],[half+depth+2,eave-depth],[half+2,eave],[half-8,ridge],[-half+8,ridge]],R[0]);
  p.poly([[-half+8,ridge],[-half+8+depth,ridge-depth+1],[half-8+depth,ridge-depth+1],[half-8,ridge+1]],R[3]);
  p.poly([[-half-1,eave],[-half+8,ridge],[half-8,ridge],[half+1,eave]],R[2]);
  p.poly([[half-8,ridge],[half-8+depth,ridge-depth+1],[half+depth+1,eave-depth],[half+1,eave]],R[1]);
  p.line(-half+8,ridge,half-8,ridge,R[4]);
  p.line(-half+5,ridge+5,half-5,ridge+5,R[3]);
  p.line(-half+1,eave-3,half-1,eave-3,R[1]);
  p.line(-half-1,eave,half+1,eave,R[4]);
  if(green){
    for(let x=-half+12;x<half-8;x+=9){
      p.line(x,ridge-2,x-4,eave,R[3]);
      p.ellipse(x-4,base-6,3,4,R[1]);
      p.line(x-6,base-7,x-6,base-11,GOLD[1]);
    }
  } else {
    p.rect(-half+5,eave+5,12,9,C[4]);
    p.rect(-half+6,eave+6,10,7,STEEL[0]);
    p.line(-half+10,eave+6,-half+10,eave+12,C[2]);
    p.line(-half+6,eave+9,-half+6+9,eave+9,C[2]);
  }
  const door=coop?9:green?11:21, x=coop?4:-Math.floor(door/2);
  p.rect(x-1,base-15,door+2,15,C[0]);
  p.rect(x,base-14,door,13,o.open&&!green?STEEL[0]:W[1]);
  p.line(x,base-14,x+door-1,base-14,C[4]);
  if(coop&&o.open){
    p.poly([[x,base-1],[x+door,base-1],[x+door+3,4],[x+3,4]],C[2]);
    for(const y of [-5,-2,1])p.line(x+1,y,x+door,y,C[4]);
  } else if(!green&&o.open){
    for(let i=0;i<5;i++) p.px(x+3+i*3,base-2,GOLD[2]);
  } else {
    p.px(x+door-3,base-8,GOLD[3]);
    if(green)p.line(x+2,base-12+Math.round(wave(t)),x+6,base-10,R[4]);
  }
});

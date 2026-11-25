import { asset, CREAM, GOLD, LEAF, RED, STEEL, WATER, WOOD, box, round, wave } from "./art.js";
import { toolColors } from "./tool-tiers.js";
import { groundShadow } from "./sprite.js";

const specs={
  hoe:["A long-handled flat-bladed hoe.","hoe"], sickle:["A hooked steel sickle.","hook"],
  shears:["Two hinged blades with red handles.","scissors"], "milking-bucket":["A bucket with a wire handle and white milk.","bucket"],
  "bug-net":["A mesh ring on a wooden handle.","net"], "magnifying-glass":["A brass-rimmed glass lens.","lens"],
  compass:["A brass compass with a moving needle.","compass"], "grappling-hook":["A three-pronged hook on a coil of rope.","grapple"],
  "hand-drill":["A compact drill with a spinning auger.","drill"],chainsaw:["A motor housing and long toothed bar.","chainsaw"],
  jackhammer:["A tall impact tool with a pulsing chisel.","jackhammer"],
  "advanced-sprinkler":["A rotating sprinkler with four spray arms.","spray"],
  "golden-sprinkler":["A gold sprinkler with two wide spray arms.","spray"],
  "irrigation-pipe":["A metal elbow pipe with a valve.","pipe"],
  backpack:["A stitched backpack with pockets and straps.","pack"],
  "fishing-bait":["A curled red bait worm.","bait"],"fishing-hook":["A small steel hook with barbed point.","hook-wire"],
  "treasure-detector":["A detector with a search coil and signal display.","detector"],
};
const moving=new Set(["compass","drill","chainsaw","jackhammer","spray","detector","bait"]);
function shaft(p,x=-12,y=0,x1=1,y1=-22){p.beam(x,y,x1,y1,4,WOOD[0]);p.line(x-1,y-1,x1-1,y1-1,WOOD[4]);}
function drawTool(p,kind,C,phase,gold){
  const swing=wave(phase);
  switch(kind){
    case "hoe":shaft(p);p.poly([[-1,-25],[9,-25],[13,-22],[11,-18],[-1,-20]],C[1]);p.line(-1,-24,11,-22,C[4]);break;
    case "hook":shaft(p,-9,1,0,-17);p.arc(1,-18,10,3,-2.9,0.45,C[2]);p.arc(1,-18,9,1,-2.9,-0.7,C[4]);break;
    case "scissors":
      for(const a of [-1,1]){p.ring(a*6,-4,5,1.9,RED[2]);p.beam(a*4,-9,-a*6,-25,4,C[2]);p.line(a*3,-10,-a*5,-25,C[4]);}
      p.circle(0,-15,2,C[1]);break;
    case "bucket":p.arc(0,-17,9,2,Math.PI,Math.PI*2,C[2]);p.poly([[-10,-17],[10,-17],[7,0],[-7,0]],C[1]);
      p.line(-7,-14,-5,-1,C[3]);p.ellipse(0,-17,10,3.5,C[3]);p.ellipse(0,-17,8,2.3,CREAM[4]);break;
    case "net":
    case "lens":{
      shaft(p,-12,0,0,-16);p.ellipse(3,-22,10,8,C[0]);p.ellipse(3,-22,8,6.3,WATER[2]);
      p.line(-2,-25,2,-27,C[4]);
      if(kind==="net")for(const i of [-4,0,4]){p.line(i,-25,i+4,-18,C[3]);p.line(i+4,-26,i,-18,C[3]);}
      else p.line(2,-19,7,-24,WATER[4]);break;
    }
    case "compass":round(p,0,-13,12,11,C);p.circle(0,-13,8,CREAM[3]);
      p.line(0,-13,Math.sin(phase*6.28)*7,-13+Math.cos(phase*6.28)*7,RED[3]);p.circle(0,-13,2,C[2]);break;
    case "grapple":p.ring(-4,-8,10,2.6,WOOD[3]);p.ring(-4,-8,7,1.4,GOLD[2]);
      p.beam(-2,-10,8,-23,4,C[2]);p.arc(8,-22,7,1.8,0.2,2.9,C[4]);break;
    case "drill":
    case "chainsaw":{
      box(p,-13,-9,17,11,4,RED);p.ring(-7,-8,5,2,WOOD[1]);p.rect(3,-22,13,8,C[1]);
      p.line(4,-21,15,-21,C[4]);
      for(let i=0;i<4;i++){const x=4+i*3+Math.floor(phase*6)%3;p.px(x,-14,C[4]);if(kind==="drill")p.line(x,-20,x-2,-17,C[3]);}
      break;
    }
    case "jackhammer":{
      const y=Math.round(swing*2);p.beam(0,-9,0,-1+y,3,C[4]);box(p,-7,-8+y,13,15,2,RED);
      p.beam(-9,-28,9,-28,3,C[1]);p.line(-6,-27,5,-27,C[4]);break;
    }
    case "spray":{
      round(p,0,0,9,4,STEEL);p.beam(0,-2,0,-15,5,C[2]);
      const n=gold?2:4;
      for(let i=0;i<n;i++){
        const a=phase*6.28+i*6.28/n, dx=Math.cos(a),dy=Math.sin(a);
        p.line(0,-15,dx*12,-15+dy*5,C[4]);p.dot(dx*16,-13+dy*6,WATER[4],0.75);
      }break;
    }
    case "pipe":p.beam(-9,-2,-9,-13,8,C[1]);p.beam(-9,-13,9,-13,8,C[2]);
      p.line(-11,-11,-11,-3,C[4]);p.ellipse(10,-13,3,5,C[3]);p.ellipse(10,-13,1.5,3,C[0]);p.ring(-3,-21,5,1.6,RED[3]);break;
    case "pack":p.arc(0,-14,10,2,Math.PI,Math.PI*2,C[1]);box(p,-10,0,19,17,4,C);
      p.rect(-6,-10,11,8,C[1]);p.line(-5,-10,4,-10,C[4]);p.line(-7,-18,-7,-2,GOLD[2]);break;
    case "bait":p.arc(0,-9,7,3,-0.3+swing*0.1,4.3,RED[3]);p.px(5,-13,RED[4]);break;
    case "hook-wire":p.line(4,-27,4,-10,C[4]);p.arc(-2,-10,6,2,0,3.45,C[3]);p.px(-8,-13,C[4]);p.ring(4,-27,2,1,C[2]);break;
    case "detector":shaft(p,0,-3,6,-26);p.ellipse(-3,-2,11,4,C[0]);p.ellipse(-3,-2,9,2.7,C[3]);
      p.rect(2,-29,9,7,C[1]);p.rect(4,-28,4,3,LEAF[2+Number(swing>0)]);break;
  }
}
export function extraTool(id){
  const [desc,kind]=specs[id], gold=id==="golden-sprinkler", field=kind==="spray";
  const palette=gold||["lens","compass"].includes(kind)?GOLD:kind==="pack"?WOOD:STEEL;
  return asset({name:id.replaceAll("-"," "),desc,tags:["tool",kind],size:[48,48],origin:[24,36],palette,
    fps:moving.has(kind)?12:1,duration:moving.has(kind)?2:1,bg:field?"field":"dark",options:id==="hoe"?{tier:0}:{}},
    (p,t,C,o)=>{if(field)groundShadow(p,0,0,10,3);drawTool(p,kind,toolColors(C,o.tier),t,gold);});
}

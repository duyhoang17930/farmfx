import { ease, rand, seg, TAU } from "../../core/index.js";
import { asset, CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, box, post, round, wave } from "./art.js";
import { glints, puff } from "./farm-feedback.js";
import { groundShadow, twinkle } from "./sprite.js";
import { withSurfaceDetail } from "./surface-detail.js";

const animations=/reveal|emerge|expand|construction|respawn|dig|discovery/;
const footprints={"boat-dock":{width:40,height:10},"secret-door":{width:36,height:8}};
function plot(p,C,t,id,opacity){
  const y=id==="island-emerge"?-12*(1-ease.outCubic(t)):0,w=id==="island-expand"?14+8*ease.outCubic(t):id==="secret-island"?17:22;
  // a top-down 3/4 plot, like the island tiles: a flat top face with clipped corners and, for solid land, a
  // front face of earth under it. No isometric diamond: the ground is a plan seen from above.
  const top=y-19,bot=y-2;
  const rim=[[-w+2,top],[w-2,top],[w,top+2],[w,bot-2],[w-2,bot],[-w+2,bot],[-w,bot-2],[-w,top+2]];
  if(/emerge|preview|reveal|expand|locked|secret/.test(id)){
    p.poly([[-w,bot-2],[-w+2,bot],[w-2,bot],[w,bot-2],[w,bot+3],[w-2,bot+5],[-w+2,bot+5],[-w,bot+3]],WOOD[2],opacity);
    p.line(-w+2,bot+5,w-2,bot+5,WOOD[1],opacity);
    p.poly(rim,C[2],opacity*.85);
    p.line(-w+2,top+1,w-3,top+1,C[4],opacity);
    if(id==="secret-island"){const c=y-10;p.tri(-4,c,0,c-8,4,c,LEAF[4],opacity);p.line(0,c-2,0,c+2,WOOD[4],opacity);}
  }
  p.polyline([...rim,rim[0]],C[4],opacity);
}
export function explorationAddition(id){
  const animated=animations.test(id), island=id.startsWith("island")||id==="secret-island";
  const portal=/portal|gate|fast-travel/.test(id), treasure=/treasure|artifact|fossil/.test(id);
  const water=/boat|raft|dock|fishing/.test(id);
  const palette=island?LEAF:portal?VIOLET:water?WATER:treasure?GOLD:STEEL;
  const size=id==="fog-of-war"?[96,64]:[64,64],origin=[size[0]/2,size[1]-14];
  const fx=asset({name:id.replaceAll("-"," "),desc:`A top-down ${id.replaceAll("-"," ")} visual for island exploration.`,
    tags:["exploration",island?"island":portal?"portal":water?"water":treasure?"treasure":"marker"],size,origin,palette,
    loop:!animated,duration:animated?1.25:2.5,fps:16,options:{active:true}},(p,t,C,o)=>{
    if(!o.active||animated&&t>=1)return;
    const fade=animated?1-seg(t,.66,1):1;
    if(id==="fog-of-war"){
      p.shade(-47,-48,47,9,(x,y,v)=>{
        const d=Math.min(1,Math.hypot(x/46,(y+19)/30));v.a=Math.max(0,1-d)*.55;return C[0];
      });return;
    }
    if(island){
      plot(p,C,t,id,fade);
      if(id==="island-locked-overlay"){
        p.arc(0,-15,4,1.8,Math.PI,TAU,GOLD[4]);p.rect(-4,-15,9,6,GOLD[2]);p.px(0,-12,STEEL[0]);
      }
      if(animated){glints(p,t,GOLD,o,6);if(id.includes("construction"))puff(p,t,WOOD,o,5);}
    }else if(portal){
      groundShadow(p,0,0,18,4);
      if(id==="fast-travel-point"){
        p.ellipse(0,-2,17,5,STEEL[1]);p.ellipse(0,-3,13,3,VIOLET[3]);
        p.poly([[0,-29],[7,-19],[0,-11],[-7,-19]],C[3]);p.line(0,-28,0,-12,C[4]);p.glow(0,-18,10,C[3],.25);return;
      }
      p.ellipse(0,-2,19,5,STEEL[1]);p.beam(-13,0,-13,-31,6,STEEL[2]);p.beam(13,0,13,-31,6,STEEL[2]);
      p.arc(0,-29,13,2.5,Math.PI,TAU,C[3]);
      p.ellipse(0,-18,11,16,C[1],0.56);
      for(let i=0;i<5;i++){const a=(t+i/5)*TAU;twinkle(p,Math.cos(a)*8,-17+Math.sin(a)*12,2,C[3],C[4]);}
      p.glow(0,-16,14,C[3],.28);
      if(id==="teleport-gate")p.line(-12,-30,12,-30,STEEL[4]);
    }else if(water){
      const bob=wave(t)*1.3;
      p.ellipse(0,-2,21,5,WATER[2]);p.line(-17,-2,11,-2,WATER[4],0.61);
      if(id==="fishing-spot"){p.ellipse(0,-4,11+wave(t)*3,3,C[4],.65);p.px(2,-7+wave(t),RED[4]);return;}
      p.poly([[-21,-7+bob],[19,-7+bob],[15,2+bob],[-12,2+bob]],WOOD[1]);p.line(-21,-7+bob,19,-7+bob,WOOD[4]);
      if(id.includes("sailing")){post(p,0,-7+bob,27,WOOD);p.tri(1,-33+bob,1,-11+bob,16,-11+bob,CREAM[4]);}
      if(id==="boat-dock"||id==="raft")for(let x=-16;x<18;x+=5)p.line(x,-7+bob,x+2,1+bob,WOOD[3]);
      else p.line(-10,-6+bob,10,-6+bob,WOOD[2]);
      if(id==="boat-dock")for(const x of [-20,17])post(p,x,-1,14,WOOD);
    }else if(treasure){
      if(id.includes("dig")||id.includes("buried")){p.ellipse(0,0,15,5,WOOD[1],fade);if(animated)puff(p,t,WOOD,o,6);}
      const rise=animated?10*ease.outQuad(t):0;
      if(id.includes("fossil")||id.includes("artifact")){
        p.ellipse(0,-8-rise,12,8,WOOD[2],fade);
        if(id.includes("fossil"))p.arc(0,-9-rise,6,1.8,0,5.4,CREAM[4],fade);
        else p.polyline([[-6,-8-rise],[0,-15-rise],[6,-8-rise],[0,-4-rise],[-6,-8-rise]],GOLD[4],fade);
      }else if(!id.includes("marker")){
        p.rect(-10,-15-rise,21,14,WOOD[1],fade);p.rect(-9,-12-rise,19,9,WOOD[3],fade);
        p.line(-9,-14-rise,9,-14-rise,GOLD[4],fade);p.rect(-2,-13-rise,5,5,GOLD[3],fade);
      }else{
        p.line(-5,-12,5,-4,GOLD[4]);p.line(5,-12,-5,-4,GOLD[4]);
      }
      if(animated)glints(p,t,C,o,8);
    }else if(id==="secret-door"||id==="cave-discovery"){
      p.poly([[-18,0],[-17,-26],[-7,-33],[8,-33],[17,-23],[18,0]],STEEL[2],fade);
      p.poly([[-10,0],[-10,-19],[0,-26],[10,-19],[10,0]],STEEL[0],fade);
      p.line(-11,-17,0,-27,C[4],fade);
      if(animated)glints(p,t,C,o,6);
    }else if(id==="resource-respawn"||id==="resource-highlight"){
      p.ellipse(0,-2,16+wave(t)*2,5,C[3],fade*.64);
      for(let i=0;i<5;i++)twinkle(p,(rand(i,7,o.seed)-.5)*28,-5-16*(t+i/5)%16,1.8*fade,C[3],C[4]);
    }else{
      groundShadow(p,0,0,10,3);
      if(id==="exploration-flag"){
        post(p,0,0,31,WOOD);p.poly([[1,-31],[19,-27+wave(t)*2],[14,-20],[1,-23]],RED[3]);p.line(1,-30,16,-27,RED[4]);
      }else{
        const y=-16+Math.round(wave(t)*2);
        p.poly([[0,y-10],[8,y-5],[6,y+2],[0,y+10],[-6,y+2],[-8,y-5]],C[1]);
        p.circle(0,y-2,3.5,C[4]);p.px(-1,y-3,C[2]);
        if(id==="waypoint")p.ellipse(0,-1,10,3,C[3],.65);
      }
    }
  });
  const collision=footprints[id];
  const out={...fx,meta:{...fx.meta,...(collision?{collision}:{}),...(animated?{events:{completion:fx.meta.duration}}:{})}};
  // markers and overlays are UI on the ground; things that stand (boats, doors, flags, chests) get the outline
  return /marker|waypoint|fog|border|highlight|respawn|preview|overlay|bracket|reveal|expand|emerge|construction|unlock|spot/.test(id)?out:withSurfaceDetail(out,undefined,{outline:true,detail:false});
}

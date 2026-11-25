import { asset, GOLD, STEEL, WOOD, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

function gear(p,x,y,r,t,C) {
  p.ellipse(x,y,r,r,C[0]);
  p.ellipse(x,y,r-1,r-1,C[2]);
  for(let i=0;i<8;i++){
    const u=t+i/8, dx=wave(u),dy=wave(u,1,.25);
    p.beam(x+dx*(r-1),y+dy*(r-1),x+dx*(r+1),y+dy*(r+1),2,C[1]);
  }
  p.circle(x,y,2,C[0]);
  p.px(x-1,y-1,GOLD[4]);
}

export const { meta, draw } = asset({
  name:"Coastal workshop",desc:"Timber and brass machines with distinct frames, hoppers, chimneys and moving drive systems.",
  tags:["machine","workshop","coast"],size:[64,64],origin:[32,51],duration:2,fps:16,
  palette:STEEL,options:{ machine:"saw", active:true },
},(p,t,C,o)=>{
  if(o.machine==="belt"){
    p.rect(-8,-9,16,14,WOOD[0]);
    p.rect(-8,-8,16,10,C[1]);
    p.line(-8,-9,7,-9,WOOD[4]);
    p.line(-8,2,7,2,WOOD[3]);
    const step=o.active?Math.floor(t*16)%4:0;
    for(let x=-8;x<8;x++){
      if((x-step+16)%4!==0)continue;
      p.line(x,-7,x,0,C[2]);
      p.px(x,-5,C[3]);
    }
    p.line(-8,4,7,4,WOOD[2]);
    return;
  }
  groundShadow(p,1,1,20,4,.75);
  const turn=o.active?t:0;
  if(o.machine==="grinder") {
    p.poly([[-14,-5],[-12,-20],[12,-20],[15,-8],[10,1],[-12,1]],C[0]);
    p.poly([[-12,-7],[-10,-18],[10,-18],[12,-8],[9,-2],[-11,-2]],C[2]);
    p.poly([[-17,-34],[14,-34],[18,-29],[8,-17],[-9,-17]],WOOD[0]);
    p.poly([[-16,-32],[13,-32],[16,-29],[7,-20],[-8,-20]],WOOD[3]);
    p.poly([[-15,-32],[13,-32],[11,-29],[-12,-29]],C[0]);
    p.line(-16,-34,13,-34,WOOD[4]);
    p.line(-8,-20,7,-20,GOLD[2]);
    gear(p,6,-9,5,turn,C);
    p.line(-10,-8,-5,-8,C[4]);
    if(o.active) p.px(-7+Math.floor(t*5),-31,GOLD[4]);
    return;
  }
  if(o.machine==="smelter"){
    p.poly([[-16,-4],[-15,-24],[-10,-31],[9,-31],[15,-24],[16,-5],[12,1],[-12,1]],C[0]);
    p.poly([[-14,-5],[-13,-23],[-9,-29],[8,-29],[12,-24],[12,-4],[-10,-1]],C[2]);
    p.poly([[-12,-23],[-9,-29],[7,-29],[10,-25]],C[3]);
    p.rect(6,-39,8,13,C[0]); p.rect(7,-37,4,11,C[2]); p.line(6,-39,13,-39,C[4]);
    p.poly([[-9,-4],[-9,-13],[-5,-18],[5,-18],[9,-13],[9,-4]],WOOD[0]);
    p.line(-8,-11,-4,-16,WOOD[4]);
    if(o.active){
      p.poly([[-6,-5],[-5,-11],[-2,-9],[1,-14+Math.round(wave(t,2))],[4,-10],[6,-5]],GOLD[2]);
      p.line(-3,-6,3,-6,GOLD[4]);
      for(let i=0;i<4;i++){const a=(t+i/4)%1;p.dot(9+2*wave(a),-41-a*8,C[3],Math.sin(a*Math.PI)*.6);}
    }
    return;
  }
  if(o.machine==="assembler"){
    p.poly([[-21,-4],[-15,-9],[18,-9],[21,-3],[17,2],[-18,2]],C[0]);
    p.poly([[-19,-4],[-14,-8],[17,-8],[19,-4],[15,-1],[-17,-1]],C[2]);
    p.line(-15,-7,17,-7,C[4]);
    p.rect(-16,-21,15,16,WOOD[0]);p.rect(-15,-20,12,12,WOOD[2]);
    gear(p,-9,-15,6,turn,C);gear(p,-1,-11,4,-turn,C);
    const swing=o.active?3*wave(t):0;
    p.beam(12,-5,12,-25,7,C[0]);p.line(10,-7,10,-24,C[3]);
    p.beam(12,-25,3+swing,-29,6,C[0]);p.beam(11,-27,3+swing,-31,2,C[4]);
    p.line(3+swing,-29,1+swing,-17,GOLD[2]);
    p.line(1+swing,-17,-2+swing,-14,C[3]);p.line(1+swing,-17,4+swing,-14,C[3]);
    p.px(12,-24,GOLD[4]);
    return;
  }
  const gen=o.machine==="generator", anvil=o.machine==="anvil";
  if(gen){
    p.poly([[-18,-4],[-13,-9],[16,-9],[19,-4],[16,1],[-16,1]],WOOD[0]);
    p.line(-16,-6,16,-6,WOOD[3]);
    p.poly([[-15,-6],[-15,-24],[-10,-31],[13,-31],[18,-24],[18,-10],[14,-5]],C[0]);
    p.poly([[-14,-24],[-9,-30],[12,-30],[17,-25],[-14,-23]],C[3]);
    p.rect(-14,-23,27,16,C[2]);
    p.line(-14,-23,12,-23,C[4]);
    for(const vent of [-12,-9,-6,-3])p.line(vent,-20,vent,-12,C[0]);
    gear(p,8,-15,6,turn,C);
    p.line(-9,-9,-5,-9,GOLD[2]);p.px(-10,-9,o.active?GOLD[4]:C[2]);
    return;
  }
  if(anvil){
    p.poly([[-11,-1],[-10,-13],[-6,-16],[8,-16],[11,-10],[10,1],[-9,1]],WOOD[0]);
    p.poly([[-9,-2],[-8,-12],[-5,-15],[7,-15],[9,-10],[8,-1]],WOOD[2]);
    p.line(-8,-9,-6,-2,WOOD[4]);p.line(5,-13,6,-1,WOOD[1]);
    p.poly([[-15,-23],[15,-23],[12,-18],[5,-17],[4,-14],[-8,-14],[-7,-18],[-12,-20]],C[0]);
    p.poly([[-14,-23],[14,-23],[11,-20],[-10,-20]],C[3]);
    p.line(-13,-23,13,-23,C[4]);
    return;
  }
  if(o.machine==="pump"){
    p.poly([[-11,-4],[-6,-8],[8,-8],[13,-4],[10,1],[-10,1]],C[0]);
    p.line(-6,-7,7,-7,C[4]);
    p.poly([[-6,-3],[-7,-27],[-4,-32],[4,-32],[7,-27],[7,-21],[15,-21],[15,-17],[5,-17],[5,-3]],C[0]);
    p.rect(-5,-27,9,23,C[2]);p.line(-4,-28,3,-28,C[4]);
    p.line(4,-20,14,-20,C[3]);p.rect(-8,-25,16,2,GOLD[2]);
    p.line(3,-30,12,-33,WOOD[2]);
    if(o.active){const a=(t*2)%1;p.dot(14,-16+Math.floor(a*8),C[4],1-a);}
    return;
  }
  const saw=o.machine==="saw";
  if(!saw){
    p.beam(-13,1,-6,-20,4,WOOD[0]);p.beam(3,1,-3,-18,4,WOOD[1]);
    p.line(-13,-1,-7,-19,WOOD[3]);p.line(-11,-3,2,-3,WOOD[1]);
    p.rect(4,-9,10,4,WOOD[2]);p.px(6,-9,WOOD[4]);
    p.ellipse(-5,-18,10,11,WOOD[0]);p.ellipse(-5,-18,8,9,WOOD[1]);
    for(let i=0;i<6;i++){const u=turn+i/6;p.line(-5,-18,-5+7*wave(u),-18+8*wave(u,1,.25),WOOD[4]);}
    p.px(-5,-18,GOLD[3]);
    p.line(0,-14,11,-9,GOLD[2]);
    return;
  }
  const radius=16;
  for(const x of [-radius+2,radius-4]){
    p.rect(x,-12,4,13,WOOD[0]); p.line(x+1,-9,x+1,-1,WOOD[2]);
  }
  p.poly([[-radius-3,-11],[-radius+1,-16],[radius+4,-16],[radius+3,-9],
    [radius,-6],[-radius-3,-6]],WOOD[0]);
  p.poly([[-radius-2,-11],[-radius+2,-15],[radius+3,-15],[radius,-10]],WOOD[3]);
  p.line(-radius+2,-15,radius+3,-15,WOOD[4]);
  p.line(-radius-2,-8,radius,-8,WOOD[2]);
  p.beam(-14,1,-6,-11,3,WOOD[1]); p.beam(11,1,5,-11,3,WOOD[1]);
  p.line(-11,-7,12,-7,C[1]);
  p.rect(-12,-18,6,4,WOOD[1]);p.line(-11,-18,-7,-18,WOOD[4]);
  gear(p,2,-18,7,turn,C);
  p.line(-5,-14,12,-14,C[4]);
});

import { asset, GOLD, STEEL, WOOD, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = asset({
  name:"Coastal workshop",desc:"Running workshop machines with worn timber frames, lit steel and brass fittings.",
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
  const gen=o.machine==="generator", anvil=o.machine==="anvil";
  const radius=gen?17:anvil?12:16;
  for(const x of [-radius+2,radius-4]){
    p.rect(x,-12,4,13,WOOD[0]); p.line(x+1,-9,x+1,-1,WOOD[2]);
  }
  p.poly([[-radius-3,-11],[-radius+1,-16],[radius+4,-16],[radius+3,-9],
    [radius,-6],[-radius-3,-6]],WOOD[0]);
  p.poly([[-radius-2,-11],[-radius+2,-15],[radius+3,-15],[radius,-10]],WOOD[3]);
  p.line(-radius+2,-15,radius+3,-15,WOOD[4]);
  p.line(-radius-2,-8,radius,-8,WOOD[2]);
  if(o.machine==="pump"){
    p.poly([[-8,-15],[-8,-33],[-5,-37],[5,-37],[8,-33],[8,-21],[16,-21],[16,-16],[-8,-15]],C[0]);
    p.rect(-6,-33,11,16,C[2]);
    p.line(-5,-35,4,-35,C[4]);
    p.line(4,-20,15,-20,C[3]);
    p.rect(-9,-30,18,2,GOLD[2]);
    p.line(-6,-32,-6,-24,C[3]);
    p.line(3,-35,12,-36,WOOD[2]);
    if(o.active) p.dot(14,-15+Math.floor(t*5),C[4],1-t);
    return;
  }
  if(anvil){
    p.poly([[-15,-23],[15,-23],[12,-18],[5,-17],[4,-14],[-8,-14],[-7,-18],[-12,-20]],C[0]);
    p.poly([[-14,-23],[14,-23],[11,-20],[-10,-20]],C[3]);
    p.line(-13,-23,13,-23,C[4]);
    p.line(-8,-18,4,-18,C[2]);
    return;
  }
  const saw=o.machine==="saw", x=gen?9:saw?1:-6, y=gen?-21:saw?-17:-25;
  const r=gen?6:saw?7:9;
  if(gen){
    p.poly([[-15,-15],[-15,-27],[-11,-32],[13,-32],[18,-27],[18,-17],[14,-12],[-14,-12]],C[0]);
    p.poly([[-14,-26],[-10,-31],[12,-31],[17,-27],[-14,-25]],C[3]);
    p.rect(-14,-25,27,11,C[2]);
    p.line(-14,-25,12,-25,C[4]);
    for(const vent of [-11,-8,-5,-2]) p.line(vent,-23,vent,-16,C[0]);
    p.px(-10,-15,o.active?GOLD[4]:C[2]);
  } else if(!saw) {
    p.line(-8,-22,-10,-13,WOOD[1]);
    p.line(5,-16,11,-17,WOOD[1]);
    p.rect(10,-18,4,4,GOLD[2]);
  }
  p.ellipse(x,y,r,r*.86,C[0]);
  p.ellipse(x,y,r-1,(r-1)*.86,gen?C[1]:saw?C[3]:WOOD[1]);
  for(let i=0;i<(saw?10:6);i++){
    const phase=i/(saw?10:6)+(o.active?t:0);
    const dx=wave(phase), dy=wave(phase,1,.25);
    if(saw)p.px(x+dx*r,y+dy*r*.85,C[4]);
    else p.line(x,y,x+dx*(r-1),y+dy*(r-1)*.85,gen?C[3]:WOOD[4]);
  }
  p.px(x-1,y-1,GOLD[4]);
});

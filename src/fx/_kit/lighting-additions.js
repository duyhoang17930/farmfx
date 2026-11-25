import { clamp, rand } from "../../core/index.js";
import { asset, CREAM, GOLD, RED, STEEL, VIOLET, WATER, wave } from "./art.js";

export function lightAsset(id){
  const shadow=id.includes("shadow"), darkness=id.includes("darkness");
  const ambient=id==="ambient-light", window=id==="window-light";
  const live=/flicker|pulse|campfire|furnace|torch|lava/.test(id);
  const values={"radial-light":[34,.72],"lantern-light":[24,.77],"street-light":[35,.84],"campfire-light":[32,.66],
    "torch-light":[19,.84],"light-pulse":[28,.92],"point-light":[15,.86],"magic-light":[29,.71],"crystal-light":[21,.80]};
  const [defaultRadius,intensity]=values[id]??[shadow?18:34,.72];
  const palette=shadow||darkness?STEEL:/crystal|magic/.test(id)?VIOLET:/lava|furnace|campfire/.test(id)?RED:window?WATER:GOLD;
  return asset({name:id.replaceAll("-"," "),desc:`A configurable ${id.replaceAll("-"," ")} layer with adjustable radius and intensity.`,
    tags:["lighting",shadow?"shadow":darkness?"mask":"light"],size:[96,80],origin:[48,45],palette,duration:live?2.5:1,
    fps:live?16:1,bg:"dark",options:{radius:defaultRadius,intensity}},(p,t,C,o)=>{
    const radius=Math.max(3,Math.min(36,o.radius)), q=clamp(o.intensity);
    const glow=q*(live?.82+wave(t,id.includes("flicker")?5:2)*.15+wave(t,3)*.03:1);
    if(shadow){
      const width=id==="character-shadow"?radius*.52:id==="building-shadow"?radius*1.1:radius;
      const depth=id==="tree-shadow"?6:id==="character-shadow"?3:7;
      if(id==="building-shadow"){p.rect(-width,0,width*2,depth+1,C[0],q*.64);p.ellipse(width*.24,depth,width,depth,C[0],q*.3);}
      else {p.ellipse(4,1,width,depth,C[0],q*.4);p.ellipse(3,0,width*.8,depth*.73,C[1],q*.63);}
    }else if(darkness||ambient){
      p.shade(-48,-45,48,35,(x,y,v)=>{
        if(x>=48||y>=35)return;
        const d=Math.hypot(x,y);
        v.a=(darkness?clamp((d-radius*.32)/(radius*.88)):1)*q*(id==="dungeon-darkness"?.91:.67);
        return C[0];
      });
    }else if(window){
      p.poly([[-12,-21],[3,-21],[24,11],[-0,13]],C[2],q*.25);
      p.line(-9,-18,7,11,C[4],q*.49);p.line(-2,-18,17,10,C[4],q*.39);
    }else{
      const source=id==="point-light"?0:-5;
      p.glow(0,source,radius,C[3],glow);
      p.glow(0,source,radius*.56,C[4],glow*.57);
      if(/fire|torch|lava|flicker|magic|pulse/.test(id))for(let i=0;i<4;i++){
        const u=(t+rand(i,3,o.seed))%1;
        p.dot((rand(i,4,o.seed)-.5)*radius,-4-u*17,C[4],Math.sin(Math.PI*u)*glow);
      }
    }
  });
}

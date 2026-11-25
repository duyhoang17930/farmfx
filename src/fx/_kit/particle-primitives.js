import { ease, rand, TAU } from "../../core/index.js";
import { asset, CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, round } from "./art.js";
import { twinkle } from "./sprite.js";

const styles={
 cloud:"dust smoke steam",
 shard:"wood-chip stone-chip metal-chip crystal-shard soil-clod",
 sprite:"star leaf water-drop water-bubble snowflake ember flame magic-orb magic-dust poison-drop heart coin experience-orb glowing-pixel",
 flash:"spark light-ray shockwave-ring",
};
function palette(id){
  if(/wood|dust|soil/.test(id))return WOOD;
  if(/smoke|stone|metal/.test(id))return STEEL;
  if(/water|snow|crystal|steam/.test(id))return WATER;
  if(/leaf|poison|experience/.test(id))return LEAF;
  if(/flame|ember|heart/.test(id))return RED;
  if(id.includes("magic"))return VIOLET;
  return GOLD;
}
export function paintParticle(p,id,x,y,C,u,a,s,opacity){
  const kind=Object.keys(styles).find(k=>styles[k].split(" ").includes(id));
  if(kind==="cloud"){
    p.disc(x,y,s*(.9+u),C[2],opacity*.57);p.disc(x-.7,y-1,s*(.65+u*.6),C[4],opacity*.31);
  }else if(kind==="shard"){
    const dx=Math.cos(a)*s,dy=Math.sin(a)*s;
    p.tri(x-dx,y-dy,x+dx,y+dy,x+dy*.75,y-dx*.75,C[2],opacity);
    p.line(x-dx,y-dy,x+dy*.75,y-dx*.75,C[4],opacity);
  }else if(id==="shockwave-ring"){
    p.ring(x,y,s*(1+u*3),1.8,C[4],opacity*.77);
  }else if(id==="spark"||id==="light-ray"){
    const length=id==="light-ray"?s*4:s;
    p.line(x-Math.cos(a)*length,y-Math.sin(a)*length,x,y,C[4],opacity);
    p.glow(x,y,s+1,C[3],opacity*.34);
  }else if(id==="star"||id==="magic-dust"){
    twinkle(p,x,y,s*opacity,C[2],C[4]);
  }else if(id==="heart"){
    p.poly([[x-s,y-1],[x-s*.5,y-s],[x,y-1],[x+s*.5,y-s],[x+s,y-1],[x,y+s]],C[3],opacity);
  }else if(id==="leaf"||id==="flame"){
    p.poly([[x,y-s],[x+s,y],[x,y+s],[x-s,y]],C[2],opacity);p.line(x-1,y+1,x+1,y-2,C[4],opacity);
  }else if(id==="water-bubble"){
    p.ring(x,y,s,1,C[4],opacity);p.px(x-s/2,y-s/2,C[4]);
  }else if(id==="snowflake"){
    for(let i=0;i<3;i++){const z=a+i*Math.PI/3;p.line(x-Math.cos(z)*s,y-Math.sin(z)*s,x+Math.cos(z)*s,y+Math.sin(z)*s,C[4],opacity);}
  }else if(id.endsWith("-drop")){
    p.ellipse(x,y,s*.65,s,C[2],opacity);p.dot(x-1,y-s*.3,C[4],opacity);
  }else if(id==="coin"){
    p.ellipse(x,y,Math.max(1,Math.abs(Math.cos(a))*s),s,C[3],opacity);
    p.dot(x-1,y-1,C[4],opacity);
  }else{
    p.circle(x,y,Math.max(.6,s*.75),C[3],opacity);p.dot(x-1,y-1,C[4],opacity);
    p.glow(x,y,s+2,C[3],opacity*.3);
  }
}
export function particlePrimitive(id){
  const kind=Object.keys(styles).find(k=>styles[k].split(" ").includes(id));
  return asset({name:id.replaceAll("-"," "),desc:`A reusable seeded ${id.replaceAll("-"," ")} particle with adjustable count and scale.`,
    tags:["particle",kind],size:[80,64],origin:[40,44],duration:2,fps:16,palette:palette(id),bg:"field",
    options:{count:kind==="cloud"?5:7,scale:1}},(p,t,C,o)=>{
    const total=Math.max(1,Math.min(22,Math.round(o.count))),s=Math.max(.5,Math.min(1.5,o.scale));
    for(let i=0;i<total;i++){
      const u=(t+i/total)%1, a=rand(i,6,o.seed)*TAU;
      const spread=ease.outCubic(u)*(9+rand(i,4,o.seed)*16);
      const dx=Math.cos(a)*spread,dy=-5+Math.sin(a)*spread*.45-u*10;
      const size=(1.9+2.3*rand(i,8,o.seed))*s,fade=Math.sin(Math.PI*u);
      paintParticle(p,id,dx,dy,C,u,a+t*TAU,size,fade);
    }
  });
}

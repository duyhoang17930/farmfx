import { asset, CREAM, GOLD, LEAF, RED, STEEL, WATER, WOOD, round, wave } from "./art.js";
import { groundShadow } from "./sprite.js";
import { toolColors, toolTiers } from "./tool-tiers.js";

function grip(p,x,y,ex,ey) {
  p.beam(x,y,ex,ey,3,WOOD[0]);p.line(x-0.6,y-1,ex-0.6,ey,WOOD[3]);p.px(x,y-1,WOOD[4]);
}

export const tools = {
  axe(p,C) {
    grip(p,-7,-1,4,-20);
    p.poly([[1,-18],[2,-23],[8,-24],[13,-21],[11,-14],[7,-14],[5,-18]],C[0]);
    p.poly([[3,-19],[4,-22],[8,-23],[12,-21],[10,-15],[8,-16],[7,-20]],C[2]);
    p.polyline([[11,-21],[12,-20],[10,-15]],C[4]);
  },
  pickaxe(p,C) {
    grip(p,-7,-1,3,-19);
    p.poly([[-10,-17],[-8,-21],[-1,-24],[7,-23],[12,-19],[13,-14],[8,-18],[2,-20],[-3,-20]],C[0]);
    p.polyline([[-9,-17],[-7,-21],[-1,-23],[6,-22],[11,-18]],C[3]);p.line(-2,-22,5,-22,C[4]);
  },
  shovel(p,C) {
    grip(p,-6,-1,5,-21);
    p.ring(6,-23,3,1.4,C[2]);p.line(4,-24,7,-25,C[3]);
    p.poly([[-9,-9],[-3,-5],[-3,-1],[-7,2],[-12,2],[-13,-2],[-11,-7]],C[0]);
    p.poly([[-9,-7],[-4,-4],[-5,-1],[-8,1],[-11,1],[-12,-2]],C[2]);p.line(-10,-5,-12,-2,C[4]);
  },
  scythe(p,C) {
    grip(p,-7,1,2,-20);p.line(-4,-6,-8,-11,WOOD[3]);
    p.poly([[0,-22],[4,-25],[10,-24],[14,-20],[10,-21],[6,-20],[3,-15],[0,-16]],C[0]);
    p.poly([[2,-22],[5,-24],[10,-23],[13,-20],[9,-21],[5,-20],[3,-16]],C[2]);p.line(5,-24,10,-23,C[4]);
  },
  "fishing-rod"(p,C,ph) {
    grip(p,-10,0,-6,-8);p.polyline([[-6,-8],[2,-20],[7,-25],[11,-23]],C[3]);
    p.line(11,-23,Math.round(8+wave(ph)),-5,STEEL[3]);
    round(p,-6,-6,2.7,2.4,STEEL);round(p,8+wave(ph),-4,1.9,2.2,RED);
  },
  hammer(p,C) {
    grip(p,-7,-1,3,-18);
    p.poly([[-6,-20],[-4,-24],[7,-24],[11,-21],[10,-15],[7,-14],[-6,-16]],C[0]);
    p.poly([[-5,-20],[-3,-23],[7,-23],[9,-21],[-5,-18]],C[3]);
    p.rect(-5,-19,13,3,C[2]);p.line(8,-22,10,-20,C[4]);p.line(-5,-16,6,-15,C[1]);
  },
  "watering-can"(p,C) {
    p.arc(6,-11,6,2,-Math.PI/2,Math.PI/2,C[0]);p.arc(7,-11,5,1,-Math.PI/2,Math.PI/2,C[3]);
    p.beam(-5,-6,-12,-14,4,C[1]);p.beam(-5,-8,-11,-14,2,C[3]);
    p.poly([[-15,-13],[-12,-17],[-10,-16],[-13,-12]],C[0]);p.px(-13,-16,C[4]);
    round(p,0,-7,8,7,C);p.ellipse(-1,-14,4,1.6,C[1]);p.line(-4,-14,1,-14,C[4]);
  },
  "seed-bag"(p,C) {
    p.poly([[-6,-20],[5,-20],[5,-16],[8,-12],[8,0],[-7,0],[-9,-5],[-7,-14]],C[0]);
    p.poly([[-5,-19],[4,-19],[3,-16],[7,-11],[7,-2],[-6,-2],[-7,-6],[-6,-13]],C[2]);
    p.line(-7,-14,6,-14,C[4]);p.rect(-4,-11,9,7,CREAM[3]);
    p.line(0,-5,0,-9,LEAF[2]);p.px(-1,-9,LEAF[3]);p.px(1,-8,LEAF[3]);p.px(2,-9,LEAF[2]);
  },
  bucket(p,C,ph) {
    p.arc(0,-15,6.2,2,Math.PI,Math.PI*2,STEEL[2]);
    p.poly([[-8,-14],[8,-14],[6,-1],[-6,-1]],C[0]);p.poly([[-7,-13],[7,-13],[5,-2],[-5,-2]],C[2]);
    for(const x of [-4,0,4])p.line(x,-13,x*.72,-2,C[1]);
    p.ellipse(0,-14,8,3,C[3]);p.ellipse(0,-14,6,1.85,WATER[1]);p.line(-4+wave(ph),-14,1+wave(ph),-14,WATER[4]);
    p.line(-6,-6,6,-6,STEEL[1]);
  },
  lantern(p,C,ph) {
    p.arc(0,-23,3,1,Math.PI,Math.PI*2,STEEL[3]);p.poly([[-3,-23],[3,-23],[7,-17],[-7,-17]],STEEL[1]);
    p.rect(-6,-17,12,14,STEEL[0]);p.rect(-5,-16,10,11,C[2]);p.rect(-4,-15,5,9,C[3]);
    const y=-9+Math.round(wave(ph,3));p.ellipse(0,y,2,3,C[4]);p.glow(0,-9,7,C[3],0.26+0.05*wave(ph,3));
    for(const x of [-4,4])p.line(x,-16,x,-6,STEEL[2]);p.rect(-7,-5,14,4,STEEL[1]);p.line(-5,-4,4,-4,STEEL[4]);
  },
  sprinkler(p,C,ph) {
    round(p,0,-3,6,3,STEEL);p.beam(0,-3,0,-13,4,STEEL[2]);
    const x=wave(ph)*6,y=-12+wave(ph,1,0.25)*2;
    p.beam(-x,y,x,-25-y,3,C[2]);p.px(0,-14,C[4]);
    for(let i=0;i<12;i++){
      const u=(ph*2+i/12)%1,a=i*2.399+ph*Math.PI*2;
      p.dot(Math.cos(a)*(6+12*u),-12-8*Math.sin(u*Math.PI)+8*u+Math.sin(a)*3,WATER[4],1-u*0.82);
    }
  },
  scarecrow(p,C,ph) {
    grip(p,0,0,0,-25);
    const swing=wave(ph)*1.1;
    p.beam(-12,-19+swing,12,-19-swing,3,WOOD[3]);
    p.poly([[-9,-21],[9,-21],[7,-14],[4,-14],[6,-8],[-5,-8],[-3,-15],[-8,-16]],C[0]);
    p.poly([[-8,-20],[8,-20],[6,-15],[3,-15],[5,-10],[-4,-10],[-2,-16],[-7,-17]],C[2]);
    for(const x of [-11,10]){p.line(x,-19,x-1,-15+swing,GOLD[3]);p.line(x+1,-19,x+2,-16+swing,GOLD[4]);}
    round(p,0,-25,5,4.8,GOLD);p.px(-2,-25,WOOD[0]);p.px(2,-25,WOOD[0]);p.line(-1,-23,1,-23,WOOD[2]);
    p.ellipse(0,-27,8,2.4,WOOD[1]);round(p,-1,-30,5.4,3.2,GOLD);p.line(-6,-29,4,-29,C[3]);
  },
};

export function equipment(id,name,desc,palette,field=false){
  const size=field?[48,48]:[32,32];
  return asset({name,desc,tags:["equipment",id],size,origin:[size[0]/2,field?38:27],palette,bg:field?"field":"dark",
    options:toolTiers.has(id)?{tier:0}:{}},
    (p,ph,C,o)=>{if(field)groundShadow(p,0,0,8,2.5);tools[id](p,toolColors(C,o.tier),ph);});
}

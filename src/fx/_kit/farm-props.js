import { asset, CREAM, GOLD, LEAF, RED, STEEL, WOOD, box, post, round, wave } from "./art.js";
import { groundShadow } from "./sprite.js";
import { clamp } from "../../core/index.js";

function lid(p,w,h,C,open,hinge=-h) {
  const top=hinge-Math.round(3+open*6);
  p.poly([[-w/2,hinge],[w/2,hinge],[w/2+3,top],[-w/2+3,top]],C[3]);
  p.line(-w/2+3,top,w/2+3,top,C[4]);p.line(-w/2,hinge,w/2,hinge,C[1]);
}
function table(p,C,w=23,h=10){
  post(p,-w/2+2,0,h); post(p,w/2-2,0,h);p.line(-w/2+2,-4,w/2-2,-4,C[1]);
  box(p,-w/2,-h+2,w,4,5,C);
}
const props={
  chest(p,C,ph,o,open){
    box(p,-10,0,19,9,4,C);
    p.poly([[-10,-9],[9,-9],[13,-13],[-6,-13]],C[0]);
    if(open>0.2){p.px(-1,-10,GOLD[4]);p.line(1,-10,5,-11,GOLD[3]);}
    lid(p,19,9,C,open);
    for(const x of [-7,6])p.line(x,-8,x,-1,STEEL[2]);
    p.rect(-2,-9,5,4,STEEL[1]);p.px(0,-7,GOLD[4]);
  },
  barrel(p,C){
    p.ellipse(0,-8,9,9,C[0]);p.ellipse(-0.5,-8,8,8,C[2]);
    for(const x of [-5,0,5])p.line(x*0.75,-15,x,-4,C[1]);
    p.ellipse(0,-16,8,3.5,C[3]);p.ellipse(0,-16,5.5,2,C[1]);
    for(const y of [-12,-5]){p.line(-7,y-1,-5,y,STEEL[2]);p.line(-5,y,5,y,STEEL[2]);p.line(5,y,7,y-1,STEEL[1]);}
  },
  crate(p,C){
    box(p,-10,0,20,13,5,C);
    for(const y of [-10,-7,-4])p.line(-9,y,8,y,C[1]);
    p.line(-9,-1,8,-12,C[4]);p.line(-9,-12,8,-2,C[3]);p.px(-8,-3,STEEL[1]);p.px(7,-3,STEEL[1]);
  },
  workbench(p,C){
    table(p,C,27,11);
    box(p,-8,-13,19,9,2,C);
    p.beam(-3,-17,4,-21,2,STEEL[3]);p.line(4,-22,7,-21,STEEL[2]);p.line(-5,-15,-4,-17,STEEL[4]);
    p.rect(5,-12,5,3,STEEL[2]);p.px(5,-11,STEEL[4]);p.line(7,-10,7,-7,STEEL[1]);
  },
  furnace(p,C,ph,o){
    const heat=o.active?wave(ph,4):0;
    p.poly([[-11,0],[-11,-12],[-6,-20],[8,-20],[12,-11],[12,0]],C[0]);
    p.poly([[-10,-1],[-10,-12],[-5,-19],[7,-19],[10,-12],[10,-1]],C[2]);
    p.line(-7,-15,9,-15,C[1]);p.line(-10,-9,10,-9,C[1]);p.line(-8,-3,9,-3,C[1]);
    p.ellipse(0,-7,6,5.3,C[0]);p.rect(-5,-8,10,6,C[0]);
    if(o.active){p.ellipse(0,-6,4.5,3.65,RED[2]);p.ellipse(-1,-6+heat,1.9,3.1,GOLD[4]);p.glow(0,-7,7,RED[3],0.23);}
    p.rect(-5,-21,8,4,C[1]);p.line(-5,-21,2,-21,C[3]);
  },
  "cooking-pot"(p,C,ph,o){
    for(const x of [-7,7])post(p,x,0,5,STEEL);
    p.rect(-8,-9,16,6,RED[1]);
    if(o.active)p.ellipse(0,-6,5,1.6,GOLD[3]);
    p.beam(-9,-14,-13,-14,2,STEEL[2]);p.beam(8,-14,13,-14,2,STEEL[2]);round(p,0,-12,9.5,6,C);
    p.ellipse(0,-16,9.3,3.7,C[1]);p.ellipse(0,-16,7.9,2.6,o.active?GOLD[2]:C[0]);
    if(o.active)for(let i=0;i<4;i++){const u=(ph+i/4)%1;p.disc(-4+i*3+wave(ph+i*.17),-17-9*u,1+1.5*u,CREAM[4],0.42*(1-u));}
  },
  "crafting-table"(p,C){
    table(p,C,24,11);
    p.poly([[-10,-12],[-6,-17],[7,-17],[3,-12]],LEAF[2]);p.line(-8,-13,3,-13,LEAF[4]);
    p.poly([[1,-14],[4,-18],[10,-18],[8,-14]],CREAM[3]);
    p.line(4,-15,8,-15,WOOD[2]);p.line(6,-16,9,-16,WOOD[2]);
    p.rect(-6,-8,11,5,C[1]);p.line(-5,-7,3,-7,C[3]);p.px(-1,-6,GOLD[4]);
  },
  signpost(p,C,ph,o) {
    post(p,0,0,21);
    p.poly([[-12,-21],[7,-21],[13,-17],[7,-12],[-12,-12]],C[1]);
    p.poly([[-11,-20],[6,-20],[11,-17],[6,-13],[-11,-13]],C[3]);
    p.text(String(o.label).slice(0,4),-10,-19,C[0],{font:"mini"});
    p.px(8,-17,C[0]);
  },
  lamp(p,C,ph,o) {
    p.ellipse(0,0,5,2.2,STEEL[1]);post(p,0,0,23,STEEL);
    p.poly([[-6,-24],[-4,-18],[4,-18],[6,-24]],STEEL[0]);
    p.rect(-3,-24,6,6,o.active?C[3]:C[1]);p.line(-2,-24,-2,-19,o.active?C[4]:C[2]);
    p.poly([[-7,-24],[-3,-28],[3,-28],[7,-24]],STEEL[2]);p.px(0,-29,STEEL[4]);
    if(o.active)p.glow(0,-21,9,C[3],0.38+0.08*wave(ph,3));
  },
  bench(p,C) {
    for(const x of [-10,10])post(p,x,0,16,WOOD);
    p.rect(-13,-17,26,4,C[1]);p.line(-12,-17,11,-17,C[4]);
    p.rect(-13,-12,26,3,C[2]);p.line(-12,-12,11,-12,C[3]);table(p,C,27,7);
  },
  mailbox(p,C,ph,o,open) {
    post(p,0,0,13);
    p.poly([[-9,-12],[-9,-19],[-5,-23],[8,-23],[11,-19],[11,-12]],C[1]);
    p.poly([[-8,-13],[-8,-19],[-5,-22],[5,-22],[8,-20],[8,-13]],C[2]);
    p.polyline([[-8,-18],[-5,-22],[7,-22]],C[4]);
    p.rect(-8,-17,8,5,STEEL[0]);p.line(-8,-17,0,-17,STEEL[3]);
    if(open>0.5){p.rect(-10,-16,8,4,CREAM[3]);p.line(-10,-16,-6,-14,CREAM[1]);}
    p.line(5,-15,5+Math.round((1-open)*5),-16-Math.round(open*8),RED[3]);p.px(5,-15,CREAM[3]);
  },
  "shipping-bin"(p,C,ph,o,open) {
    box(p,-14,0,27,13,5,C);p.poly([[-14,-13],[13,-13],[18,-18],[-9,-18]],C[0]);
    lid(p,27,13,C,open);p.line(-12,-3,11,-3,C[1]);p.line(-10,-12,-10,-1,C[4]);
    p.rect(-7,-10,11,6,CREAM[3]);p.poly([[-5,-7],[2,-7],[-1,-9],[-1,-5],[2,-7]],C[1]);
  },
  "hay-bale"(p,C) {
    box(p,-12,0,24,13,5,C);
    for(const [x,y] of [[-9,-5],[-5,-7],[0,-10],[4,-3],[7,-8]])p.line(x,y,x+3,y-1,C[4]);
    for(const x of [-6,6]){p.line(x,0,x,-13,WOOD[1]);p.line(x,-13,x+5,-18,WOOD[2]);}
  },
  "feeding-trough"(p,C,ph,o) {
    post(p,-11,0,7);post(p,10,0,7);box(p,-14,-3,27,7,5,C);
    p.poly([[-12,-10],[-8,-14],[15,-14],[11,-10]],C[0]);
    if(o.active){for(const x of [-9,-6,-3,0,3,6,9,12])p.line(x,-11,x+1,-13,GOLD[3]);}
    p.line(-13,-10,12,-10,C[4]);
  },
  beehive(p,C,ph,o) {
    for(const x of [-7,7])post(p,x,0,7);
    for(const y of [-5,-9,-13,-17]){p.rect(-8,y-4,16,4,C[2]);p.line(-8,y,-8+15,y,C[1]);p.line(-8,y-4,7,y-4,C[3]);}
    p.poly([[-10,-20],[-5,-25],[5,-25],[10,-20]],WOOD[1]);p.line(-5,-25,5,-25,WOOD[4]);p.rect(-3,-8,6,2,C[0]);
    if(o.active){p.px(9+wave(ph)*4,-14+wave(ph,2)*4,GOLD[4]);p.px(-10+wave(ph)*2,-13+wave(ph,2,0.43)*3,GOLD[3]);}
  },
};

export function farmProp(id,name,desc,palette,options={}){
  return asset({name,desc,tags:["prop",id],size:[48,48],origin:[24,37],palette,options},
    (p,ph,C,o)=>{groundShadow(p,0,0,14,3.2);props[id](p,C,ph,o,o.open<0?(1+wave(ph,1,0.75))*0.5:clamp(o.open??0));});
}

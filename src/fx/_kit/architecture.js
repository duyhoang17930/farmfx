import { asset, CREAM, GOLD, STEEL, WATER, WOOD, box, post, wave } from "./art.js";
import { groundShadow } from "./sprite.js";

export const NIGHT = STEEL[0];
export function window(p,x,y,w,h,lit=false) {
  p.rect(x-1,y-1,w+2,h+3,CREAM[1]);p.rect(x,y,w,h,lit?GOLD[3]:NIGHT);
  p.line(x,y,x+w-1,y,lit?GOLD[4]:WATER[3]);
  p.line(x+Math.floor(w/2),y,x+Math.floor(w/2),y+h-1,CREAM[2]);
  p.line(x,y+Math.floor(h/2),x+w-1,y+Math.floor(h/2),CREAM[2]);
  p.line(x-1,y+h,x+w,y+h,CREAM[4]);
}

export function doorway(p,x,y,w,h,C,open=0) {
  p.rect(x-1,y-h-1,w+2,h+1,CREAM[1]);p.rect(x,y-h,w,h,NIGHT);
  const panel = Math.round(w*(1-open));
  if(panel>=2){
    p.rect(x,y-h,panel,h,WOOD[1]);p.rect(x+1,y-h+1,panel-1,h-2,C[2]);
    for(let i=2;i<panel;i+=3)p.line(x+i,y-h+2,x+i,y-2,C[1]);
    p.px(x+panel-2,y-4,GOLD[4]);
  }
  p.line(x-1,y-1,x+w,y-1,CREAM[2]);
}

export function gable(p, x, foot, w, h, peak, C, roof, depth=6) {
  groundShadow(p,x+depth*0.5,foot,w/2+depth+1,4);
  const a=x-w/2,b=x+w/2,y=foot-h, top=y-peak;
  box(p,a,foot,w,h,depth,C);
  p.poly([[a,y],[x,top],[b,y]],C[2]);
  for(let j=4;j<w-1;j+=4){const xp=a+j; p.line(xp,y+1,xp,foot-2,C[1]);p.line(xp+1,y+2,xp+1,foot-3,C[3]);}
  p.poly([[a-2,y],[x,top-2],[x+depth+2,top-depth-2],[b+depth+2,y-depth],[b+2,y]],roof[0]);
  p.poly([[x+1,top],[x+depth+1,top-depth-1],[b+depth+1,y-depth],[b+1,y-1]],roof[2]);
  p.polyline([[a-2,y],[x,top-2],[b+1,y]],roof[4]);
  p.polyline([[a-1,y+1],[x,top],[b,y+1]],CREAM[1]);
  for(const u of [0.32,0.54,0.75,0.9]){
    const px=x+(b-x)*u,py=top+peak*u;
    p.line(px+2,py-1,px+depth,py-depth,roof[3]);
  }
}

export function cabin(config) {
  const { name, desc, w, h, peak, decoration, roof } = config;
  return asset({name,desc,tags:["building","property"],size:[80,64],origin:[40,53],palette:config.palette,
    duration:3.2,options:{open:-1,lit:true}},(p,ph,C,o)=>{
    const open = o.open < 0 ? Math.max(0,wave(ph,1,-0.18)) : Math.max(0,Math.min(1,o.open));
    gable(p,-3,0,w,h,peak,C,roof);
    decoration(p,ph,C,o,open);
  });
}

export function tableLegs(p,w,y,h,C=WOOD){post(p,-w/2+2,y,h,C);post(p,w/2-3,y,h,C);}

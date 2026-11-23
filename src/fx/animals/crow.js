import { smallAnimal } from "../_kit/wildlife.js";
import { GOLD, round, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";
export const { meta, draw } = smallAnimal("Crow","A charcoal crow hops, dips its beak to peck and flicks its tail. Faces right; flip for left.","crow",
  ["#282936","#3d3f56","#525a6e","#65768a","#9baab0"],(p,ph,C)=>{
  const leap=Math.max(0,wave(ph,2,0.45)),y=-Math.round(leap*4),x=Math.round(wave(ph)*3),dip=Math.max(0,wave(ph,1,.42));
  groundShadow(p,x,0,7,2);
  p.poly([[x-3,y-7],[x-14,y-10+wave(ph,3)],[x-11,y-5],[x-5,y-3]],C[0]);
  for(const dx of [-2,3])p.line(x+dx,y-5,x+dx+1,y,C[2]);
  round(p,x-2,y-7,7,5,C);
  p.poly([[x-7,y-9],[x,y-10],[x+2,y-7],[x-1,y-4],[x-6,y-5]],C[1]);p.line(x-6,y-8,x-1,y-8,C[3]);
  const hx=x+4+Math.round(4*dip),hy=y-12+Math.round(6*dip);
  round(p,hx,hy,4.4,4.5,C);
  p.tri(hx+2,hy-1,hx+8,hy+1,hx+3,hy+2,C[0]);p.line(hx+4,hy,hx+6,hy+1,C[3]);
  p.px(hx+1,hy-2,GOLD[4]);p.px(hx+2,hy-1,C[0]);
});

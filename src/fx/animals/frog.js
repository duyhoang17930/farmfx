import { smallAnimal } from "../_kit/wildlife.js";
import { GOLD, LEAF, WATER, round, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";
export const { meta, draw } = smallAnimal("Frog","A pond frog blinking, squatting and springing onto a lily pad, facing down.","frog",LEAF,(p,ph,C,o)=>{
  const k=Math.max(0,Math.min(1,(ph-.37)/.35)),h=Math.round(8*Math.sin(k*Math.PI));
  if(o.lily){p.ellipse(0,0,13,5,WATER[2]);p.ellipse(0,-1,9,3.5,C[2]);p.tri(0,-1,9,0,9,2,WATER[2]);}
  else groundShadow(p,0,0,8,2);
  for(const x of [-6,6])round(p,x,-3-h,3.3,2.6,C);
  round(p,0,-5-h,7,4.5,C);round(p,0,-3-h,5.4,2.5,C);
  for(const x of [-4,4]){
    round(p,x,-8-h,2.7,2.7,C);
    if(wave(ph,2)>.84)p.line(x-1,-8-h,x+1,-8-h,C[1]);
    else {p.px(x,-9-h,GOLD[4]);p.px(x,-8-h,C[0]);}
  }
  p.line(-2,-3-h,2,-3-h,C[1]);
},{lily:true});

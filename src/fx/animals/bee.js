import { smallAnimal } from "../_kit/wildlife.js";
import { CREAM, GOLD, STEEL, round, wave } from "../_kit/art.js";
export const { meta, draw } = smallAnimal("Bee","A striped bee buzzing in a short figure eight, facing right; flip for left.","bee",GOLD,(p,ph,C)=>{
  const x=Math.round(wave(ph)*9),y=-13+Math.round(wave(ph,2)*3),wing=wave(ph,12);
  p.ellipse(x-2,y-4,3,3.2+wing,STEEL[3],0.7);p.ellipse(x+2,y-4,2.8,3.2-wing,CREAM[4],0.85);
  round(p,x,y,5,3.35,C);p.line(x-1,y-2,x-1,y+2,C[0]);p.line(x+2,y-2,x+1,y+2,C[1]);p.px(x+3,y-1,C[0]);
  p.line(x+2,y-2,x+4,y-4,C[0]);p.px(x-5,y,C[0]);
});

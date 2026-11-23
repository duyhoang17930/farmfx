import { asset, GOLD, LEAF, VIOLET, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";
export const { meta, draw } = asset({name:"Wildflowers",desc:"Clusters of violet daisies with golden centers on waving stems.",tags:["flowers","forage","foliage"],palette:VIOLET},(p,ph,C)=>{
  groundShadow(p,0,0,8,2.6);
  for(const [x,h] of [[-7,7],[-3,12],[2,8],[6,10],[3,14]]){
    const sx=x+Math.round(wave(ph+0.07*x)*1.1);
    p.line(x*0.68,0,sx,-h,LEAF[2]);p.line(x*0.78,-3,x-2,-6,LEAF[3]);
    p.ellipse(sx,-h,2.55,2.2,C[1]);p.px(sx-1,-h-1,C[4]);p.px(sx+1,-h,C[3]);p.px(sx,-h,GOLD[4]);
  }
});

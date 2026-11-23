import { asset, LEAF, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";
export const { meta, draw } = asset({name:"Weeds",desc:"A tangled clump of triangular blades, hooked broad leaves and a dry seed tuft.",tags:["weed","grass","foliage"],palette:LEAF},(p,ph,C)=>{
  groundShadow(p,0,0,7,2);
  for(const [x,h,w] of [[-9,7,2],[-6,11,4],[-2,8,2],[2,14,2],[6,9,3],[9,5,2]]){
    const bx=x+Math.round(wave(ph+x*0.063)*1.3);
    p.poly([[x*0.28,0],[x*0.52-w,-h*0.57],[bx,-h],[x*0.65+w,-h*0.48]],C[1]);
    p.line(x*0.28,-1,bx,-h,C[3]);
  }
  p.line(0,-1,-1,-17,C[2]);p.ellipse(-1,-15,1.1,2.3,C[4]);
});

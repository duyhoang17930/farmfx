import { asset, CREAM, GOLD, LEAF, RED, WOOD, box, post, round, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";
export const { meta, draw } = asset({name:"Market stall",desc:"A striped produce stand with baskets, pumpkins and an awning that stirs in the wind.",
  tags:["market","stall","shop","building"],size:[64,48],origin:[32,36],palette:RED},(p,ph,C)=>{
  groundShadow(p,0,0,21,4);
  for(const x of [-17,17])post(p,x,0,27);
  box(p,-20,0,39,12,4,WOOD);
  for(const [x,g] of [[-12,GOLD],[-2,RED],[9,LEAF]]){round(p,x,-14,4.5,2.6,WOOD);for(const dx of [-2,1,3])round(p,x+dx,-16,1.9,1.8,g);}
  for(let i=0;i<7;i++){
    const x=-22+6*i,y=Math.round(wave(ph+i*.1)),c=i%2?CREAM:C;
    p.poly([[x+4,-31],[x+10,-31],[x+6,-23+y],[x,-23+y]],c[3]);
    p.line(x,-23+y,x+5,-23+y,c[1]);
  }
  p.line(-18,-31,23,-31,CREAM[4]);
});

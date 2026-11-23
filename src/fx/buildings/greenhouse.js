import { asset, GOLD, LEAF, STEEL, WATER, box, round, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";
export const { meta, draw } = asset({name:"Greenhouse",desc:"A glasshouse with angled panes, dark metal ribs and warm light over its seedling benches.",
  tags:["greenhouse","glass","building"],size:[64,64],origin:[32,52],palette:WATER},(p,ph,C)=>{
  groundShadow(p,1,0,25,4);
  box(p,-24,0,44,8,6,STEEL);
  p.poly([[-24,-6],[-24,-25],[-10,-38],[12,-38],[26,-25],[26,-12],[20,-6]],C[1]);
  p.poly([[-22,-7],[-22,-24],[-10,-36],[6,-36],[19,-24],[19,-7]],C[2]);
  p.poly([[7,-36],[13,-37],[25,-25],[25,-12],[20,-7],[20,-24]],C[3]);
  for(const x of [-18,-12,7,13]){p.line(x,-9,x,-25,STEEL[1]);round(p,x,-12,3.3,3.7,LEAF);}
  p.rect(-5,-20,10,14,STEEL[1]);p.rect(-3,-18,6,11,C[1]);p.px(2,-12,GOLD[4]);
  p.polyline([[-24,-7],[-24,-25],[-10,-38],[10,-38],[21,-25],[21,-7]],STEEL[3]);
  p.line(-23,-25,25,-25,STEEL[3]);p.line(-10,-38,-10,-26,STEEL[4]);p.line(7,-37,7,-25,STEEL[3]);
  const dx=Math.round(wave(ph)*2);p.line(-18+dx,-26,-10+dx,-34,C[4]);p.line(11+dx,-24,14+dx,-28,C[4]);
});

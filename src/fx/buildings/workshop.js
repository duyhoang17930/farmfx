import { cabin, doorway, window } from "../_kit/architecture.js";
import { CREAM, LEAF, STEEL, WOOD, box, wave } from "../_kit/art.js";
export const { meta, draw } = cabin({name:"Workshop",desc:"A moss-roofed workshop with a wide door, a wall-mounted wrench and a smoking chimney.",
  w:41,h:20,peak:11,roof:LEAF,palette:WOOD,decoration(p,ph,C,o,open){
    box(p,9,-23,7,17,2,STEEL);p.rect(8,-40,9,2,STEEL[3]);
    for(let i=0;i<3;i++){
      const u=(ph+i/3)%1;
      p.disc(12+5*u+wave(ph+i)*1.2,-41-9*u,1.6+2*u,CREAM[3],0.38*(1-u));
    }
    doorway(p,-21,0,14,14,C,open);window(p,2,-15,10,8,o.lit);
    p.beam(-2,-6,3,-10,2,STEEL[3]);p.line(2,-11,4,-10,STEEL[4]);p.px(3,-12,STEEL[3]);
  }});

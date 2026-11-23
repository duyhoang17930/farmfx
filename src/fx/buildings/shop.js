import { cabin, doorway, window } from "../_kit/architecture.js";
import { CREAM, GOLD, RED, STEEL, WOOD } from "../_kit/art.js";
export const { meta, draw } = cabin({name:"General store",desc:"A slate-roofed store with a striped canopy, display window and a swinging shop sign.",
  w:44,h:24,peak:10,roof:STEEL,palette:CREAM,decoration(p,ph,C,o,open){
    doorway(p,1,0,11,16,C,open);window(p,-20,-14,16,9,o.lit);
    for(let i=0;i<7;i++){const x=-23+i*6;const c=i%2?CREAM:RED;p.poly([[x,-20],[x+6,-20],[x+5,-15],[x-1,-15]],c[3]);p.line(x-1,-15,x+4,-15,c[1]);}
    const sy=Math.round(Math.sin(ph*Math.PI*2));p.line(14,-22,23,-22,WOOD[1]);p.line(21,-22,21+sy,-18,WOOD[2]);
    p.rect(17+sy,-18,9,6,WOOD[1]);p.text("$",20+sy,-17,GOLD[4],{font:"mini"});
  }});

import { cabin, doorway, window } from "../_kit/architecture.js";
import { CREAM, GOLD, RED, WOOD, post } from "../_kit/art.js";
export const { meta, draw } = cabin({name:"Stable",desc:"An open timber stable with two stalls, hay racks and a wide shingled roof.",
  w:48,h:21,peak:10,roof:RED,palette:WOOD,decoration(p,_ph,C,o,open){
    doorway(p,-23,0,16,15,C,Math.max(0.72,open));doorway(p,-1,0,17,15,C,1);
    p.line(-23,-4,-10,-4,GOLD[2]);p.line(1,-4,12,-4,GOLD[3]);p.line(5,-3,10,-2,GOLD[2]);
    post(p,-6,0,16);post(p,17,0,14);window(p,-7,-23,7,5,o.lit);
    p.line(-22,0,18,0,CREAM[2]);
  }});

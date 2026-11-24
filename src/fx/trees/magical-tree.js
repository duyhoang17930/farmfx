import { rand } from "../../core/index.js";
import { GOLD, round, wave } from "../_kit/art.js";
import { twinkle } from "../_kit/sprite.js";
import { branch, crown, tree, trunk } from "../_kit/tree-crowns.js";

export const { meta, draw } = tree("Magical tree", "A violet crown with golden lantern fruit and looping motes of light.",
  ["#392e55","#58436f","#775a94","#ad80ad","#d9aecf"], (p, phase, C, bark, seed) => {
    const sway = Math.round(wave(phase));
    branch(p, [[0,-8],[10,-20],[8+sway,-31],[18+sway,-36]], 7, bark);
    branch(p, [[-1,-12],[-10,-21],[-17+sway,-25],[-15+sway,-35]], 6, bark);
    trunk(p,bark,{ top:-39,bend:-1,width:5 });
    p.polyline([[1,-9],[4,-15],[3,-21],[-1,-25]],C[3]);
    for (const [x,y,rx,ry] of [[-15,-34,13,10],[15,-34,13,11],[0,-45,16,10],[2,-35,12,9]]) {
      crown(p,x+sway,y,rx,ry,C,seed+x);
    }
    for (const [i,[x,y]] of [[-19,-25],[-9,-26],[5,-27],[17,-24]].entries()) {
      const drift = Math.round(wave(phase,1,i*0.13)*1.2);
      p.line(x+sway,y-3,x+sway+drift,y+2,C[1]);
      round(p,x+sway+drift,y+3,2.6,3.2,GOLD);
      p.glow(x+sway+drift,y+3,4,GOLD[3],0.18);
    }
    for (let i = 0; i < 7; i++) {
      const phaseOffset = phase + rand(i,13,seed);
      const glow = Math.max(0,wave(phaseOffset));
      const x = (rand(i,5,seed)-0.5)*46 + wave(phaseOffset,1,0.25)*2;
      const y = -5-rand(i,32,seed)*31 + 3*wave(phaseOffset);
      twinkle(p,x,y,glow*1.8,GOLD[2],GOLD[4]);
    }
  }, { duration: 4, bark: ["#3b2d49","#594167","#74516f","#9c6a7d","#cc9a9b"] });

import { GOLD, round, wave } from "../_kit/art.js";
import { branch, tree } from "../_kit/tree-crowns.js";

export const { meta, draw } = tree("Palm", "A leaning tropical palm with ringed bark, wind-tossed fronds and coconuts.",
  ["#285047","#3b6851","#50905f","#86b56c","#c1d984"], (p, phase, C, bark) => {
    const sway = Math.round(wave(phase) * 1.35);
    const top = 3+sway;
    branch(p, [[-5,1],[-5,-11],[-2,-26],[top,-42]], 9, bark);
    p.beam(-5,-12,-2,-25,6,bark[0]);
    p.line(-6,-11,-3,-26,bark[3]);
    p.line(-5,-12,-2,-26,bark[2]);
    for (const [x,y] of [[-5,-4],[-5,-10],[-4,-16],[-3,-22],[-1,-28],[0,-34]]) {
      p.line(x-2,y-1,x+2,y,bark[1]);
    }
    for (const [tx,ty,bow] of [[-27,-36,-13],[25,-35,-11],[-19,-24,-10],[20,-23,-9],
      [-16,-47,-7],[17,-47,-7],[1,-52,-1]]) {
      const x = tx+sway, y = ty+Math.round(wave(phase,1,tx/70));
      const midX = Math.round((top+x)/2), midY = Math.round((-42+y)/2)+bow;
      p.poly([[top,-42],[midX-2,midY],[x,y],[midX+2,midY+5],[top+2,-40]],C[0]);
      p.poly([[top,-42],[midX-1,midY+1],[x,y],[midX+1,midY+4]],C[2]);
      p.polyline([[top,-42],[midX,midY+1],[x,y]],C[3]);
      for (const k of [0.30,0.53,0.74]) {
        const lx = midX+(x-midX)*k, ly = midY+(y-midY)*k+2;
        p.line(lx,ly,lx-Math.sign(x-top)*2,ly+4,C[1]);
      }
    }
    round(p,top-3,-40,2.7,3.1,GOLD);
    round(p,top+2,-39,2.7,2.8,GOLD);
  });

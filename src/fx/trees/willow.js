import { wave } from "../_kit/art.js";
import { branch, crown, tree, trunk } from "../_kit/tree-crowns.js";

export const { meta, draw } = tree("Willow", "A slanted trunk under a spreading canopy with hanging green fronds.",
  ["#243b38","#33564b","#4a7351","#6c9660","#a9ba78"], (p, phase, C, bark, seed) => {
    const sway = Math.round(wave(phase) * 1.35);
    branch(p, [[0,-12],[-9,-27],[-19+sway,-35]], 6, bark);
    branch(p, [[-1,-15],[9,-26],[19+sway,-32]], 5, bark);
    trunk(p, bark, { top: -38, bend: -5, width: 6 });
    for (const [x,y,rx,ry] of [[-17,-34,11,10],[15,-32,13,11],[-6,-44,16,9],[8,-40,16,10]]) {
      crown(p,x+sway,y,rx,ry,C,seed+x);
    }
    for (const [i,[x,y,len]] of [[-24,-35,17],[-19,-34,22],[-14,-35,15],[-9,-32,15],
      [9,-33,17],[14,-33,24],[19,-33,20],[24,-33,16]].entries()) {
      const drift = Math.round(wave(phase,1,i*0.06)*2.3);
      const stem = [[x+sway,y],[x+sway+2,y+5],[x+drift,y+len-4],[x+drift-1,y+len]];
      p.beam(...stem[0],...stem[1],4,C[1]);
      p.polyline(stem,C[0]);
      for (let j = 1; j < stem.length; j++) {
        p.line(stem[j-1][0]-1,stem[j-1][1],stem[j][0]-1,stem[j][1],C[2]);
      }
      p.line(x+sway-1,y+2,x+drift-1,y+len-4,C[3]);
    }
  });

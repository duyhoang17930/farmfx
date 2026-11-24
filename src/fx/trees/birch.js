import { LEAF, wave } from "../_kit/art.js";
import { branch, crown, tree, trunk } from "../_kit/tree-crowns.js";

export const { meta, draw } = tree("Birch", "A slender pale trunk with broken dark bark bands and a light green crown.",
  LEAF, (p, phase, C, bark, seed) => {
    const sway = Math.round(wave(phase));
    branch(p, [[-1,-20],[-9+sway,-32],[-12+sway,-43]], 4, bark);
    branch(p, [[1,-24],[9+sway,-36],[11+sway,-43]], 4, bark);
    trunk(p, bark, { width: 3, top: -47, bend: -1 });
    for (const [x,y,w] of [[-2,-6,3],[0,-12,3],[-2,-17,3],[1,-23,2],[-3,-27,3],[-2,-34,3]]) {
      p.line(x,y,x+w,y-1,bark[1]);
    }
    for (const [i,[x,y,rx,ry]] of [[-11,-38,9,11],[10,-38,10,12],[-2,-46,12,9],[1,-35,10,8]].entries()) {
      crown(p,x+sway,y,rx,ry,C,seed+i);
    }
  }, { bark: ["#4b454e","#776568","#c7b6a0","#ede0c3","#fff2d5"] });

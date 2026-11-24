import { wave } from "../_kit/art.js";
import { shard } from "../_kit/resource-stone.js";
import { twinkle } from "../_kit/sprite.js";
import { branch, tree, trunk } from "../_kit/tree-crowns.js";

export const { meta, draw } = tree("Crystal tree", "A faceted mineral trunk branching into cyan prisms with occasional glints.",
  ["#2d3659","#405d8a","#5587af","#86c3ce","#d4efe5"], (p, phase, C, bark) => {
    branch(p, [[-1,-13],[-10,-25],[-17,-31]], 7, bark);
    branch(p, [[2,-17],[12,-30],[18,-35]], 8, bark);
    trunk(p,bark,{ top:-40,width:6 });
    for (const [x,y,w,h,lean] of [[-17,-29,5,15,-5],[15,-29,6,18,5],
      [-9,-29,6,21,-4],[10,-34,5,15,1],[1,-32,8,22,2],[-1,-25,4,12,-4]]) {
      shard(p,x,y,w,h,lean,C);
    }
    for (const [i,[x,y]] of [[-20,-40],[19,-44],[3,-51]].entries()) {
      const glint = Math.max(0,(wave(phase,1,i*0.32)-0.83)*5.9);
      twinkle(p,x,y,3.1*glint,C[3],C[4]);
      if (glint > 0) p.glow(x,y,4,C[3],glint*0.22);
    }
  }, { bark: ["#28344b","#3b4960","#546a84","#8097af","#becbc9"] });

import { forage } from "../_kit/resource-forage.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = forage("Driftwood", "A curved bleached branch with split ends and carved grain.",
  ["#4d3d42","#775b4a","#a98b67","#ccae80","#eccea0"], (p, _phase, C) => {
    groundShadow(p, 0, 0, 13, 2.8);
    p.poly([[-14,-2],[-10,-7],[-5,-6],[0,-9],[2,-15],[4,-16],[4,-10],
      [8,-8],[12,-10],[14,-9],[11,-5],[5,-3],[-3,-2],[-9,0]], C[0]);
    p.poly([[-12,-2],[-10,-6],[-5,-5],[1,-8],[3,-13],[3,-8],[8,-7],
      [12,-9],[10,-6],[4,-4],[-3,-3],[-9,-1]], C[2]);
    p.polyline([[-11,-4],[-6,-4],[-2,-6],[2,-7],[7,-6],[10,-7]], C[4]);
    p.polyline([[-10,-2],[-5,-3],[-1,-4],[3,-6],[5,-5]], C[1]);
    p.px(3,-14,C[3]);
    p.px(12,-8,C[4]);
  });

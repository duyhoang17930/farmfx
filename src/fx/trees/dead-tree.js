import { bare, tree } from "../_kit/tree-crowns.js";

export const { meta, draw } = tree("Dead tree", "A bare weathered snag with a broken crown and crooked branches.",
  ["#3c3442","#5a4751","#78605e","#9f7c70","#c69c80"], (p, _phase, C) => {
    bare(p,C);
  }, { still: true });

import { RED, wave } from "../_kit/art.js";
import { bare, tree } from "../_kit/tree-crowns.js";

export const { meta, draw } = tree("Burnt tree", "A blackened snag with cracked bark and faint embers down at the roots.",
  ["#262331","#37303c","#51404a","#73545a","#92646a"], (p, phase, C) => {
    bare(p,C,{ burnt:true });
    p.polyline([[-7,-8],[-3,-9],[-3,-14],[0,-17]],C[0]);
    p.polyline([[5,-7],[3,-11],[3,-16]],C[0]);
    const heat = 0.45 + 0.34*wave(phase);
    p.dot(-3,-9,RED[3],heat);
    p.dot(-3,-10,RED[2],heat);
    p.dot(5,-5,RED[3],1-heat);
    p.glow(-3,-9,5,RED[2],heat*0.27);
  });

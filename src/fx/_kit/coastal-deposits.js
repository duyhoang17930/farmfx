import { ramp, rand } from "../../core/index.js";
import { asset, LEAF, wave } from "./art.js";
import { groundShadow, twinkle } from "./sprite.js";

const ironHighlights = ramp(["#695260", "#b1806b", "#dfb08a", "#ffe0a8"]);

export function coastalDeposit(iron) {
  return asset({
    name: iron ? "Coastal iron seam" : "Coastal boulder",
    desc: iron ? "An iron node with angled rock faces and warm metallic veins." : "A sunlit boulder with split faces, moss and two loose chips.",
    tags: ["resource", iron ? "ore" : "stone", "coast"], size: [48, 32], origin: [24, 24],
    duration: 2.8, palette: iron ? ["#51475b", "#756077", "#97828d", "#c2a7a7", "#ebcfb0"]
      : ["#45556c", "#6a7d93", "#94a6ad", "#becbc7", "#e8e7cf"],
  }, (p, t, C, o) => {
    groundShadow(p, 0, 0, 13, 3.6, 0.82);
    p.poly([[-13,-4],[-9,-12],[-5,-17],[3,-19],[10,-15],[13,-9],[13,-2],[7,2],[-8,1]], C[0]);
    p.poly([[-11,-5],[-8,-12],[-4,-16],[3,-18],[9,-14],[5,-10],[-3,-9],[-9,-1]], C[3]);
    p.poly([[5,-10],[9,-14],[12,-8],[11,-3],[7,0],[2,-4]], C[1]);
    p.poly([[-9,-1],[-3,-9],[5,-10],[2,-4],[7,0],[-4,0]], C[2]);
    p.poly([[-8,-11],[-5,-15],[1,-16],[-2,-12]], C[4]);
    p.line(3, -8, 0, -5, C[3]);
    p.line(-6, -5, -9, -3, C[4]);
    p.px(-12, 0, C[2]);
    p.line(11, 1, 14, 1, C[2]);
    if (iron) {
      const vein = [[-7,-8],[-3,-12],[1,-12],[4,-16],[7,-14],[4,-10],[0,-10],[-4,-6]];
      p.poly(vein, ironHighlights[0]);
      p.poly([[-6,-8],[-3,-11],[2,-11],[4,-14],[6,-14],[3,-11],[2,-9],[-3,-7]], ironHighlights[2]);
      p.line(-5, -8, -2, -10, ironHighlights[3]);
      p.poly([[5,-6],[9,-9],[10,-7],[8,-4],[5,-3],[3,-4]], C[0]);
      p.line(5, -5, 9, -8, ironHighlights[1]);
      p.line(5, -4, 8, -6, ironHighlights[2]);
      const glint = Math.max(0, wave(t, 1, (o.seed % 7) * .13)) ** 8;
      twinkle(p, 4, -14, 2.4 * glint, ironHighlights[2], ironHighlights[3]);
    } else {
      p.poly([[-11,-2],[-9,-5],[-7,-3],[-4,-3],[-6,0],[-10,0]], LEAF[2]);
      p.line(-10, -3, -8, -3, LEAF[4]);
      for (let i = 0; i < 4; i++) {
        const x = Math.floor(rand(i, 8, o.seed) * 8) - 4;
        const y = Math.floor(rand(i, 2, o.seed) * 4) - 9;
        p.px(x, y, C[3]);
      }
    }
  });
}

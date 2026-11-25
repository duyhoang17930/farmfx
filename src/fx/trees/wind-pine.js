import { rand } from "../../core/index.js";
import { asset, cacheArt, GOLD, WOOD, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

const needles = ["#264d47", "#376958", "#529868", "#83bd75", "#cadf88"];
const tiers = [[0, -31, 15], [-2, -38, 12], [0, -45, 8]];

const drawTree = cacheArt(48, 53, -24, -48, (p, C, pose) => {
  const seed = pose % 8;
  const bend = Math.floor(pose / 8) - 8;
  p.poly([[-7,0],[-4,-3],[-3,-17],[bend * .28 - 2,-30],[bend * .3 + 3,-30],
    [4,-17],[4,-5],[7,-1],[3,1],[0,-1]], WOOD[0]);
  p.poly([[-5,0],[-2,-9],[-2,-20],[2,-23],[2,-2]], WOOD[2]);
  p.line(-2, -3, 0, -15, WOOD[4]);
  p.line(2, -7, 2, -11, WOOD[1]);
  p.poly([[-4,1],[-2,-1],[3,0],[1,2]], C[1]);

  for (const [index, [offset, top, width]] of tiers.entries()) {
    const x = Math.round(offset + bend * (0.47 + index * 0.22));
    const side = index % 2 === 0 ? 1 : -1;
    const at = (a, b) => [x + a * side, top + b];
    const patch = (points, color) => p.poly(points.map(([a, b]) => at(a, b)), color);
    const points = [[0,0],[width*.34,6],[width*.55,9],[width*.49,10],[width,15],[width-2,18],
      [width-6,18],[width-7,20],[-2,19],[-6,21],[-width,17],[-width+5,13],[-width+3,12],[-width*.41,8]];
    patch(points, C[0]);
    patch([[0,2],[width*.26,7],[width*.46,11],[width-2,15],[width-6,16],[width-7,18],
      [-3,17],[-7,19],[-width+2,16],[-width+6,12]], C[2]);
    const light = side === 1 ? -1 : 1;
    patch([[0,3],[light*width*.27,8],[light*width*.6,12],[light*(width-3),15],
      [light*width*.45,15],[light*width*.25,12],[0,11]], C[3]);
    for (let i = 0; i < 6; i++) {
      const ax = x - 4 + Math.round(rand(i, index + 6, seed) * (width * .55));
      const ay = top + 7 + Math.round(rand(i, 12, seed + index) * 7);
      if (Math.abs(ax - x) > (ay - top) * 0.65) continue;
      p.line(ax - 1, ay + 1, ax, ay, C[i === 0 ? 4 : 3]);
    }
  }
  p.px(-3, -13, WOOD[4]);
});

export const { meta, draw } = asset({
  name: "Wind pine",
  desc: "A coastal conifer with sunlit needle clusters, a flexible crown and a cut stump.",
  tags: ["tree", "pine", "harvest"], size: [48, 64], origin: [24, 52], duration: 2.5,
  palette: needles, options: { bend: 0, stump: false, shadow: true },
}, (p, t, C, o) => {
  if (o.shadow) groundShadow(p, 1, 1, o.stump ? 8 : 14, 3, 0.82);
  if (o.stump) {
    p.poly([[-5,-4],[-4,-8],[5,-8],[6,-2],[2,1],[-3,0]], WOOD[1]);
    p.rect(-3, -6, 3, 5, WOOD[3]);
    p.ellipse(0, -7, 5, 2.5, WOOD[4]);
    p.ellipse(0, -7, 2, 1, GOLD[1]);
    p.px(-2, -8, GOLD[4]);
    return;
  }
  const gust = Math.round(wave(t, 1, o.seed * 0.07) * 0.8);
  const bend = Math.round(Math.max(-7, Math.min(7, o.bend))) + gust;
  const variant = Math.abs(Math.floor(o.seed)) % 8;
  drawTree(p, C, (bend + 8) * 8 + variant);
});

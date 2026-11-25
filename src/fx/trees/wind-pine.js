import { clamp, rand } from "../../core/index.js";
import { asset, GOLD, WOOD, wave } from "../_kit/art.js";
import { groundShadow, Layer } from "../_kit/sprite.js";

const needles = ["#264d47", "#376958", "#529868", "#83bd75", "#cadf88"];
const crowns = [
  [[0,-31,15],[-2,-39,12],[0,-46,8]],
  [[0,-31,12],[1,-41,10],[0,-51,7]],
  [[-1,-30,17],[1,-37,13],[-2,-44,9]],
  [[1,-30,14],[3,-37,12],[5,-46,8]],
];
const sizes = [0.82, 1, 1.14];

const cachedArt = new Map();

function paintTree(canvas, C, pose) {
  const seed = pose % 8;
  const shape = Math.floor(pose / 8) % 4;
  const scale = sizes[Math.floor(pose / 32) % 3];
  const bend = Math.floor(pose / 96) - 8;
  const at = ([x, y]) => [Math.round(x * scale), Math.round(y * scale)];
  const p = {
    poly: (points, color) => canvas.poly(points.map(at), color),
    line: (x, y, nx, ny, color) => canvas.line(...at([x, y]), ...at([nx, ny]), color),
    px: (x, y, color) => canvas.px(...at([x, y]), color),
  };
  p.poly([[-7,0],[-4,-3],[-3,-17],[bend * .28 - 2,-30],[bend * .3 + 3,-30],
    [4,-17],[4,-5],[7,-1],[3,1],[0,-1]], WOOD[0]);
  p.poly([[-5,0],[-2,-9],[-2,-20],[2,-23],[2,-2]], WOOD[2]);
  p.line(-2, -3, 0, -15, WOOD[4]);
  p.line(2, -7, 2, -11, WOOD[1]);
  p.poly([[-4,1],[-2,-1],[3,0],[1,2]], C[1]);

  for (const [index, [offset, top, width]] of crowns[shape].entries()) {
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
}

function drawTree(p, C, pose) {
  const key = [...C,pose].join(",");
  let layer = cachedArt.get(key);
  if (!layer) {
    layer = new Layer(64,66);
    paintTree(layer.begin(-32,-61),C,pose);
    if (cachedArt.size >= 96) cachedArt.delete(cachedArt.keys().next().value);
    cachedArt.set(key,layer);
  }
  layer.draw(p);
}

export const { meta, draw } = asset({
  name: "Wind pine",
  desc: "A coastal conifer with sunlit needle clusters, a flexible crown and a cut stump.",
  tags: ["tree", "pine", "harvest"], size: [64, 80], origin: [32, 65], duration: 2.5,
  palette: needles, options: { bend: 0, stump: false, shadow: true, chipped: false, shape: 0, growth: 1 },
}, (p, t, C, o) => {
  const growth = clamp(Math.round(o.growth), 0, 2);
  const scale = sizes[growth];
  const at = ([x, y]) => [Math.round(x * scale), Math.round(y * scale)];
  const shape = clamp(Math.round(o.shape), 0, 3);
  if (o.shadow) groundShadow(p, 1, 1, (o.stump ? 8 : 14) * scale, 3 * scale, 0.79);
  if (o.stump) {
    p.poly([[-7,0],[-4,-4],[-4,-8],[5,-8],[5,-4],[7,-1],[2,1],[-2,0]].map(at), WOOD[1]);
    p.line(...at([-3,-6]), ...at([-4,-1]), WOOD[3]);
    p.ellipse(0, -7 * scale, 5 * scale, 2.6 * scale, WOOD[4]);
    p.ellipse(-1, -7 * scale, 2.3 * scale, 1.1 * scale, GOLD[1]);
    p.px(...at([-2,-8]), GOLD[4]);
    p.line(...at([2,-7]), ...at([3,-6]), GOLD[2]);
    return;
  }
  const gust = Math.round(wave(t, 1, o.seed * 0.07) * 0.8);
  const bend = Math.round(Math.max(-7, Math.min(7, o.bend))) + gust;
  const variant = Math.abs(Math.floor(o.seed)) % 8;
  drawTree(p, C, (bend + 8) * 96 + growth * 32 + shape * 8 + variant);
  if (o.chipped) {
    p.poly([[-3,-9],[1,-8],[-1,-5],[-3,-6]].map(at), WOOD[0]);
    p.line(...at([-3,-8]), ...at([0,-8]), WOOD[4]);
  }
});

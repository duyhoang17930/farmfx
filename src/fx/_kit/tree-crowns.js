import { fit, rand } from "../../core/index.js";
import { asset, LEAF, WOOD, wave } from "./art.js";
import { groundShadow, Layer } from "./sprite.js";

export function tree(name, desc, palette, paint, { bark = WOOD, duration = 3, still = false } = {}) {
  return asset({
    name, desc, tags: ["tree", "nature", "wood"], size: [64, 64], origin: [32, 56],
    palette, duration: still ? 1 : duration, fps: still ? 1 : 12, options: { bark },
  }, (p, phase, C, o) => {
    groundShadow(p, 0, -1, 13, 3.6);
    paint(p, phase, C, fit(o.bark, 5), o.seed);
  });
}

export function trunk(p, C, { top = -32, bend = 0, width = 5 } = {}) {
  p.poly([[-width-3,1],[-width,-5],[-width+1,-15],[bend-3,top],[bend+2,top],
    [width-1,-17],[width,-5],[width+4,1],[width-1,0],[2,2],[-3,0]], C[0]);
  p.poly([[-width-1,0],[-width+1,-5],[-width+2,-15],[bend-2,top],[bend+1,top],
    [width-2,-16],[width-1,-5],[width+2,0],[2,-1],[0,1],[-2,-1]], C[2]);
  p.polyline([[-width+2,-3],[-width+3,-13],[bend-2,top+2]], C[3]);
  p.line(-2,-2,-1,-10,C[1]);
  p.line(width-2,-4,width-3,-13,C[1]);
  p.px(-width+1,-4,C[4]);
}

export function branch(p, points, width, C) {
  for (let i = 1; i < points.length; i++) {
    const [ax,ay] = points[i - 1], [bx,by] = points[i];
    const thickness = Math.max(2, width - (i-1)*2);
    p.beam(ax,ay,bx,by,thickness,C[0]);
    p.line(ax,ay,bx,by,C[2]);
    if (thickness >= 4) p.line(ax-1,ay,bx-1,by,C[3]);
  }
}

// Cache the pixel art for a crown so swaying only changes where it's stamped.
const crowns = new Map();
const crownCacheLimit = 96;
export function crown(p, x, y, rx, ry, C, seed = 1) {
  const key = [rx,ry,seed,...C].join(",");
  let sprite = crowns.get(key);
  if (!sprite) {
    const w = Math.ceil(rx)+2, h = Math.ceil(ry)+2;
    sprite = new Layer(w*2,h*2);
    paintCrown(sprite.begin(-w,-h),0,0,rx,ry,C,seed);
    if (crowns.size >= crownCacheLimit) crowns.delete(crowns.keys().next().value);
    crowns.set(key,sprite);
  }
  sprite.draw(p,x,y);
}

// A faceted leaf mass with an uneven rim, a shaded underside and lit clusters.
function paintCrown(p, x, y, rx, ry, C, seed) {
  const vertices = [[-1,-0.10],[-0.88,-0.58],[-0.60,-0.66],[-0.36,-0.94],
    [0.03,-1],[0.30,-0.85],[0.54,-0.87],[0.81,-0.62],[0.94,-0.46],[1,0.06],
    [0.86,0.45],[0.65,0.50],[0.39,0.84],[0.10,0.74],[-0.18,0.92],
    [-0.43,0.75],[-0.67,0.69],[-0.90,0.40]];
  const rim = vertices.map(([a,b],i) => [x+a*rx, y+b*ry+(rand(i,11,seed)-0.5)*2]);
  p.poly(rim,C[0]);
  p.poly(rim.map(([a,b]) => [x+(a-x)*0.92,y+(b-y)*0.88]),C[2]);
  p.poly([rim[1],rim[3],rim[4],rim[6],[x+rx*0.51,y-ry*0.27],
    [x+rx*0.16,y-ry*0.06],[x-rx*0.32,y+ry*0.12],[x-rx*0.69,y+ry*0.02]],C[3]);
  p.poly([rim[11],rim[12],rim[14],rim[16],rim[17],[x-rx*0.43,y+ry*0.40],
    [x-rx*0.13,y+ry*0.50],[x+rx*0.15,y+ry*0.26],[x+rx*0.48,y+ry*0.40]],C[1]);
  p.line(x-rx*0.51,y-ry*0.52,x-rx*0.31,y-ry*0.68,C[4]);
  p.line(x-rx*0.15,y-ry*0.46,x+rx*0.08,y-ry*0.56,C[4]);
  p.line(x+rx*0.45,y-ry*0.43,x+rx*0.61,y-ry*0.30,C[3]);
}

export const MAPLE = ["#4b2f39","#773b43","#ac4d43","#db7350","#f4a764"];

export function maple(p, C, bark, sway, seed) {
  branch(p, [[-1,-13],[-10+sway,-24],[-15+sway,-29]], 5, bark);
  branch(p, [[2,-16],[11+sway,-26],[17+sway,-28]], 5, bark);
  trunk(p, bark, { top: -36, bend: -1 });
  for (const [i, [x,y,rx,ry]] of [[-16,-31,12,11],[15,-31,13,11],[-8,-42,14,12],
    [11,-41,14,11],[0,-34,15,11]].entries()) {
    crown(p, x+sway, y, rx, ry, C, seed+i);
  }
}

export function bare(p, C, { burnt = false } = {}) {
  branch(p, [[-1,-13],[-11,-22],[-18,-31],[-17,-37]], 6, C);
  branch(p, [[-12,-23],[-21,-24],[-24,-27]], 3, C);
  branch(p, [[1,-18],[12,-23],[19,-32],[23,-34]], 6, C);
  branch(p, [[11,-23],[13,-32],[11,-37]], 3, C);
  trunk(p, C, { top: burnt ? -36 : -43, bend: -4, width: 6 });
  p.poly(burnt ? [[-7,-32],[-7,-39],[-4,-36],[-1,-43],[0,-35],[2,-31]]
    : [[-7,-37],[-8,-46],[-5,-50],[-3,-43],[-1,-45],[1,-36]], C[0]);
  p.line(-6,-36,-5,burnt ? -37 : -46,C[3]);
  p.polyline([[1,-5],[2,-13],[0,-21],[1,-26]], C[0]);
  p.line(-3,-8,-3,-18,C[3]);
}

export function sprout(p, phase, C = LEAF, bark = WOOD, size = 1) {
  const sway = Math.round(wave(phase) * 1.15), top = Math.round(-15 * size);
  groundShadow(p, 0, 0, 6 * size, 2);
  p.beam(0,0,sway,top,2 * size,bark[0]);
  p.line(-1,-1,sway-1,top,bark[3]);
  const spread = Math.round(7*size);
  crown(p,-spread+sway,top+3,spread,4*size,C,3);
  crown(p,spread-2+sway,top,spread,5*size,C,8);
}

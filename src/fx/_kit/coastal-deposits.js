import { clamp, mix, ramp, rand } from "../../core/index.js";
import { asset, LEAF, wave } from "./art.js";
import { groundShadow, twinkle } from "./sprite.js";

const slate = ["#41515e", "#687980", "#8ca09f", "#b4c1b7", "#e3e2c9"];
const host = ["#49475b", "#706a7d", "#8e8995", "#aaa0a3", "#cec0b6"];
const metals = {
  iron: ramp(["#414d65", "#698397", "#a2baca", "#e6ecdf"]),
  copper: ramp(["#6b514d", "#a8614f", "#dc8b63", "#ffd099"]),
  gold: ramp(["#725744", "#b78b4a", "#ecc35f", "#ffefad"]),
};
const profiles = [
  [[-13,-3],[-10,-13],[-4,-17],[4,-18],[12,-11],[13,-3],[7,2],[-8,1]],
  [[-14,-2],[-11,-10],[-7,-15],[3,-14],[12,-10],[14,-4],[8,1],[-10,1]],
  [[-11,-3],[-9,-12],[-5,-19],[2,-20],[9,-16],[12,-5],[5,2],[-7,2]],
  [[-13,-5],[-10,-15],[-3,-15],[5,-12],[13,-11],[14,-3],[6,1],[-9,1]],
];
const sizes = [0.8, 1, 1.15];
const hostTints = ramp(["#8a9295","#a38982","#768f89"]);
const names = { stone: "Coastal boulder", iron: "Coastal iron seam", copper: "Coastal copper node", gold: "Coastal gold node" };

export function coastalDeposit(material) {
  const metal = metals[material];
  return asset({
    name: names[material],
    desc: metal ? `An angled rock hosting raised ${material} deposits, with chipped and depleted states.`
      : "Faceted coastal stone with chipped and depleted states and four silhouettes.",
    tags: ["resource", metal ? "ore" : "stone", "coast"],
    size: [48, 48], origin: [24, 37], duration: 2.8, palette: metal ? host : slate,
    options: { shape: 0, growth: 1, tint: 0, condition: "fresh" },
  }, (p, t, palette, o) => {
    const tint = clamp(Math.round(o.tint), 0, 2);
    const C = tint ? palette.map(color => mix(color,hostTints[tint],0.12)) : palette;
    const growth = sizes[clamp(Math.round(o.growth), 0, 2)];
    const shape = clamp(Math.round(o.shape), 0, 3);
    const size = o.condition === "depleted" ? growth * 0.68 : growth;
    const at = ([x, y]) => [Math.round(x * size), Math.round(y * size)];
    const poly = (points, color) => p.poly(points.map(at), color);
    const seam = (a, b, color) => p.line(...at(a), ...at(b), color);
    groundShadow(p, 0, 1, 13 * size, 3.6 * size, 0.78);
    if (o.condition === "depleted") {
      const fragments = [[-9,-2,3],[4,-3,4],[0,1,2],[10,1,2]];
      for (const [x, y, r] of fragments) {
        poly([[x-r,y],[x-1,y-r],[x+r,y-1],[x+r-1,y+1],[x-2,y+2]], C[1]);
        seam([x-r+1,y],[x-1,y-r+1], metal ? metal[1] : C[3]);
      }
      return;
    }

    const outline = profiles[shape];
    const [a,b,c,d,e,f,g,h] = outline;
    const ridge = [2 + shape, Math.round((d[1] + f[1]) / 2) - 1];
    poly(outline, C[0]);
    poly([[a[0]+2,a[1]-1],[b[0]+1,b[1]+1],[c[0],c[1]+1],[d[0],d[1]+1],[e[0]-1,e[1]+1],ridge,[-6,-7]], C[3]);
    poly([ridge,[e[0]-1,e[1]+1],[f[0]-1,f[1]],[g[0]-1,g[1]-1],[3,-4]], C[1]);
    poly([[a[0]+2,a[1]],[ -6,-7],ridge,[3,-4],[g[0]-1,g[1]-1],[h[0]+1,h[1]-1]], C[2]);
    seam([b[0]+2,b[1]+1],[c[0]+1,c[1]+2], C[4]);
    seam([c[0]+1,c[1]+2],[d[0]-1,d[1]+2], C[4]);
    seam([-9,-3],[-6,-6], C[3]);
    seam([3,-3],[6,-1], C[3]);
    if (metal) {
      mineralFaces(material, poly, seam, metal, d[1], shape);
      const glint = Math.max(0, wave(t, 1, (o.seed % 11) * 0.13)) ** 9;
      const spark = at([material === "gold" ? 0 : 2, d[1] - 5]);
      twinkle(p, ...spark, 2.4 * glint, metal[2], metal[3]);
    } else {
      poly([[-10,-2],[-8,-5],[-5,-3],[-3,-3],[-5,0],[-10,0]], LEAF[2]);
      seam([-9,-3],[-7,-4], LEAF[4]);
      seam([-5,-11],[-2,-13], C[4]);
      seam([4,-8],[7,-8], C[3]);
      const grit = Math.round(rand(3, 8, o.seed) * 3);
      seam([8,-5 + grit],[9,-5 + grit], C[2]);
    }
    if (o.condition === "chipped") {
      poly([[-2,-7],[3,-8],[6,-6],[5,-4],[0,-3],[-3,-4]], C[0]);
      poly([[-1,-6],[3,-7],[5,-6],[4,-4],[0,-4]], metal ? metal[1] : C[1]);
      seam([-2,-4],[2,-4], metal ? metal[3] : C[4]);
      seam([8,1],[11,0], metal ? metal[2] : C[3]);
    }
  });
}

function mineralFaces(material, poly, seam, M, crest, shape) {
  const top = crest - 1;
  const lean = shape % 2 === 0 ? 0 : 2;
  if (material === "iron") {
    // Flat plate-like blades, with steep sides and a bright beveled edge.
    poly([[-7,top+4],[-4,top-3],[2+lean,top-6],[5,top-3],[2,top+4],[-4,top+7]], M[0]);
    poly([[-5,top+4],[-3,top-2],[2+lean,top-5],[2,top+3],[-3,top+6]], M[2]);
    seam([-3,top-2],[2+lean,top-5], M[3]);
    poly([[1,top+8],[5,top+1],[10,top+3],[8,top+8],[4,top+10]], M[0]);
    poly([[3,top+8],[5,top+2],[9,top+3],[7,top+7]], M[1]);
    seam([5,top+2],[8,top+3], M[3]);
  } else if (material === "copper") {
    // Branches emerge from a dark recess and fork toward either shoulder.
    for (const path of [
      [[-6,top+8],[-5,top+2],[-2,top-2],[1,top-6]],
      [[-3,top+5],[1,top+1],[6,top-2]],
      [[0,top+8],[5,top+5],[9,top+5]],
    ]) {
      for (let i = 1; i < path.length; i++) {
        const [x,y] = path[i - 1], [nx,ny] = path[i];
        poly([[x-1,y+1],[x-1,y-1],[nx,ny-1],[nx+1,ny+1]], M[0]);
        seam([x,y],[nx,ny], M[2]);
        if (i === 1) seam([x,y-1],[nx,ny-1], M[3]);
      }
    }
  } else {
    // Broad, irregular nuggets read as a distinct silhouette from the blades and branches.
    for (const [x, y, r] of [[-5,top+2,4],[1,top-3,5],[6,top+6,4],[0,top+10,2]]) {
      poly([[x-r,y+1],[x-r+1,y-2],[x-1,y-r],[x+r-1,y-r+1],[x+r,y+1],[x+1,y+3],[x-2,y+3]], M[0]);
      poly([[x-r+1,y],[x-1,y-r+1],[x+r-1,y-r+1],[x+r-1,y],[x+1,y+2],[x-2,y+2]], M[2]);
      seam([x-2,y-1],[x+1,y-2], M[3]);
      seam([x+1,y+2],[x+r-1,y], M[1]);
    }
  }
}

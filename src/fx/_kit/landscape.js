import { clamp, fit, noise2, rand } from "../../core/index.js";
import { asset, cacheArt, LEAF, RED, STEEL, WOOD, round, wave } from "./art.js";
import { groundShadow } from "./sprite.js";

export function pathTile(name, desc, palette, stone = false) {
  return asset({name, desc, tags: ["tile","path"], size:[16,16], origin:[8,12], palette, options:{edges:"EW",tileX:0,tileY:0}}, (p, _ph, C, o) => {
    const sides = o.edges.toUpperCase();
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const X = x + o.tileX * 16, Y = y + o.tileY * 16;
        const margin = Math.min(sides.includes("N") ? 16 : y, sides.includes("S") ? 16 : 15-y,
          sides.includes("E") ? 16 : 15-x, sides.includes("W") ? 16 : x);
        const v = rand(X,Y,o.seed), edge = v > 0.8 ? 1 : 0;
        if (margin < edge) continue;
        const row = Math.floor(Y / 4), joint = (X + 3 * (row & 1)) % 7 === 0;
        const shade = stone ? (Y % 4 === 3 || joint ? 1 : v > 0.8 ? 4 : Y % 4 === 0 ? 3 : 2) : v > 0.91 ? 4 : v < 0.12 ? 1 : 2;
        p.px(x-8,y-12,C[margin === edge ? 1 : shade]);
      }
    }
  });
}

export function cliffTile(name, corner) {
  return asset({name, desc: corner ? "A corner segment with a raised turf lip and two shaded rock faces." : "A repeatable cliff wall with a grassy lip and vertical rock clefts.",
    tags:["cliff","tile","rock"], size:[16,32], origin:[8,24], palette:STEEL}, (p,_ph,C,o) => {
    for (let y = -20; y < 1; y++) {
      for (let x = -8; x < 8; x++) {
        const side = corner && x > 1, top = -18 + (side ? Math.floor((x-1)*0.5) : 0);
        const base = side ? -Math.floor((x-1)*0.5) : 0;
        if (y < top || y >= base) continue;
        if (y < top+4) {
          p.px(x,y,LEAF[y === top ? 3 : y === top+3 ? 0 : 2]);
          continue;
        }
        const seam = ((x+16+Math.floor(y/5)) % 7) === 0;
        const n = rand(x,y,o.seed);
        const band = y === base-1 || seam ? 0 : y % 6 === 0 ? 1 : n > 0.84 ? 3 : 2;
        p.px(x,y,C[clamp(band-Number(side),0,4)]);
      }
    }
  });
}

const pineCanopy = cacheArt(42, 48, -21, -54, (p,C,sway) => {
  for (const [top,w] of [[-32,16],[-38,13],[-44,10],[-51,6]]) {
    const x = sway * (top < -38 ? 1 : 0.5);
    p.poly([[x,top],[x+w-2,top+14],[x+w,top+18],[x+w-4,top+18],[x+w-6,top+21],
      [x-3,top+20],[x-5,top+22],[x-w+4,top+20],[x-w,top+19],[x-w+3,top+16]],C[0]);
    p.poly([[x,top+2],[x+w-2,top+18],[x-w+2,top+18]],C[2]);
    p.poly([[x-1,top+4],[x+2,top+13],[x-w+3,top+17]],C[3]);
    p.line(x-2,top+9,x-5,top+14,C[4]);
    if(w>8){p.line(x-4,top+16,x-8,top+17,C[4]);p.line(x+4,top+14,x+8,top+16,C[1]);}
  }
});

export function treeAsset(name, type, palette) {
  return asset({name, desc: {oak:"A broad oak with a forked trunk and swaying layered foliage.",
    pine:"A tall pine with four staggered tiers of evergreen needles.", cherry:"A cherry tree with spring blossoms or ripe fruit in its swaying canopy."}[type],
    tags:["tree",type,"foliage"], size:[48,64], origin:[24,54], palette, options:{fruit:true}}, (p,ph,C,o)=>{
    const sway = Math.round(wave(ph) * 1.1);
    groundShadow(p,0,-1,12,3.4);
    p.poly([[-4,0],[-1,-8],[-1,-27],[3,-27],[3,-7],[6,0],[2,-1],[0,0]],WOOD[1]);
    p.line(-2,-1,0,-22,WOOD[3]);
    p.line(1,-8,2,-15,WOOD[2]);
    if (type === "pine") {
      pineCanopy(p,C,sway);
    } else {
      p.beam(-1,-11,-11+sway,-26,3,WOOD[2]);
      p.beam(2,-15,10+sway,-29,3,WOOD[1]);
      for (const [x,y,rx,ry] of [[-10,-28,9,8],[11,-29,9,8],[6,-37,11,9],[-6,-38,11,9],[1,-30,11,8]]) {
        round(p,x+sway,y,rx,ry,C);
      }
      for (const [x,y] of [[-13,-30],[-8,-38],[3,-41],[12,-33],[2,-30],[-4,-27]]) {
        p.line(x+sway,y,x+sway+2,y-1,C[4]);
        if (type === "cherry") {
          round(p,x+sway,y+2,o.fruit ? 1.9 : 1.3,1.5,o.fruit ? RED : C);
          if (o.fruit) p.line(x+sway,y+1,x+sway+1,y-1,LEAF[1]);
        }
      }
    }
  });
}

export function stream(p, ph, C, o) {
  const S = fit(o.bank,5);
  for (let y=0;y<16;y++) {
    for (let x=0;x<16;x++) {
      const across=o.facing==="east-west"?y:x, along=o.facing==="east-west"?x:y;
      const a=along+o.tileOffset*16, d=Math.min(across,15-across);
      const meander=wave((a+0.5)/16,1)*0.8;
      if (d < 0.7 - meander) continue;
      if (d<2) {p.px(x-8,y-12,S[d===0?3:1]);continue;}
      const ripple=wave(ph+(a*0.084+across*0.061),1) + noise2(a/6,across/4,o.seed);
      p.px(x-8,y-12,C[d===2 ? (ripple>0.55?4:2) : ripple>0.93?3:d<5?2:1]);
    }
  }
}

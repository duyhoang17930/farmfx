import { fit, ramp } from "../../core/index.js";
import { asset, CREAM, GOLD, LEAF, STEEL, VIOLET, WATER, WOOD, round } from "./art.js";

const BARK = ramp(["#382a39","#5d3d43","#885548","#b87857","#d69a6b"]);
const CLAY = ramp(["#593641","#804648","#b26751","#d88963","#edad81"]);
const CHARCOAL = ramp(["#23202e","#363145","#514b5e","#746c7c","#9794a3"]);
const SHELL = ramp(["#50374d","#87566e","#bf8493","#e5adb0","#ffdfcd"]);
const CHALK = ramp(["#4c4c49","#76766a","#a4a08c","#cdccb0","#f1ebcf"]);
const AMBER = ramp(["#56313c","#945037","#cb7e3e","#efa44e","#ffe097"]);
const MINT = ramp(["#2d454c","#4b6468","#7a9994","#b0c2ac","#e4e4c8"]);
const FIBER = ramp(["#353e2e","#5b6640","#85914f","#b4b765","#e0cd89"]);

function poly(p, x, y, points, color) {
  p.poly(points.map(([dx,dy]) => [x+dx,y+dy]), color);
}

function chip(p, x, y, C) {
  poly(p,x,y,[[-5,2],[-4,-1],[-2,-4],[2,-5],[5,-1],[4,3],[1,5],[-3,4]],C[0]);
  poly(p,x,y,[[-4,1],[-3,-1],[-1,-4],[2,-4],[4,-1],[2,1],[-1,2]],C[2]);
  poly(p,x,y,[[-1,2],[2,1],[4,-1],[3,3],[0,4],[-3,3]],C[1]);
  p.line(x-3,y,x-1,y-3,C[3]);
  p.px(x,y-4,C[4]);
}

function ore(note, palette, deposits, host = STEEL) {
  return [note, palette, (p,x,y,C) => {
    chip(p,x,y,host);
    for (const [dx,dy,w,h] of deposits) {
      poly(p,x+dx,y+dy,[[-1,h-1],[0,0],[w-2,-1],[w-1,1],[w-1,h],[0,h]],C[0]);
      p.line(x+dx,y+dy,x+dx+w-2,y+dy,C[4]);
      p.line(x+dx,y+dy+1,x+dx+w-1,y+dy+h-1,C[2]);
      if(h>2) p.px(x+dx,y+dy+2,C[3]);
    }
  }];
}

function crystal(p,x,y,w,h,lean,C) {
  const tip=[lean,-h];
  poly(p,x,y,[[-w-1,-1],[-w,-h+2],tip,[w,-h+3],[w+1,0],[0,1]],C[0]);
  poly(p,x,y,[[-w,-1],[-w+1,-h+2],[lean,-h+1],[0,-1]],C[3]);
  poly(p,x,y,[[lean,-h+1],[w-1,-h+3],[w,0],[0,-1]],C[2]);
  p.line(x+lean,y-h+1,x,y-1,C[4]);
}

const items = {
  wood: ["A short brown log with a cut end.", WOOD, (p,x,y,C) => {
    p.beam(x-3,y+2,x+3,y-2,5,C[2]);
    p.line(x-2,y,x+3,y-3,C[4]);
    p.ellipse(x-3,y+2,2,2.5,C[1]);
    p.px(x-4,y+1,C[4]);
  }],
  hardwood: ["A split dark timber block with a warm heartwood face.", BARK, (p,x,y,C) => {
    poly(p,x,y,[[-5,0],[1,-5],[5,-3],[5,0],[-1,5],[-5,4]],C[0]);
    poly(p,x,y,[[-4,0],[1,-4],[4,-3],[-1,1]],C[3]);
    poly(p,x,y,[[-1,2],[4,-2],[4,0],[-1,4]],C[1]);
    p.rect(x-4,y+1,3,3,C[2]);
    p.px(x-3,y+2,C[4]);
    p.line(x-3,y,x+1,y-3,C[4]);
  }],
  stick: ["A slim forked twig with a pale broken tip.", WOOD, (p,x,y,C) => {
    p.polyline([[x-4,y+5],[x-2,y+1],[x+2,y-1],[x+4,y-5]],C[0]);
    p.polyline([[x-4,y+4],[x-2,y],[x+2,y-2],[x+4,y-5]],C[3]);
    p.polyline([[x-2,y],[x-3,y-2],[x-5,y-3]],C[2]);
    p.px(x+4,y-5,C[4]);
  }],
  bark: ["Three rough curling bark flakes with reddish edges.", BARK, (p,x,y,C) => {
    poly(p,x,y,[[-5,3],[-4,-2],[-2,-5],[0,-3],[2,-4],[5,-2],[4,1],[2,4],[-1,5]],C[0]);
    p.polyline([[x-4,y+2],[x-2,y-4],[x-1,y-2],[x-2,y+3]],C[2]);
    p.polyline([[x,y+4],[x+1,y],[x+3,y-3],[x+4,y-2]],C[3]);
    p.line(x-4,y+3,x-1,y+4,C[4]);
  }],
  stone: ["An angular slate-gray stone with a bright top edge.", STEEL, (p,x,y,C) => {
    poly(p,x,y,[[-5,2],[-4,-1],[-1,-4],[3,-3],[5,2],[3,4],[-3,4]],C[1]);
    poly(p,x,y,[[-4,1],[-1,-3],[3,-2],[4,1],[0,2]],C[3]);
    p.line(x-2,y-1,x,y-2,C[4]);
  }],
  pebble: ["A small smooth river pebble with a rounded highlight.", STEEL, (p,x,y,C) => {
    round(p,x-1,y+1,3.5,2.8,C);
    p.px(x-2,y-1,C[4]);
    p.px(x+4,y+3,C[2]);
  }],
  coal: ["Two deep charcoal chips with blue-gray edges.", CHARCOAL, (p,x,y,C) => {
    poly(p,x,y,[[-5,0],[-3,-4],[1,-5],[4,-3],[5,1],[1,4],[-3,3]],C[0]);
    poly(p,x,y,[[-4,0],[-2,-3],[1,-4],[3,-2],[1,0],[-1,2]],C[2]);
    p.line(x-2,y-3,x+1,y-4,C[4]);
    poly(p,x,y,[[0,3],[3,0],[5,2],[3,5]],C[1]);
    p.px(x+3,y+1,C[3]);
  }],
  "copper-ore": ore("Orange copper nodules on a green-gray chip.",
    ramp(["#65363b","#994a3c","#c76a45","#e58c55","#ffc281"]), [[-2,-3,4,3],[1,0,4,2]], MINT),
  "iron-ore": ore("Broad rust-red bands on a dark iron fragment.",
    ramp(["#643840","#83474a","#a9594d","#cd8063","#e9ae89"]), [[-2,-3,4,2],[-2,1,5,2]], CHARCOAL),
  "gold-ore": ore("Bright yellow metal exposed in two chunky seams.",
    GOLD, [[-3,-2,4,3],[1,-1,4,4]]),
  "silver-ore": ore("White silver flakes over a cool purple stone.",
    CHALK, [[-2,-3,5,2],[0,0,4,2]], VIOLET),
  "tin-ore": ore("Small pale-green flecks on a warm ochre matrix.",
    MINT, [[-3,-2,2,2],[0,-3,2,1],[2,0,3,2],[-1,2,2,1]], WOOD),
  "titanium-ore": ore("Three vivid blue veins on a dark ore fragment.",
    ramp(["#29334d","#405480","#6487bd","#94b0df","#c6ddf3"]), [[-3,-1,3,3],[0,-3,3,4],[2,0,3,3]], CHARCOAL),
  fiber: ["A tied fan of long green-gold plant fibers.", FIBER, (p,x,y,C) => {
    for(const [dx,dy] of [[-5,-2],[-4,-4],[-2,-5],[0,-5],[2,-4],[4,-3]]) {
      p.line(x+dx,y+dy,x+2,y+5,C[1]);
      p.line(x+dx,y+dy,x+1,y+3,C[3]);
      p.px(x+dx,y+dy,C[4]);
    }
    p.line(x-1,y+1,x+3,y,GOLD[2]);
    p.px(x,y+1,GOLD[4]);
  }],
  cotton: ["Three white cotton bolls with green bracts.", CREAM, (p,x,y,C) => {
    p.tri(x-4,y+1,x+5,y,x+1,y+5,LEAF[1]);
    for (const [dx,dy] of [[-3,0],[3,0],[0,-3]]) round(p,x+dx,y+dy,2.4,2.4,C);
    p.line(x,y+4,x+1,y+2,LEAF[3]);
  }],
  sand: ["A loose golden sand pile with scattered grains.", GOLD, (p,x,y,C) => {
    poly(p,x,y,[[-5,3],[-4,1],[-2,0],[0,-3],[2,-2],[5,2],[4,4],[-3,4]],C[1]);
    poly(p,x,y,[[-4,2],[-2,1],[0,-2],[2,-1],[4,2],[0,3]],C[3]);
    p.px(x,y-2,C[4]);
    p.px(x-4,y+4,C[2]);
    p.px(x+5,y+4,C[3]);
  }],
  clay: ["A lumpy terracotta piece with two drying cracks.", CLAY, (p,x,y,C) => {
    p.ellipse(x,y+1,5.4,3.9,C[0]);
    p.ellipse(x,y,4.7,3.4,C[2]);
    p.line(x-3,y-2,x+1,y-3,C[4]);
    p.polyline([[x-1,y-1],[x,y],[x-2,y+2]],C[1]);
    p.line(x+2,y+1,x+4,y-1,C[1]);
  }],
  limestone: ["A pale chalky block with a stepped edge.", CHALK, (p,x,y,C) => {
    poly(p,x,y,[[-5,-1],[-2,-4],[4,-4],[5,-1],[4,3],[1,5],[-5,3]],C[0]);
    poly(p,x,y,[[-4,-1],[-2,-3],[4,-3],[4,-1],[0,1],[-4,1]],C[3]);
    poly(p,x,y,[[-4,2],[0,2],[4,0],[3,3],[1,4],[-4,3]],C[2]);
    p.line(x-3,y-1,x+2,y-2,C[4]);
  }],
  sulfur: ["Mustard-yellow sulfur nodules with bright centers.", GOLD, (p,x,y,C) => {
    poly(p,x,y,[[-5,1],[-3,-3],[1,-4],[5,-1],[5,3],[1,4],[-3,3]],C[0]);
    for (const [dx,dy] of [[-2,0],[1,-2],[3,1],[0,2]]) {
      p.ellipse(x+dx,y+dy,2,1.6,C[2]);
      p.px(x+dx-1,y+dy-1,C[4]);
    }
  }],
  salt: ["An angular pile of rosy salt cubes.", SHELL, (p,x,y,C) => {
    for (const [dx,dy] of [[-3,0],[1,-3],[2,2],[-2,3]]) {
      poly(p,x+dx,y+dy,[[-2,0],[0,-1],[2,0],[2,2],[0,3],[-2,2]],C[1]);
      poly(p,x+dx,y+dy,[[-2,0],[0,-1],[2,0],[0,1]],C[4]);
      p.line(x+dx-1,y+dy+1,x+dx-1,y+dy+2,C[3]);
    }
  }],
  resin: ["A hardened amber bead with a trapped fleck.", AMBER, (p,x,y,C) => {
    poly(p,x,y,[[0,-5],[3,-3],[5,1],[3,4],[0,5],[-4,3],[-5,0],[-3,-3]],C[0]);
    poly(p,x,y,[[0,-4],[2,-3],[4,1],[2,4],[-2,3],[-4,0],[-2,-2]],C[2]);
    p.polyline([[x-3,y],[x-2,y-2],[x,y-3]],C[4]);
    p.px(x+1,y+1,C[1]);
    p.px(x+2,y+2,C[3]);
  }],
  sap: ["A golden drop of fresh tree sap.", GOLD, (p,x,y,C) => {
    poly(p,x,y,[[0,-5],[4,0],[4,3],[2,5],[-2,5],[-4,3],[-4,0]],C[0]);
    poly(p,x,y,[[0,-4],[3,1],[3,3],[1,4],[-2,4],[-3,2],[-2,0]],C[3]);
    p.line(x-2,y,x-2,y+2,C[4]);
    p.px(x+1,y+3,C[2]);
  }],
  bone: ["A small ivory bone with rounded joints.", CREAM, (p,x,y,C) => {
    p.beam(x-3,y+3,x+3,y-3,4,C[0]);
    p.beam(x-3,y+3,x+3,y-3,2,C[2]);
    p.line(x-3,y+2,x+2,y-3,C[3]);
    for (const [dx,dy] of [[-3,3],[3,-3]]) {
      p.ellipse(x+dx,y+dy,2.4,2,C[0]);
      p.ellipse(x+dx-0.4,y+dy-0.4,1.5,1.2,C[3]);
      p.px(x+dx,y+dy-1,C[4]);
    }
  }],
  feather: ["A curved pale feather with a fine central quill.", STEEL, (p,x,y,C) => {
    poly(p,x,y,[[5,-5],[5,-1],[3,2],[1,3],[-2,3],[-2,0],[0,-3],[3,-5]],C[1]);
    poly(p,x,y,[[4,-4],[4,-1],[2,2],[0,2],[-1,1],[0,-2],[3,-4]],CREAM[4]);
    p.line(x-5,y+5,x+3,y-3,C[2]);
    p.px(x+4,y-4,C[4]);
  }],
  leather: ["A folded tan hide with uneven cut edges.", BARK, (p,x,y,C) => {
    poly(p,x,y,[[-5,-4],[-1,-3],[4,-5],[5,-3],[3,0],[5,3],[1,4],[-1,5],[-5,3],[-3,0]],C[0]);
    poly(p,x,y,[[-4,-3],[0,-2],[4,-4],[3,-2],[2,0],[4,2],[0,3],[-3,3],[-2,0]],C[3]);
    p.line(x-2,y+2,x+3,y+1,C[2]);
    p.px(x+3,y-3,C[4]);
  }],
  wool: ["A cream fleece tuft with overlapping curls.", CHALK, (p,x,y,C) => {
    for (const [dx,dy,w] of [[-2,-1,3],[2,-1,3],[-2,2,3],[2,2,3],[0,-2,3]]) {
      p.ellipse(x+dx,y+dy,w,2.6,C[1]);
      p.ellipse(x+dx-0.3,y+dy-0.4,w-0.6,1.9,C[3]);
      p.px(x+dx-1,y+dy-1,C[4]);
    }
    p.line(x-1,y+1,x+1,y+2,C[2]);
  }],
  seashell: ["A pink scallop shell with three raised ribs.", SHELL, (p,x,y,C) => {
    poly(p,x,y,[[-2,4],[-5,0],[-5,-2],[-2,-4],[2,-4],[5,-2],[5,0],[2,4]],C[0]);
    poly(p,x,y,[[-1,3],[-4,0],[-4,-2],[-2,-3],[2,-3],[4,-2],[4,0],[1,3]],C[3]);
    for (const dx of [-3,0,3]) p.line(x,y+2,x+dx,y-2,C[4]);
    p.line(x-1,y+3,x+1,y+3,C[2]);
  }],
  seaweed: ["Three dark teal fronds gathered at the root.", WATER, (p,x,y,C) => {
    for (const [dx,dy] of [[-4,-3],[-1,-4],[4,-4]]) {
      const bend=Math.round(dx*0.42);
      p.beam(x,y+4,x+bend,y,3,C[0]);
      p.beam(x+bend,y,x+dx,y+dy,3,C[1]);
      p.polyline([[x,y+3],[x+bend,y],[x+dx,y+dy]],C[3]);
      p.px(x+dx,y+dy,C[4]);
    }
    p.line(x-2,y+3,x+3,y+4,LEAF[1]);
  }],
  obsidian: ["Two sharp black-violet volcanic glass splinters.", CHARCOAL, (p,x,y,C) => {
    crystal(p,x+2,y+4,2,7,1,C);
    crystal(p,x-1,y+4,3,9,-1,C);
  }],
  crystal: ["A pale quartz point with blue-green faces.", WATER, (p,x,y,C) => {
    crystal(p,x-2,y+4,2,6,-1,C);
    crystal(p,x+1,y+4,3,9,0,C);
    p.px(x+1,y-4,CREAM[4]);
  }],
};

export function drawRawIcon(p, id, x, y) {
  const key = typeof id === "string" && id.startsWith("items/raw/") ? id.slice("items/raw/".length) : id;
  if (!Object.hasOwn(items,key)) return;
  const [,palette,paint] = items[key];
  paint(p,x,y,fit(palette,5));
}

export function rawItem(id) {
  const [desc,palette,paint] = items[id];
  const name = id[0].toUpperCase()+id.slice(1).replaceAll("-"," ");
  return asset({
    name, desc, tags: ["item","inventory","raw",id], size: [16,16], origin: [8,8],
    duration: 1, fps: 1, bg: "dark", palette,
  }, (p,_phase,C) => paint(p,0,0,C));
}

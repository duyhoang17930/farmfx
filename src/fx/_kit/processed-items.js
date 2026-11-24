import { ramp } from "../../core/index.js";
import { CREAM, GOLD, STEEL, VIOLET, WATER, WOOD, round } from "./art.js";
import { inventoryItems, itemPoly as poly } from "./inventory-items.js";

const DARK_WOOD = ramp(["#372733","#54323c","#80504a","#b2765a","#e4ad83"]);
const COAL = ramp(["#292232","#3c3545","#585364","#767487","#a3a0ad"]);
const CLAY = ramp(["#4f3038","#803c43","#b65a4b","#d78159","#f6b77e"]);
const FLAX = ramp(["#49402e","#6f5b3e","#967a50","#c0a474","#e8cf94"]);
const PARCHMENT = ramp(["#554650","#887566","#bcaa8e","#e7d5af","#fff1cf"]);
const MINT = ramp(["#30434a","#536b66","#89a297","#bed1b6","#eff2cf"]);
const BLUE_STEEL = ramp(["#29374a","#40576e","#66869c","#9bbfca","#d5e6e1"]);

function board(p,x,y,C,grain) {
  poly(p,x,y,[[-5,0],[1,-5],[5,-3],[5,0],[-2,5],[-5,3]],C[0]);
  poly(p,x,y,[[-4,0],[1,-4],[4,-3],[-2,2]],C[3]);
  poly(p,x,y,[[-2,3],[4,-2],[4,0],[-2,4],[-4,3],[-4,1]],C[2]);
  p.line(x-4,y,x+1,y-4,C[4]);
  for (const [ax,ay,bx,by] of grain) p.line(x+ax,y+ay,x+bx,y+by,C[1]);
}

function ingot(desc,palette,stamps) {
  return [desc,palette,(p,x,y,C) => {
    poly(p,x,y,[[-5,2],[-3,-3],[2,-4],[5,-2],[5,1],[2,4],[-3,4]],C[0]);
    poly(p,x,y,[[-4,2],[-2,-3],[2,-3],[4,-2],[2,1],[-2,2]],C[3]);
    poly(p,x,y,[[-4,2],[-2,3],[2,2],[4,-1],[4,1],[2,3],[-2,4]],C[2]);
    p.line(x-4,y+1,x-2,y-2,C[4]);
    p.line(x-2,y-3,x+2,y-3,C[4]);
    for (const [ax,ay,bx,by] of stamps) p.line(x+ax,y+ay,x+bx,y+by,C[1]);
  }];
}

function sack(p,x,y,C,contents) {
  poly(p,x,y,[[-4,-3],[4,-3],[3,-1],[5,2],[4,5],[-4,5],[-5,2],[-3,-1]],C[0]);
  poly(p,x,y,[[-3,-2],[3,-2],[2,-1],[4,2],[3,4],[-3,4],[-4,2],[-2,-1]],C[2]);
  p.line(x-3,y+1,x-3,y+3,C[3]);
  p.line(x-2,y+4,x+2,y+4,C[1]);
  p.ellipse(x,y-3,4.1,2.2,C[1]);
  p.ellipse(x,y-3,3,1.5,contents[3]);
  p.px(x-1,y-4,contents[4]);
}

function bottle(p,x,y,C,liquid,tall) {
  const w=tall?3:4;
  p.rect(x-2,y-5,5,3,C[0]);
  p.line(x-1,y-5,x+1,y-5,GOLD[3]);
  poly(p,x,y,[[-2,-2],[-w,0],[-w,4],[-w+1,5],[w-1,5],[w,4],[w,0],[2,-2]],C[0]);
  poly(p,x,y,[[-1,-2],[-w+1,0],[-w+1,4],[w-1,4],[w-1,0],[1,-2]],C[2]);
  p.rect(x-w+1,y+1,2*w-1,3,liquid[2]);
  p.line(x-w+1,y+1,x+w-1,y+1,liquid[4]);
  p.line(x-w+1,y+2,x-w+1,y+3,C[4]);
}

const items = {
  plank: ["A pale sawn board with straight grain and a bright edge.",WOOD,(p,x,y,C) => {
    board(p,x,y,C,[[-2,0,-1,-1],[1,-3,2,-4]]);
  }],
  "hardwood-plank": ["A dark timber plank with a striped cut end and two knots.",DARK_WOOD,(p,x,y,C) => {
    board(p,x,y,C,[[-2,1,1,-2],[0,0,0,-1],[-4,2,-3,3]]);
    p.px(x+3,y-3,C[4]);
  }],
  charcoal: ["Three lightweight black charcoal sticks with pale ash along the cracks.",COAL,(p,x,y,C) => {
    poly(p,x,y,[[-5,1],[-3,-4],[-1,-5],[1,-3],[0,1],[-2,5]],C[0]);
    poly(p,x,y,[[-4,1],[-2,-4],[0,-3],[-2,3]],C[2]);
    p.line(x-4,y+1,x-2,y-3,C[4]);
    poly(p,x,y,[[0,2],[2,-4],[4,-3],[5,1],[2,5]],C[1]);
    p.line(x+1,y+2,x+3,y-2,C[3]);
    p.px(x+3,y-3,C[4]);
    p.line(x-2,y+3,x+2,y+3,C[2]);
  }],
  "copper-ingot": ingot("A bright copper bar with an orange face and a single stamped line.",
    ramp(["#55313b","#864343","#bb654d","#e38b59","#ffc096"]),[[-1,0,1,-1]]),
  "iron-ingot": ingot("A dark forged iron bar with a muted gray face.",
    ramp(["#292c3c","#454350","#62616c","#85848c","#bbb4ad"]),[[-2,0,0,0],[1,-2,2,-2]]),
  "gold-ingot": ingot("A yellow gold bar with a small stamped mark.",GOLD,[[-1,-1,0,-1],[0,-1,1,0]]),
  "silver-ingot": ingot("A bright ivory-silver bar with a subtle violet bevel.",
    ramp(["#48415b","#786e85","#ada6b7","#ddd8d8","#fff8e8"]),[[0,0,2,-2]]),
  "tin-ingot": ingot("A soft pale tin bar with a green-gray cast.",MINT,[[-2,0,-1,0],[1,-2,2,-2]]),
  "bronze-ingot": ingot("A warm dark bronze bar stamped with two marks.",
    ramp(["#4b3238","#794b39","#a37245","#c6985b","#e9c27a"]),[[-1,0,-1,-1],[2,0,2,-1]]),
  "steel-ingot": ingot("A blue steel bar with a dark center stamp and a crisp edge.",
    BLUE_STEEL,[[-2,0,1,-1],[0,-1,2,-1]]),
  "titanium-ingot": ingot("A violet-blue titanium bar with a three-pixel diagonal hallmark.",
    ramp(["#343454","#525583","#7c84b5","#a0add4","#e0e4fa"]),[[-1,1,2,-2]]),
  brick: ["Two stacked fired-clay bricks with orange top faces.",CLAY,(p,x,y,C) => {
    for (const [dx,dy] of [[0,2],[-1,-1]]) {
      poly(p,x+dx,y+dy,[[-4,0],[-2,-3],[3,-3],[5,-1],[5,2],[3,3],[-4,3]],C[0]);
      poly(p,x+dx,y+dy,[[-3,0],[-2,-2],[3,-2],[4,-1],[2,0]],C[3]);
      p.rect(x+dx-3,y+dy+1,7,1,C[2]);
      p.line(x+dx-2,y+dy-2,x+dx+2,y+dy-2,C[4]);
    }
  }],
  glass: ["A thin blue-green glass pane with two bright reflections.",WATER,(p,x,y,C) => {
    poly(p,x,y,[[-5,1],[-1,-5],[5,-4],[5,-2],[1,5],[-5,3]],C[0]);
    poly(p,x,y,[[-4,1],[-1,-4],[4,-3],[1,3],[-4,2]],C[2]);
    p.line(x-4,y+1,x-1,y-4,C[4]);
    p.line(x-2,y+1,x,y-2,C[4]);
    p.line(x,y+1,x+2,y-2,C[3]);
    p.line(x-3,y+3,x+1,y+4,C[1]);
  }],
  paper: ["A stack of cream pages with an upturned corner.",PARCHMENT,(p,x,y,C) => {
    poly(p,x,y,[[-5,1],[-2,-5],[4,-5],[5,-3],[3,4],[-4,5]],C[0]);
    poly(p,x,y,[[-4,1],[-2,-4],[3,-4],[4,-2],[1,2],[-3,3]],C[3]);
    p.line(x-3,y+3,x+2,y+2,C[2]);
    p.line(x-3,y+4,x+2,y+3,C[3]);
    p.line(x-1,y-4,x+2,y-4,C[4]);
    p.line(x-2,y+1,x,y,C[2]);
    p.tri(x+1,y-3,x+4,y-2,x+2,y-1,C[4]);
  }],
  rope: ["A coiled tan rope with tucked ends and diagonal twists.",FLAX,(p,x,y,C) => {
    p.ellipse(x,y+1,5.4,4.2,C[0]);
    p.ellipse(x,y,4.7,3.4,C[2]);
    p.ellipse(x,y,2.2,1.4,C[0]);
    p.line(x-2,y-2,x+1,y-2,C[4]);
    p.polyline([[x+2,y],[x+3,y+2],[x+1,y+3],[x-2,y+3]],C[3]);
    p.line(x-4,y+1,x-2,y+2,C[1]);
    p.line(x+3,y+1,x+5,y+4,C[4]);
  }],
  thread: ["A small wooden spool wound with cream thread.",CREAM,(p,x,y,C) => {
    p.rect(x-3,y-3,7,7,WOOD[1]);
    p.rect(x-2,y-3,5,6,C[3]);
    for(const dy of [-2,0,2]) p.line(x-2,y+dy,x+2,y+dy-1,C[2]);
    p.ellipse(x,y-4,4.2,1.4,WOOD[2]);
    p.ellipse(x,y+4,4.2,1.5,WOOD[2]);
    p.line(x-2,y-4,x+2,y-4,WOOD[4]);
    p.px(x,y-4,WOOD[1]);
    p.polyline([[x+2,y+1],[x+4,y+2],[x+5,y+1]],C[4]);
  }],
  cloth: ["A folded lilac swatch with a stitched hem.",VIOLET,(p,x,y,C) => {
    poly(p,x,y,[[-5,1],[-2,-4],[3,-5],[5,-2],[3,4],[-2,5],[-5,3]],C[0]);
    poly(p,x,y,[[-4,1],[-2,-3],[3,-4],[4,-2],[1,2],[-3,3]],C[3]);
    p.line(x-3,y+3,x+2,y+3,C[2]);
    p.line(x-2,y-3,x-3,y+1,C[4]);
    p.px(x-1,y+2,C[4]); p.px(x+1,y+1,C[4]); p.px(x+3,y-1,C[4]);
  }],
  "leather-roll": ["A brown hide rolled into a cylinder, with a visible spiral end.",DARK_WOOD,(p,x,y,C) => {
    p.beam(x-2,y+2,x+2,y-2,6,C[0]);
    p.beam(x-2,y+2,x+2,y-2,4.6,C[2]);
    p.line(x-4,y,x+1,y-5,C[4]);
    p.ellipse(x-2,y+2,3.2,2.8,C[1]);
    p.ellipse(x-2.3,y+1.8,2.3,1.9,C[3]);
    p.polyline([[x-4,y+2],[x-3,y+1],[x-1,y+1],[x-1,y+3],[x-2,y+3]],C[0]);
    p.px(x-2,y+2,C[4]);
  }],
  flour: ["An open cloth sack filled with off-white flour.",FLAX,(p,x,y,C) => {
    sack(p,x,y,C,CREAM);
    p.line(x-1,y+1,x+1,y+1,CREAM[4]);
    p.px(x,y+2,CREAM[4]);
  }],
  sugar: ["Two white sugar cubes with a small loose crystal.",PARCHMENT,(p,x,y,C) => {
    for (const [dx,dy] of [[1,-2],[-2,0]]) {
      poly(p,x+dx,y+dy,[[-3,0],[0,-2],[3,0],[3,3],[0,5],[-3,3]],C[0]);
      poly(p,x+dx,y+dy,[[-2,0],[0,-1],[2,0],[0,2]],C[4]);
      poly(p,x+dx,y+dy,[[-2,1],[0,2],[0,4],[-2,3]],C[3]);
      poly(p,x+dx,y+dy,[[0,2],[2,1],[2,3],[0,4]],C[2]);
    }
    p.px(x+4,y+3,C[4]);
  }],
  "cooking-oil": ["A squat green glass bottle with bright golden oil.",MINT,(p,x,y,C) => {
    bottle(p,x,y,C,GOLD,false);
    p.px(x+1,y+3,GOLD[4]);
  }],
  "refined-oil": ["A tall steel-blue oil vial marked with a copper band.",BLUE_STEEL,(p,x,y,C) => {
    bottle(p,x,y,C,WOOD,true);
    p.line(x-2,y+2,x+2,y+2,GOLD[2]);
    p.px(x+1,y+3,C[3]);
  }],
  cement: ["A gray mortar sack with a folded top and worn seam.",STEEL,(p,x,y,C) => {
    poly(p,x,y,[[-5,-2],[-3,-5],[3,-5],[5,-2],[4,3],[2,5],[-4,4]],C[0]);
    poly(p,x,y,[[-4,-1],[-2,-4],[2,-4],[4,-2],[3,3],[1,4],[-4,3]],C[2]);
    p.line(x-2,y-4,x+2,y-4,C[4]);
    p.line(x-3,y-2,x+3,y-2,C[1]);
    p.rect(x-2,y,4,3,C[3]);
    p.px(x,y+1,C[1]);
  }],
  "polished-stone": ["A smooth-cut stone tile with bevels and a pale reflective streak.",STEEL,(p,x,y,C) => {
    poly(p,x,y,[[-5,0],[-1,-4],[4,-3],[5,0],[3,4],[-2,5],[-5,3]],C[0]);
    poly(p,x,y,[[-4,0],[-1,-3],[4,-2],[4,0],[1,2],[-3,2]],C[3]);
    poly(p,x,y,[[-4,2],[-2,3],[1,3],[4,1],[3,3],[-2,4]],C[2]);
    p.line(x-2,y,x+1,y-2,C[4]);
    p.px(x+2,y-2,C[4]);
  }],
  "crystal-shard": ["A single slanted cyan shard with a sharp highlight and dark cut face.",WATER,(p,x,y,C) => {
    poly(p,x,y,[[-4,1],[-2,-3],[4,-5],[4,-1],[2,2],[-2,5],[-4,4]],C[0]);
    poly(p,x,y,[[-3,1],[-1,-3],[3,-4],[1,-1],[-2,3]],C[3]);
    poly(p,x,y,[[-2,3],[1,-1],[3,-4],[3,-1],[1,2],[-2,4]],C[2]);
    p.line(x-3,y+1,x+2,y-4,C[4]);
    p.px(x-2,y+3,C[4]);
  }],
};

export const {item:processedItem,drawIcon:drawProcessedIcon} = inventoryItems("processed",items);

import { ramp } from "../../core/index.js";
import { CREAM, GOLD, LEAF, STEEL, VIOLET, WATER, round } from "./art.js";
import { inventoryItems, itemPoly as poly } from "./inventory-items.js";

const HONEY = ramp(["#4f3541","#8a5138","#c27435","#efa849","#ffe38f"]);
const BUTTER = ramp(["#615041","#9b7548","#c5a463","#ead28a","#fff1b7"]);
const MEAT = ramp(["#50303d","#7d3b4e","#af5264","#d48184","#ffc4ae"]);
const POULTRY = ramp(["#624451","#945465","#c47a85","#e4a29c","#ffdcc5"]);
const FEED = ramp(["#523d3c","#775341","#ac8153","#d4b078","#edd29a"]);
const ROE = ramp(["#623b42","#974b46","#d86d46","#f29360","#ffc889"]);

const items = {
  egg: ["A pale, lightly speckled egg.",CREAM,(p,x,y,C)=>{
    round(p,x,y,3.6,4.5,C);
    p.px(x+1,y+1,GOLD[2]);
  }],
  "golden-egg": ["A golden egg with a broad shine and a small glint.",GOLD,(p,x,y,C)=>{
    round(p,x-0.5,y,3.8,4.8,C);
    p.polyline([[x-3,y],[x-2,y-2],[x-1,y-3]],C[4]);
    p.line(x+3,y-3,x+5,y-3,C[4]);
    p.line(x+4,y-4,x+4,y-2,C[4]);
  }],
  milk: ["A white milk container with a pale violet rim.",CREAM,(p,x,y,C)=>{
    p.rect(x-3,y-1,7,5,STEEL[1]);
    p.rect(x-2,y-4,5,4,STEEL[2]);
    p.rect(x-2,y-2,4,5,C[4]);
    p.line(x-2,y-4,x+2,y-4,VIOLET[4]);
  }],
  "goat-milk": ["A tall glass bottle of goat milk with a teal label.",WATER,(p,x,y,C)=>{
    poly(p,x,y,[[-2,-5],[2,-5],[2,-3],[4,-1],[4,4],[3,5],[-3,5],[-4,4],[-4,-1],[-2,-3]],C[0]);
    poly(p,x,y,[[-1,-3],[1,-3],[3,-1],[3,3],[2,4],[-2,4],[-3,3],[-3,-1]],CREAM[3]);
    p.line(x-1,y-5,x+1,y-5,C[4]);
    p.rect(x-3,y,6,3,C[2]);
    p.line(x-1,y+1,x+1,y+1,C[4]);
  }],
  cheese: ["A golden cheese wedge with three round holes.",GOLD,(p,x,y,C)=>{
    poly(p,x,y,[[-5,0],[-1,-4],[5,-1],[5,3],[2,5],[-5,3]],C[0]);
    poly(p,x,y,[[-4,0],[-1,-3],[4,-1],[1,1]],C[4]);
    poly(p,x,y,[[-4,1],[1,2],[4,0],[4,2],[2,4],[-4,3]],C[3]);
    p.px(x-1,y-1,C[2]);
    p.px(x-2,y+2,C[1]);
    p.px(x+2,y+2,C[2]);
  }],
  butter: ["A pale butter pat on a small folded paper wrapper.",BUTTER,(p,x,y,C)=>{
    poly(p,x,y,[[-5,1],[-2,-2],[4,-2],[5,1],[3,5],[-4,4]],CREAM[0]);
    poly(p,x,y,[[-4,1],[-2,-1],[3,-1],[4,1],[2,4],[-4,3]],CREAM[2]);
    poly(p,x,y,[[-4,-1],[-2,-4],[4,-4],[5,-2],[4,1],[-4,2]],C[0]);
    poly(p,x,y,[[-3,-1],[-1,-3],[4,-3],[4,-2],[2,0],[-3,1]],C[3]);
    p.line(x-1,y-3,x+3,y-3,C[4]);
    p.line(x-3,y+1,x+3,y,C[2]);
  }],
  cream: ["A short ceramic pitcher with a handle and a pale cream surface.",WATER,(p,x,y,C)=>{
    p.ellipse(x+3,y+1,2.3,2.5,C[0]);
    p.ellipse(x+3,y+1,1.15,1.3,C[2]);
    poly(p,x,y,[[-5,-3],[2,-4],[3,-2],[3,3],[1,5],[-3,4],[-4,1],[-4,-1]],C[0]);
    poly(p,x,y,[[-4,-2],[1,-3],[2,-2],[2,2],[1,4],[-2,3],[-3,1]],C[2]);
    p.ellipse(x-1,y-2,2.7,1.5,CREAM[4]);
    p.line(x-2,y,x-2,y+2,C[4]);
  }],
  honey: ["A squat amber honey jar with a cloth lid.",HONEY,(p,x,y,C)=>{
    poly(p,x,y,[[-3,-4],[3,-4],[4,-2],[5,1],[4,4],[-4,4],[-5,1],[-4,-2]],C[0]);
    round(p,x,y+0.5,4.45,3.65,C);
    p.rect(x-3,y-4,7,2,CREAM[3]);
    p.line(x-3,y-4,x+3,y-4,CREAM[4]);
    p.line(x-3,y-2,x+2,y-2,C[1]);
    p.px(x-2,y+1,C[4]);
    p.px(x+2,y+2,C[2]);
  }],
  beeswax: ["Two honey-colored hexagonal slabs of beeswax.",BUTTER,(p,x,y,C)=>{
    for(const [dx,dy] of [[1,2],[-1,-2]]){
      poly(p,x+dx,y+dy,[[-4,-1],[-2,-3],[2,-3],[4,-1],[3,2],[-3,2]],C[0]);
      poly(p,x+dx,y+dy,[[-3,-1],[-2,-2],[2,-2],[3,-1],[2,0],[-2,0]],C[3]);
      p.line(x+dx-2,y+dy-2,x+dx+1,y+dy-2,C[4]);
      p.line(x+dx-2,y+dy+1,x+dx+2,y+dy+1,C[2]);
    }
  }],
  "raw-meat": ["A red steak with a cream fat rim and a marbled line.",MEAT,(p,x,y,C)=>{
    poly(p,x,y,[[-5,-1],[-4,-3],[-1,-4],[2,-3],[5,-1],[5,2],[2,5],[-3,4],[-5,2]],C[0]);
    poly(p,x,y,[[-4,-1],[-3,-2],[-1,-3],[2,-2],[4,-1],[4,2],[2,4],[-3,3],[-4,2]],C[3]);
    poly(p,x,y,[[-3,0],[-2,-2],[1,-2],[3,-1],[3,2],[1,3],[-2,3],[-3,2]],C[2]);
    p.polyline([[x-3,y-2],[x-1,y-3],[x+1,y-2]],C[4]);
    p.polyline([[x-2,y+1],[x,y],[x+2,y+1],[x+3,y]],C[4]);
  }],
  "raw-chicken": ["A pale pink chicken drumstick with a rounded ivory bone.",POULTRY,(p,x,y,C)=>{
    p.beam(x-3,y+3,x+1,y-1,3,CREAM[1]);
    p.line(x-3,y+3,x,y,CREAM[4]);
    p.ellipse(x-3,y+4,1.5,1.6,CREAM[2]);
    p.ellipse(x-4,y+3,1.4,1.4,CREAM[3]);
    round(p,x+1.4,y-1.4,3.65,3.75,C);
    p.line(x-1,y-2,x+1,y-4,C[4]);
    p.px(x-3,y+3,CREAM[4]);
  }],
  "raw-fish": ["A whole silver-blue fish with a fan tail and bright belly.",STEEL,(p,x,y,C)=>{
    poly(p,x,y,[[-3,-1],[-5,-4],[-5,3],[-2,2],[-1,3],[2,2],[5,0],[5,-2],[2,-4],[-1,-3]],C[0]);
    poly(p,x,y,[[-4,-2],[-2,0],[-4,2],[-4,-1]],C[2]);
    poly(p,x,y,[[-3,0],[-1,-2],[2,-3],[4,-2],[4,0],[1,2],[-1,2]],C[3]);
    p.line(x-1,y+1,x+2,y+1,C[4]);
    p.px(x+3,y-1,C[0]);
    p.px(x,y-3,WATER[3]);
  }],
  "fish-roe": ["A cluster of salmon-orange roe on a small green leaf.",ROE,(p,x,y,C)=>{
    poly(p,x,y,[[-5,2],[-2,-1],[2,-2],[5,0],[3,3],[-1,5],[-4,4]],LEAF[1]);
    p.line(x-4,y+2,x+3,y+1,LEAF[3]);
    for(const [dx,dy,rx,ry] of [[-2,1,2.55,2.35],[2,1,2.55,2.35],[0,-2,2.65,2.5]]){
      round(p,x+dx,y+dy,rx,ry,C);
      p.px(x+dx-1,y+dy-1,C[4]);
    }
  }],
  "animal-feed": ["A burlap sack filled with golden grains and marked with a green stripe.",FEED,(p,x,y,C)=>{
    poly(p,x,y,[[-4,-4],[4,-4],[3,-2],[5,1],[4,4],[2,5],[-3,5],[-5,3],[-5,0],[-3,-2]],C[0]);
    poly(p,x,y,[[-3,-3],[3,-3],[2,-1],[4,1],[3,3],[2,4],[-3,4],[-4,2],[-4,0],[-2,-1]],C[2]);
    p.ellipse(x,y-3,3.8,1.75,C[1]);
    p.ellipse(x,y-3,2.9,1.1,GOLD[3]);
    p.px(x-1,y-4,GOLD[4]);
    p.line(x-3,y+1,x+3,y+1,LEAF[1]);
    p.px(x,y+2,LEAF[4]);
  }],
};

export const {item:animalItem,drawIcon:drawAnimalItemIcon} = inventoryItems("animal",items);

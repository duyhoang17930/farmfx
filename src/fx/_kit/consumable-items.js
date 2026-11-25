import { CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, round } from "./art.js";
import { inventoryItems, itemPoly as poly } from "./inventory-items.js";

function flask(p,x,y,C,size,mark) {
  const w=3+size;
  poly(p,x,y,[[-2,-5],[2,-5],[2,-2],[w,0],[w,3],[w-1,5],[-w+1,5],[-w,3],[-w,0],[-2,-2]],STEEL[0]);
  poly(p,x,y,[[-1,-4],[1,-4],[1,-2],[w-1,0],[w-1,3],[w-2,4],[-w+2,4],[-w+1,3],[-w+1,0],[-1,-2]],STEEL[3]);
  p.rect(x-w+1,y+1,w*2-2,3,C[2]);
  p.line(x-w+1,y+1,x+w-2,y+1,C[4]);
  p.line(x-1,y-5,x+1,y-5,WOOD[4]);
  p.px(x-w+1,y,C[4]);
  if(mark==="cross") {p.line(x-1,y+2,x+1,y+2,CREAM[4]);p.line(x,y+1,x,y+3,CREAM[4]);}
  else if(mark==="bolt")p.polyline([[x,y+1],[x-1,y+2],[x+1,y+2],[x,y+3]],CREAM[4]);
  else p.px(x+1,y+3,C[4]);
}

function potion(desc,palette,size,mark) {
  return [desc,palette,(p,x,y,C)=>flask(p,x,y,C,size,mark)];
}

function scroll(p,x,y,C) {
  poly(p,x,y,[[-5,-5],[3,-5],[5,-3],[3,-1],[3,5],[-4,5],[-5,3]],CREAM[0]);
  p.rect(x-3,y-4,6,8,CREAM[3]);
  p.line(x-4,y-5,x+3,y-5,CREAM[4]);
  p.line(x-4,y+4,x+2,y+4,CREAM[4]);
  p.polyline([[x-1,y-2],[x+1,y],[x-1,y+2]],C[2]);
  p.px(x,y,C[4]);
}

const entries = {
  "small-health-potion": potion("A small crimson flask with a healing cross.",RED,0,"cross"),
  "medium-health-potion": potion("A medium crimson flask with a healing cross.",RED,1,"cross"),
  "large-health-potion": potion("A wide crimson flask with a healing cross.",RED,2,"cross"),
  "small-energy-potion": potion("A small blue flask with a lightning mark.",WATER,0,"bolt"),
  "medium-energy-potion": potion("A medium blue flask with a lightning mark.",WATER,1,"bolt"),
  "large-energy-potion": potion("A wide blue flask with a lightning mark.",WATER,2,"bolt"),
  "speed-potion": potion("A slim green elixir with a lightning mark.",LEAF,0,"bolt"),
  "strength-potion": potion("A square amber tonic with a bright sediment line.",GOLD,1),
  "defense-potion": potion("A steel-gray tonic in a wide reinforced bottle.",STEEL,2),
  "luck-potion": potion("A golden luck elixir in a small vial.",GOLD,0,"cross"),
  "invisibility-potion": potion("A pale violet solution in a slim cloudy bottle.",VIOLET,0),
  "poison-potion": potion("A wide green fantasy status potion.",LEAF,2),
  "fire-resistance-potion": potion("A warm resistance elixir with a bright lightning mark.",["#502b39","#8f473e","#c45d35","#f58a49","#ffd491"],1,"bolt"),
  antidote: potion("A mint-green healing solution in a medium flask.",LEAF,1,"cross"),
  fertilizer:["A paper sack marked with a sprouting leaf.",WOOD,(p,x,y,C)=>{
    poly(p,x,y,[[-3,-5],[3,-5],[2,-2],[5,2],[4,5],[-4,5],[-5,2],[-2,-2]],C[0]);
    p.ellipse(x,y+1,4.3,3.4,C[3]);p.line(x-2,y-4,x+2,y-4,C[4]);
    p.polyline([[x-2,y+2],[x,y],[x+2,y-1]],LEAF[2]);p.px(x,y+2,LEAF[4]);
  }],
  "growth-booster": potion("A broad moss-green growth tonic with a bright cross.",LEAF,2,"cross"),
  "teleport-scroll":["A folded scroll with a violet travel rune.",VIOLET,scroll],
  "experience-scroll":["A folded scroll with a blue experience rune.",WATER,scroll],
  "repair-kit":["A toolbox with a steel wrench and a brass hinge.",WOOD,(p,x,y,C)=>{
    p.rect(x-5,y-3,11,8,C[0]);p.rect(x-4,y-2,9,6,C[2]);p.line(x-4,y-2,x+4,y-2,C[4]);
    p.line(x-3,y+2,x+2,y-1,STEEL[3]);p.line(x+2,y-1,x+3,y,STEEL[4]);p.px(x,y+3,GOLD[4]);
  }],
  bomb:["A round fantasy game bomb with a glowing curled fuse.",STEEL,(p,x,y,C)=>{
    round(p,x-1,y+1,4.2,4.2,C);p.polyline([[x,y-2],[x,y-4],[x+3,y-5]],WOOD[3]);
    p.px(x+3,y-5,GOLD[4]);p.px(x+4,y-4,RED[3]);
  }],
};
export const {item:consumableItem,drawIcon:drawConsumableIcon}=inventoryItems("consumables",entries);

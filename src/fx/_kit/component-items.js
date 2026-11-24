import { ramp } from "../../core/index.js";
import { GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD } from "./art.js";
import { inventoryItems, itemPoly as poly } from "./inventory-items.js";

const BRASS = ramp(["#3f303a","#795542","#a88050","#d7ad68","#ffe2a0"]);
const COPPER = ramp(["#4d2c38","#854739","#b86b49","#e88e5d","#ffc291"]);
const RUBBER = ramp(["#231e30","#393447","#504d60","#787687","#a6a0aa"]);
const CIRCUIT = ramp(["#273844","#38584e","#4b8066","#78b287","#c4d6a2"]);
const GLASS = ramp(["#344456","#507385","#80acb3","#b9dbd3","#eff7e3"]);
const PLASTIC = ramp(["#3a2d51","#584465","#88577d","#bc7d96","#edb0b6"]);

function metalShaft(p,x,y,C) {
  poly(p,x,y,[[-5,3],[-3,0],[1,-4],[4,-2],[3,0],[-2,5],[-4,5]],C[0]);
  p.polyline([[x-4,y+3],[x-2,y+2],[x+2,y-2]],C[2]);
  p.line(x-3,y+2,x+1,y-2,C[4]);
}

function contacts(p,x,y,C) {
  for(const dx of [-3,0,3]){
    p.line(x+dx,y-5,x+dx,y-3,C[3]);
    p.line(x+dx,y+3,x+dx,y+5,C[3]);
  }
}

const items = {
  gear: ["A round steel cog with six teeth and a hollow hub.",STEEL,(p,x,y,C)=>{
    for(const [dx,dy,w,h] of [[-1,-5,3,2],[-1,4,3,2],[-5,-3,2,3],[4,-3,2,3],[-5,1,2,3],[4,1,2,3]]){
      p.rect(x+dx,y+dy,w,h,C[1]);
    }
    p.ring(x,y,4.9,3.4,C[0]);
    p.ring(x,y,4.1,2.2,C[2]);
    p.polyline([[x-4,y-1],[x-3,y-3],[x,y-4],[x+2,y-3]],C[4]);
    p.line(x+3,y+2,x+1,y+4,C[3]);
    p.px(x-1,y-5,C[3]);
  }],
  screw: ["A tapered silver screw with a slotted head and diagonal threads.",STEEL,(p,x,y,C)=>{
    metalShaft(p,x,y,C);
    for(const [dx,dy] of [[-3,2],[-1,0],[1,-2]])p.line(x+dx,y+dy,x+dx+2,y+dy+1,C[3]);
    p.ellipse(x+2.8,y-3.1,2.6,2.1,C[0]);
    p.ellipse(x+2.6,y-3.5,2.2,1.5,C[3]);
    p.line(x+1,y-4,x+4,y-3,C[1]);
    p.px(x+2,y-5,C[4]);
  }],
  bolt: ["A blunt steel bolt with a large hexagonal head.",STEEL,(p,x,y,C)=>{
    metalShaft(p,x,y,C);
    p.line(x-4,y+3,x-2,y+4,C[3]);
    p.line(x-3,y+2,x-1,y+3,C[1]);
    poly(p,x,y,[[0,-4],[2,-5],[5,-4],[5,-1],[3,1],[0,-1]],C[0]);
    poly(p,x,y,[[1,-4],[2,-4],[4,-3],[4,-2],[2,-1],[1,-2]],C[3]);
    p.line(x+2,y-4,x+4,y-4,C[4]);
    p.line(x+2,y,x+4,y-1,C[2]);
  }],
  nail: ["A slim pointed nail with a flat, wide head.",STEEL,(p,x,y,C)=>{
    p.line(x-4,y+5,x+3,y-4,C[0]);
    p.line(x-4,y+4,x+2,y-4,C[3]);
    p.line(x,y-5,x+5,y-3,C[1]);
    p.line(x+1,y-5,x+4,y-4,C[4]);
    p.px(x-4,y+4,C[4]);
  }],
  spring: ["A vertical compression spring with overlapping steel coils.",STEEL,(p,x,y,C)=>{
    for(const dy of [3,0,-3]){
      p.ellipse(x,y+dy,4.1,1.65,C[0]);
      p.line(x+2,y+dy+2,x+3,y+dy,C[2]);
      p.line(x-3,y+dy-1,x+3,y+dy,C[3]);
      p.px(x-3,y+dy-1,C[4]);
    }
    p.line(x-1,y-5,x+2,y-5,C[3]);
  }],
  wire: ["A loop of blue insulated cable with two exposed metal ends.",WATER,(p,x,y,C)=>{
    p.arc(x-1,y-1,4.5,2.3,0.2,6.0,C[0]);
    p.arc(x-1,y-1,4,1.4,0.26,5.8,C[3]);
    p.polyline([[x+2,y-3],[x+4,y-2],[x+4,y+1]],C[2]);
    p.line(x+4,y+1,x+5,y+2,STEEL[4]);
    p.polyline([[x-2,y+2],[x,y+4],[x+3,y+4]],C[3]);
    p.px(x+4,y+4,STEEL[4]);
  }],
  "copper-wire": ["A spool wrapped in copper wire with a loose tail.",COPPER,(p,x,y,C)=>{
    p.ellipse(x,y+4,4.2,1.6,WOOD[1]);
    p.rect(x-3,y-4,7,8,C[0]);
    for(const dy of [-3,-1,1,3]){
      p.line(x-3,y+dy,x+3,y+dy+1,C[2]);
      p.px(x-2,y+dy,C[4]);
    }
    p.ellipse(x,y-3.8,4.2,1.45,WOOD[2]);
    p.line(x-2,y-5,x+2,y-5,WOOD[4]);
    p.px(x,y-4,WOOD[1]);
    p.polyline([[x+3,y+1],[x+5,y+2],[x+4,y+4]],C[3]);
    p.px(x+4,y+4,C[4]);
  }],
  "metal-plate": ["A blue-gray sheet-metal plate with four corner rivets.",STEEL,(p,x,y,C)=>{
    poly(p,x,y,[[-5,0],[-2,-4],[4,-5],[5,-3],[5,0],[2,4],[-4,5],[-5,3]],C[0]);
    poly(p,x,y,[[-4,0],[-2,-3],[4,-4],[4,-2],[2,2],[-4,3]],C[2]);
    p.polyline([[x-4,y+1],[x-2,y-3],[x+3,y-4]],C[4]);
    p.line(x-3,y+3,x+2,y+3,C[3]);
    for(const [dx,dy] of [[-3,0],[-1,-2],[1,1],[3,-2]])p.px(x+dx,y+dy,C[0]);
  }],
  "metal-pipe": ["A steel elbow pipe with raised collars and an open end.",STEEL,(p,x,y,C)=>{
    p.beam(x-3,y+3,x-3,y-1,4,C[0]);
    p.beam(x-3,y-1,x+3,y-3,5,C[0]);
    p.line(x-4,y+3,x-4,y-1,C[2]);
    p.line(x-3,y-2,x+3,y-4,C[3]);
    p.line(x-3,y-1,x+3,y-3,C[4]);
    p.ellipse(x-3,y+3,2.4,1.8,C[3]);
    p.ellipse(x-3,y+3,1.3,0.8,C[0]);
    p.ellipse(x+3,y-3,2.3,2.2,C[2]);
    p.ellipse(x+3,y-3,1.25,1.1,C[0]);
    p.px(x+2,y-4,C[4]);
  }],
  "circuit-board": ["A green circuit board with gold contacts, traces and a dark center chip.",CIRCUIT,(p,x,y,C)=>{
    p.rect(x-5,y-4,11,8,C[0]);
    p.rect(x-4,y-3,9,6,C[2]);
    p.line(x-4,y-3,x+4,y-3,C[4]);
    p.polyline([[x-3,y+2],[x-3,y],[x+1,y],[x+1,y-2]],C[3]);
    p.rect(x-1,y-2,4,4,STEEL[0]);
    p.line(x-1,y-2,x+1,y-2,STEEL[3]);
    for(const dx of [-3,-1,1,3])p.px(x+dx,y+3,GOLD[4]);
    p.px(x+4,y-1,GOLD[3]);
  }],
  microchip: ["A square charcoal chip with gold pins and a notched corner.",RUBBER,(p,x,y,C)=>{
    contacts(p,x,y,GOLD);
    for(const dy of [-2,1,3]){
      p.line(x-5,y+dy,x-3,y+dy,GOLD[2]);
      p.line(x+3,y+dy,x+5,y+dy,GOLD[2]);
    }
    p.rect(x-4,y-4,9,9,C[0]);
    p.rect(x-3,y-3,7,7,C[2]);
    p.line(x-1,y-3,x+3,y-3,C[3]);
    p.px(x-2,y-2,C[4]);
    p.line(x-1,y+2,x+2,y+2,C[1]);
  }],
  battery: ["A green cylindrical battery with a bright terminal and charge band.",LEAF,(p,x,y,C)=>{
    p.rect(x-3,y-4,7,9,C[0]);
    p.rect(x-2,y-3,5,7,C[2]);
    p.ellipse(x,y-4,3.4,1.4,C[3]);
    p.rect(x-1,y-5,3,2,STEEL[4]);
    p.line(x-2,y+2,x+2,y+2,STEEL[4]);
    p.px(x-2,y-2,C[4]);
    p.px(x+1,y,STEEL[1]);
  }],
  motor: ["A compact blue electric motor with cooling fins and a shaft.",WATER,(p,x,y,C)=>{
    poly(p,x,y,[[-5,-2],[-3,-4],[2,-4],[4,-1],[4,2],[2,4],[-3,4],[-5,2]],C[0]);
    p.rect(x-4,y-2,8,5,C[2]);
    for(const dx of [-3,-1,1])p.line(x+dx,y-2,x+dx,y+2,C[3]);
    p.ellipse(x+2,y,2.8,3.2,C[1]);
    p.ellipse(x+2,y,1.8,2.1,C[3]);
    p.line(x+2,y,x+5,y,STEEL[4]);
    p.rect(x-3,y+3,5,2,STEEL[1]);
  }],
  engine: ["A blocky red engine with a silver intake and copper exhaust.",RED,(p,x,y,C)=>{
    p.polyline([[x+2,y],[x+5,y-1],[x+5,y-4]],COPPER[2]);
    p.px(x+5,y-4,COPPER[4]);
    poly(p,x,y,[[-5,-1],[-3,-4],[2,-4],[4,-2],[4,2],[2,5],[-5,4]],C[0]);
    p.rect(x-4,y-1,7,4,C[2]);
    p.line(x-4,y-1,x+3,y-1,C[4]);
    p.rect(x-2,y-5,4,3,STEEL[2]);
    p.line(x-2,y-5,x+1,y-5,STEEL[4]);
    p.line(x-3,y+1,x+2,y+1,C[1]);
    p.px(x+2,y+3,STEEL[4]);
  }],
  "electronic-part": ["A violet capacitor with a polarity stripe and two bent leads.",VIOLET,(p,x,y,C)=>{
    p.line(x-2,y+2,x-3,y+5,STEEL[3]);
    p.line(x+1,y+3,x+2,y+5,STEEL[4]);
    p.rect(x-4,y-3,9,6,C[0]);
    p.rect(x-3,y-2,7,4,C[2]);
    p.ellipse(x,y-3,4.4,1.9,C[1]);
    p.ellipse(x-0.4,y-3.4,3.3,1.2,C[3]);
    p.line(x+2,y-2,x+2,y+2,C[4]);
    p.px(x-1,y-4,STEEL[4]);
  }],
  "mechanical-part": ["A brass bracket with a round bearing and slotted mount.",BRASS,(p,x,y,C)=>{
    poly(p,x,y,[[-5,-2],[-2,-4],[2,-3],[3,0],[5,0],[5,4],[-3,4],[-5,2]],C[0]);
    poly(p,x,y,[[-4,-2],[-2,-3],[1,-2],[2,1],[4,1],[4,3],[-3,3],[-4,2]],C[2]);
    p.ring(x-2,y-1,2.3,1.3,C[4]);
    p.px(x-2,y-1,C[0]);
    p.line(x+1,y+2,x+3,y+2,C[0]);
    p.px(x-3,y+2,C[3]);
  }],
  "glass-tube": ["A clear laboratory tube with blue rims and a long reflection.",GLASS,(p,x,y,C)=>{
    poly(p,x,y,[[-4,1],[1,-5],[4,-5],[5,-3],[-1,5],[-4,5]],C[0]);
    poly(p,x,y,[[-3,1],[1,-4],[4,-4],[4,-3],[-1,4],[-3,4]],C[1]);
    p.line(x-3,y+1,x+1,y-4,C[4]);
    p.line(x-1,y+2,x+3,y-3,C[3]);
    p.line(x-3,y+3,x-1,y+4,C[2]);
    p.px(x+2,y-4,C[0]);
  }],
  plastic: ["Two folded pink plastic sheets with molded ridges.",PLASTIC,(p,x,y,C)=>{
    poly(p,x,y,[[-5,1],[-2,-4],[3,-5],[5,-2],[5,2],[2,4],[-4,5]],C[0]);
    poly(p,x,y,[[-4,1],[-2,-3],[2,-4],[4,-2],[3,1],[-3,3]],C[3]);
    p.line(x-3,y+3,x+3,y+2,C[2]);
    p.line(x-2,y-2,x+2,y-3,C[4]);
    p.line(x+1,y-1,x+1,y+1,C[2]);
  }],
  rubber: ["A flattened black rubber belt with a visible inner opening.",RUBBER,(p,x,y,C)=>{
    p.arc(x,y,5.4,2.9,-0.3,6.0,C[0]);
    p.arc(x,y,4.5,1.8,-0.3,6.0,C[2]);
    p.line(x-4,y-1,x-2,y-3,C[3]);
    p.line(x+2,y+2,x+4,y,C[1]);
    p.px(x-2,y-3,C[4]);
  }],
  "fuel-cell": ["A rectangular blue fuel cell with a cyan charge window and brass contacts.",WATER,(p,x,y,C)=>{
    p.rect(x-2,y-5,5,2,GOLD[2]);
    p.line(x-2,y-5,x+2,y-5,GOLD[4]);
    p.rect(x-4,y-4,9,9,C[0]);
    p.rect(x-3,y-3,7,7,C[2]);
    p.rect(x-2,y-2,5,5,C[0]);
    p.rect(x-1,y-1,3,3,C[4]);
    p.px(x,y+2,C[3]);
    p.line(x-3,y+3,x+3,y+3,GOLD[3]);
  }],
};

export const {item:componentItem,drawIcon:drawComponentIcon} = inventoryItems("components",items);

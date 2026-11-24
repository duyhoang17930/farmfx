import { ramp } from "../../core/index.js";
import { CREAM, LEAF, VIOLET, WATER } from "./art.js";
import { inventoryItems, itemPoly as poly } from "./inventory-items.js";

const RUBY = ramp(["#4a253d","#7b304b","#bc425e","#e86878","#ffb9a4"]);
const EMERALD = ramp(["#1f423e","#2d6353","#438861","#71c28b","#b9f0bd"]);
const SAPPHIRE = ramp(["#2a365a","#3b4e85","#536eb3","#799be3","#bedbf9"]);
const AMETHYST = ramp(["#392848","#603e79","#9057a9","#bb7cce","#f1bcf0"]);
const DIAMOND = ramp(["#39475c","#647e9c","#9cc0d0","#c7e5ec","#f9fff9"]);
const TOPAZ = ramp(["#503545","#8d554d","#ba7a48","#ecae5e","#ffe8a1"]);
const QUARTZ = ramp(["#4b4057","#7d6d8a","#ad95a9","#dbc3c9","#fff3df"]);
const OPAL = ramp(["#443d5c","#77708d","#b7aabc","#dccddd","#faf4e2"]);
const JADE = ramp(["#2d443e","#41645a","#658671","#9ab394","#d4dfb0"]);
const AMBER = ramp(["#4c303d","#844637","#b86b38","#d98a45","#ffc778"]);

const items = {
  ruby: ["A cushion-cut red gem with a broad pink highlight.",RUBY,(p,x,y,C)=>{
    poly(p,x,y,[[-5,-2],[-3,-4],[3,-4],[5,-2],[5,2],[3,5],[-3,5],[-5,2]],C[0]);
    poly(p,x,y,[[-4,-2],[-2,-3],[2,-3],[4,-2],[4,2],[2,4],[-2,4],[-4,2]],C[2]);
    poly(p,x,y,[[-4,-2],[-2,-3],[2,-3],[3,-1],[1,1],[-2,1]],C[3]);
    p.polyline([[x-3,y-2],[x-1,y-3],[x+1,y-3]],C[4]);
    p.polyline([[x-4,y+2],[x-2,y+1],[x+1,y+1],[x+3,y+3]],C[1]);
    p.px(x+4,y+1,C[3]);
  }],
  emerald: ["A tall step-cut emerald with clipped corners and mint facets.",EMERALD,(p,x,y,C)=>{
    poly(p,x,y,[[-4,-3],[-2,-5],[2,-5],[4,-3],[4,3],[2,5],[-2,5],[-4,3]],C[0]);
    poly(p,x,y,[[-3,-3],[-2,-4],[2,-4],[3,-3],[3,3],[2,4],[-2,4],[-3,3]],C[2]);
    poly(p,x,y,[[-3,-3],[-2,-4],[2,-4],[1,-2],[-1,-2],[-2,2],[-3,3]],C[3]);
    p.rect(x-2,y-2,4,5,C[1]);
    p.rect(x-1,y-2,2,4,C[3]);
    p.line(x-2,y-3,x+1,y-3,C[4]);
    p.line(x+2,y-1,x+2,y+2,C[2]);
  }],
  sapphire: ["An oval cobalt gem with an asymmetric star of blue facets.",SAPPHIRE,(p,x,y,C)=>{
    poly(p,x,y,[[-5,-1],[-4,-3],[-2,-4],[2,-4],[4,-3],[5,-1],[5,1],[3,4],[-3,4],[-5,1]],C[0]);
    p.ellipse(x,y,4.3,3.3,C[2]);
    poly(p,x,y,[[-4,-1],[-2,-3],[1,-3],[0,-1],[-2,1]],C[3]);
    poly(p,x,y,[[0,-1],[3,-2],[4,0],[2,3],[0,2]],C[1]);
    p.polyline([[x-3,y-1],[x-1,y-2],[x+1,y-2]],C[4]);
    p.line(x-1,y+1,x+2,y+2,C[3]);
  }],
  amethyst: ["A violet triangular cut with a lilac crown and deep plum edges.",AMETHYST,(p,x,y,C)=>{
    poly(p,x,y,[[0,-5],[2,-4],[5,1],[5,3],[2,5],[-3,5],[-5,3],[-4,0]],C[0]);
    poly(p,x,y,[[0,-4],[2,-2],[4,2],[2,4],[-2,4],[-4,2],[-2,-1]],C[2]);
    poly(p,x,y,[[0,-4],[0,-1],[-2,2],[-4,2],[-2,-1]],C[3]);
    poly(p,x,y,[[0,-1],[4,2],[2,4],[-2,4],[-1,2]],C[1]);
    p.line(x-2,y,x,y-3,C[4]);
    p.line(x-2,y+2,x+1,y+2,C[3]);
  }],
  diamond: ["A wide brilliant-cut diamond with an icy crown and pointed base.",DIAMOND,(p,x,y,C)=>{
    poly(p,x,y,[[-5,-2],[-3,-4],[3,-4],[5,-2],[4,0],[0,5],[-4,0]],C[0]);
    poly(p,x,y,[[-4,-2],[-2,-3],[2,-3],[4,-2],[3,0],[0,4],[-3,0]],C[3]);
    poly(p,x,y,[[-4,-1],[-2,-1],[0,4],[-3,0]],C[1]);
    poly(p,x,y,[[4,-1],[2,-1],[0,4],[3,0]],C[2]);
    p.line(x-3,y-2,x+3,y-2,C[4]);
    p.line(x-1,y-3,x-2,y-1,C[4]);
    p.line(x+1,y-1,x,y+2,C[4]);
  }],
  topaz: ["An amber-yellow pear cut with a pointed tip and a pale center.",TOPAZ,(p,x,y,C)=>{
    poly(p,x,y,[[0,-5],[2,-3],[4,0],[5,2],[3,5],[-3,5],[-5,2],[-4,0],[-2,-3]],C[0]);
    poly(p,x,y,[[0,-4],[2,-2],[4,1],[4,2],[2,4],[-2,4],[-4,2],[-3,0]],C[2]);
    poly(p,x,y,[[0,-4],[1,-1],[3,1],[1,2],[-2,2],[-2,-1]],C[3]);
    p.line(x-3,y+1,x-1,y-2,C[4]);
    p.line(x-2,y+2,x+1,y+2,C[4]);
    p.line(x,y+3,x+3,y+2,C[1]);
  }],
  quartz: ["A rose-tinged hexagonal quartz prism with an unpolished base.",QUARTZ,(p,x,y,C)=>{
    poly(p,x,y,[[1,-5],[4,-3],[4,-1],[-1,5],[-4,4],[-5,1],[-3,-2]],C[0]);
    poly(p,x,y,[[1,-4],[3,-3],[0,1],[-3,3],[-4,1],[-2,-2]],C[3]);
    poly(p,x,y,[[3,-3],[3,-1],[-1,4],[-3,3],[0,1]],C[2]);
    p.line(x-3,y+1,x+1,y-3,C[4]);
    p.px(x-3,y+3,C[1]);
    p.px(x-1,y+3,C[4]);
  }],
  opal: ["A milky oval opal with teal and purple flashes.",OPAL,(p,x,y,C)=>{
    p.ellipse(x,y,5.2,4.2,C[0]);
    p.ellipse(x,y,4.4,3.5,C[2]);
    p.ellipse(x-0.9,y-0.6,3.2,2.7,C[3]);
    p.line(x-3,y-1,x-1,y-2,C[4]);
    p.line(x-2,y+1,x-1,y+1,WATER[3]);
    p.px(x,y,WATER[4]);
    p.line(x+1,y+1,x+2,y+1,VIOLET[3]);
    p.px(x+2,y-1,CREAM[4]);
    p.px(x+3,y,LEAF[3]);
  }],
  jade: ["A softly polished sage-green jade bead with a drilled center.",JADE,(p,x,y,C)=>{
    p.ring(x,y,5.25,3.9,C[0]);
    p.ring(x,y,4.5,2.8,C[2]);
    p.arc(x,y,4.4,1.5,2.6,4.9,C[3]);
    p.line(x-3,y-2,x-1,y-3,C[4]);
    p.arc(x,y,3.3,0.95,0.2,2.5,C[1]);
    p.px(x-3,y+1,C[1]);
    p.px(x+3,y+1,C[3]);
  }],
  amber: ["An irregular honey-brown amber nugget with a dark inclusion.",AMBER,(p,x,y,C)=>{
    poly(p,x,y,[[-5,0],[-3,-3],[0,-4],[3,-3],[5,0],[4,3],[2,5],[-2,4],[-4,3]],C[0]);
    poly(p,x,y,[[-4,0],[-2,-2],[0,-3],[3,-2],[4,0],[3,3],[1,4],[-3,2]],C[2]);
    poly(p,x,y,[[-4,0],[-2,-2],[0,-3],[2,-1],[1,1],[-3,2]],C[3]);
    p.line(x-3,y,x-1,y-2,C[4]);
    p.px(x+1,y+1,C[0]);
    p.px(x+2,y+1,C[1]);
    p.px(x+1,y+2,C[1]);
  }],
};

export const {item:gemItem,drawIcon:drawGemIcon} = inventoryItems("gems",items);

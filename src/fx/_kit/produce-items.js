import { ramp } from "../../core/index.js";
import { CREAM, GOLD, LEAF, RED, VIOLET, WOOD, round } from "./art.js";
import { inventoryItems, itemPoly as poly } from "./inventory-items.js";

const CITRUS = ramp(["#68403a","#a6543c","#d47b36","#f5a344","#ffdf88"]);
const HUSK = ramp(["#403b35","#627043","#89944d","#aab465","#d3cf84"]);
const GOURD = ramp(["#253e37","#37634a","#529653","#81bf72","#cde895"]);
const BEAN = ramp(["#4b4937","#727148","#9a9c5e","#c2c77e","#e6dfa1"]);
const ROOT = ramp(["#503841","#785149","#a5785a","#c59876","#ecd0a2"]);
const PLUM = ramp(["#4b2c49","#763d5a","#a95673","#cc788d","#edafab"]);
const PEEL = ramp(["#604437","#855b41","#ab7e51","#d1a46b","#eac991"]);
const WINE = ramp(["#392e4c","#553c65","#78548d","#a36fb0","#e0a6d6"]);

function tuber(p,x,y,C) {
  poly(p,x,y,[[-5,1],[-4,-1],[-1,-4],[2,-4],[5,-2],[4,1],[2,4],[-1,5],[-4,4]],C[0]);
  poly(p,x,y,[[-4,1],[-3,-1],[-1,-3],[2,-3],[4,-2],[3,1],[1,3],[-1,4],[-3,3]],C[2]);
  p.polyline([[x-3,y],[x-1,y-2],[x+1,y-3]],C[3]);
}

const items = {
  apple: ["A red apple with a bent stem and a green leaf.",RED,(p,x,y,C)=>{
    round(p,x-.6,y,4.4,3.9,C);
    p.line(x,y-2,x+1,y-5,WOOD[1]);
    p.line(x+1,y-4,x+3,y-5,LEAF[3]);
  }],
  banana: ["A curved yellow banana with a dark stem tip.",GOLD,(p,x,y,C)=>{
    poly(p,x,y,[[-5,1],[-3,2],[0,1],[2,-1],[3,-4],[5,-4],[5,0],[3,3],[-1,5],[-4,4]],C[0]);
    poly(p,x,y,[[-4,2],[-2,3],[1,1],[3,-1],[4,-3],[4,0],[2,3],[-1,4],[-4,3]],C[3]);
    p.polyline([[x-3,y+2],[x,y+2],[x+2,y],[x+3,y-2]],C[4]);
    p.px(x+4,y-4,LEAF[2]);
  }],
  barley: ["A warm tan barley head with long, fine awns.",PEEL,(p,x,y,C)=>{
    p.line(x-3,y+5,x+2,y-5,C[2]);
    for(const [dx,dy] of [[-1,1],[0,-1],[1,-3]]){
      p.line(x+dx-2,y+dy-1,x+dx,y+dy,C[3]);
      p.line(x+dx,y+dy,x+dx+2,y+dy-1,C[4]);
      p.px(x+dx+2,y+dy-2,C[3]);
    }
    p.line(x-2,y+2,x-3,y-3,C[3]);
    p.px(x+2,y-5,C[4]);
  }],
  cabbage: ["A pale cabbage head wrapped in layered green leaves.",GOURD,(p,x,y,C)=>{
    round(p,x,y,5.15,4.8,C);
    p.polyline([[x-4,y-1],[x-2,y],[x,y+4],[x+2,y],[x+4,y-2]],C[1]);
    p.polyline([[x-3,y-2],[x-1,y-3],[x+2,y-2],[x+1,y]],C[4]);
    p.line(x-3,y+1,x-1,y+3,C[3]);
  }],
  carrot: ["An orange carrot with its tapered tip and leafy green top.",RED,(p,x,y,C)=>{
    poly(p,x,y,[[-3,-2],[2,-3],[4,-1],[-3,5],[-4,4]],GOLD[1]);
    poly(p,x,y,[[-2,-2],[2,-2],[3,0],[-3,4]],C[3]);
    p.line(x-1,y-1,x-2,y+2,GOLD[4]);
    p.line(x+1,y-2,x+1,y-5,LEAF[3]);
    p.line(x+1,y-2,x+4,y-5,LEAF[2]);
  }],
  cassava: ["Two long tan cassava roots, one with an exposed ivory end.",ROOT,(p,x,y,C)=>{
    p.beam(x-3,y+3,x+1,y-3,3.8,C[1]);
    p.beam(x-3,y+2,x+1,y-4,2.4,C[3]);
    p.beam(x-1,y+3,x+3,y-1,4.2,C[0]);
    p.beam(x-1,y+3,x+3,y-1,2.7,C[2]);
    p.line(x-2,y+2,x+2,y-2,C[3]);
    p.ellipse(x-1,y+3,1.9,1.7,CREAM[3]);
    p.px(x-2,y+3,CREAM[4]);
  }],
  coconut: ["A split brown coconut with a bright white rim and dark shell.",WOOD,(p,x,y,C)=>{
    round(p,x,y+1,5.1,4.2,C);
    p.ellipse(x,y-1,4.7,2.9,C[0]);
    p.ellipse(x,y-1,3.9,2.2,CREAM[4]);
    p.ellipse(x,y-1,2.7,1.2,CREAM[2]);
    p.px(x-2,y,C[4]);
    p.line(x-3,y+3,x-1,y+4,C[2]);
  }],
  corn: ["A bright maize cob with two folded green husks.",GOLD,(p,x,y,C)=>{
    poly(p,x,y,[[-3,2],[-2,-2],[1,-5],[4,-4],[5,-2],[2,2],[-1,5]],C[0]);
    poly(p,x,y,[[-2,1],[-1,-2],[1,-4],[3,-4],[4,-2],[1,2],[-1,4]],C[3]);
    p.line(x,y-2,x+1,y-3,C[4]);
    p.line(x-1,y,x+1,y-1,C[2]);
    p.line(x+1,y-1,x+3,y-2,C[4]);
    poly(p,x,y,[[-4,0],[-1,1],[2,0],[0,5],[-3,4]],LEAF[1]);
    p.line(x-3,y+1,x-1,y+4,LEAF[3]);
    p.line(x,y+4,x+2,y+1,LEAF[2]);
  }],
  cotton: ["A pair of picked cotton bolls on a forked brown stem.",CREAM,(p,x,y,C)=>{
    p.polyline([[x-2,y+4],[x,y+1],[x+2,y-2]],WOOD[2]);
    p.line(x,y+2,x-2,y-1,WOOD[3]);
    round(p,x-2,y-1,2.7,2.7,C);
    round(p,x+2,y-3,2.4,2.3,C);
    p.line(x-2,y+1,x-1,y+2,LEAF[2]);
    p.px(x+1,y-1,LEAF[3]);
  }],
  cucumber: ["A long blue-green cucumber with light ridges.",GOURD,(p,x,y,C)=>{
    p.beam(x-3,y+3,x+3,y-3,4.4,C[0]);
    p.beam(x-3,y+3,x+3,y-3,3.2,C[2]);
    p.line(x-3,y+1,x+2,y-4,C[3]);
    p.line(x-1,y+3,x+3,y-1,C[1]);
    p.px(x+4,y-4,C[4]);
  }],
  gherkin: ["A short knobby lime-green gherkin with a pale blossom end.",HUSK,(p,x,y,C)=>{
    poly(p,x,y,[[-4,1],[-4,-2],[-2,-4],[1,-3],[3,-2],[4,0],[3,3],[1,4],[-2,4]],LEAF[0]);
    poly(p,x,y,[[-3,1],[-3,-2],[-1,-3],[2,-2],[3,0],[2,2],[1,3],[-2,3]],C[2]);
    for(const [dx,dy] of [[-2,-1],[0,-2],[2,-1],[-1,1],[1,2]])p.px(x+dx,y+dy,C[4]);
    p.px(x+3,y+2,C[1]);
  }],
  grape: ["A hanging bunch of purple grapes with a short twig and leaf.",WINE,(p,x,y,C)=>{
    for(const [dx,dy,s] of [[0,3,1.9],[-2,0,2.1],[2,0,2.2],[-3,-2,2],[1,-2,2.2],[0,1,2.4]]) {
      round(p,x+dx,y+dy,s,s,C);
    }
    p.line(x,y-3,x+1,y-5,WOOD[3]);
    p.line(x+1,y-4,x+4,y-5,LEAF[3]);
  }],
  "palm-fruit": ["A compact bunch of orange-red oil palm fruits.",CITRUS,(p,x,y,C)=>{
    p.line(x-1,y-2,x-2,y-5,WOOD[3]);
    for(const [dx,dy] of [[-3,-1],[1,-2],[-2,2],[3,0],[1,3],[0,1]]){
      p.ellipse(x+dx,y+dy,2.1,2.25,C[1]);
      p.ellipse(x+dx-0.3,y+dy-0.4,1.35,1.45,C[2]);
      p.px(x+dx-1,y+dy-1,RED[4]);
    }
    p.px(x+3,y-2,C[4]);
  }],
  onion: ["A golden onion bulb with layered skin and dry roots.",PEEL,(p,x,y,C)=>{
    round(p,x,y+1,4.5,3.95,C);
    p.polyline([[x-2,y-2],[x,y-4],[x+1,y-5]],C[2]);
    p.polyline([[x-2,y-1],[x-3,y+1],[x-2,y+3]],C[4]);
    p.polyline([[x+1,y-1],[x+2,y+1],[x+1,y+4]],C[1]);
    p.line(x-1,y+4,x+1,y+5,C[1]);
  }],
  shallot: ["A pair of slender pink shallot bulbs with dry stem tips.",PLUM,(p,x,y,C)=>{
    round(p,x+2,y+1,2.5,3.75,C);
    round(p,x-2,y+1,2.55,3.6,C);
    p.line(x-2,y-2,x-3,y-5,C[1]);
    p.line(x+2,y-2,x+3,y-4,C[2]);
    p.line(x-3,y,x-3,y+2,C[4]);
    p.px(x+1,y,C[4]);
  }],
  orange: ["A bright orange fruit with peel dots and a dark green leaf.",CITRUS,(p,x,y,C)=>{
    round(p,x,y+1,4.8,4.5,C);
    p.line(x,y-2,x+1,y-4,WOOD[2]);
    p.line(x+1,y-3,x+4,y-5,LEAF[3]);
    p.px(x-2,y-1,C[4]);
    p.px(x+2,y+1,C[2]);
    p.px(x+3,y+2,C[1]);
  }],
  potato: ["Two rounded beige potatoes with small eyes.",PEEL,(p,x,y,C)=>{
    round(p,x+2,y-1,3.15,3.25,C);
    round(p,x-1.5,y+1,3.5,3.3,C);
    p.px(x-3,y+1,C[1]);
    p.px(x,y+2,C[2]);
    p.px(x+3,y-1,C[1]);
  }],
  rapeseed: ["A split seed pod spilling dark seeds, with a yellow flower.",HUSK,(p,x,y,C)=>{
    p.beam(x-4,y+2,x+2,y-1,2.8,C[0]);
    p.line(x-4,y+1,x+2,y-2,C[3]);
    p.line(x-1,y+1,x+3,y-4,LEAF[2]);
    p.px(x+3,y-5,GOLD[4]);
    p.px(x+4,y-4,GOLD[3]);
    p.px(x+2,y-4,GOLD[3]);
    for(const [dx,dy] of [[-2,3],[0,2],[1,4],[3,2],[4,4]])p.px(x+dx,y+dy,VIOLET[2]);
    p.px(x+3,y+2,VIOLET[3]);
  }],
  rice: ["A bowed rice panicle with pale grains on a green stem.",CREAM,(p,x,y,C)=>{
    p.polyline([[x-3,y+5],[x-1,y],[x+1,y-4],[x+3,y-3],[x+4,y-1]],LEAF[2]);
    p.line(x-2,y+3,x-4,y-1,LEAF[3]);
    for(const [dx,dy] of [[0,-3],[2,-3],[3,-1],[4,1],[1,0]]) {
      p.line(x+dx,y+dy,x+dx,y+dy+1,C[4]);
      p.px(x+dx-1,y+dy+1,C[2]);
    }
  }],
  sorghum: ["A reddish-brown seed head on a short stalk.",PLUM,(p,x,y,C)=>{
    p.line(x-3,y+5,x+1,y-2,HUSK[3]);
    for(const [dx,dy] of [[-1,-1],[0,-3],[2,-3],[3,-1],[1,0]]){
      round(p,x+dx,y+dy,1.65,1.8,C);
    }
    p.px(x+1,y-4,C[4]);
    p.line(x-3,y+3,x-4,y+1,LEAF[3]);
  }],
  soybean: ["A curved green soybean pod with three round beans.",BEAN,(p,x,y,C)=>{
    poly(p,x,y,[[-5,2],[-4,0],[-2,-2],[1,-4],[4,-4],[5,-2],[4,0],[1,2],[-2,4],[-4,4]],C[0]);
    poly(p,x,y,[[-4,2],[-3,0],[-1,-2],[2,-3],[4,-3],[4,-1],[1,1],[-2,3]],C[2]);
    for(const [dx,dy] of [[-2,1],[0,-1],[2,-2]])p.ellipse(x+dx,y+dy,1.45,1.2,C[4]);
  }],
  "sugar-beet": ["A creamy sugar beet with a pointed root and green sprig.",CREAM,(p,x,y,C)=>{
    poly(p,x,y,[[-4,-1],[-2,-3],[2,-3],[4,-1],[3,2],[0,5],[-1,4],[-3,2]],C[1]);
    poly(p,x,y,[[-3,-1],[-2,-2],[2,-2],[3,-1],[2,1],[0,4],[-2,2]],C[3]);
    p.line(x-2,y-1,x-1,y+1,C[4]);
    p.line(x,y-1,x+1,y-4,LEAF[1]);
    p.line(x,y-2,x-3,y-4,LEAF[3]);
    p.line(x+1,y-3,x+3,y-5,LEAF[3]);
    p.px(x+2,y-4,LEAF[4]);
  }],
  sugarcane: ["Two cut cane stalks with pale joints and green rinds.",HUSK,(p,x,y,C)=>{
    for(const [dx,dy] of [[-1,-1],[1,1]]){
      p.beam(x+dx-3,y+dy+2,x+dx+2,y+dy-3,3.1,C[0]);
      p.line(x+dx-3,y+dy+2,x+dx+2,y+dy-3,C[3]);
      p.line(x+dx-1,y+dy,x+dx,y+dy+1,C[1]);
      p.px(x+dx+2,y+dy-3,C[4]);
    }
  }],
  "sweet-potato": ["A curved reddish sweet potato with a bright copper end.",PLUM,(p,x,y,C)=>{
    tuber(p,x,y,C);
    p.line(x+1,y-3,x+3,y-2,CITRUS[3]);
    p.px(x+2,y-2,CITRUS[4]);
    p.px(x-2,y+3,C[4]);
  }],
  tomato: ["A round scarlet tomato with a spread green calyx.",RED,(p,x,y,C)=>{
    round(p,x,y+1,5.1,4.4,C);
    p.polyline([[x-3,y-2],[x,y-2],[x+2,y-4]],LEAF[3]);
    p.line(x+1,y-2,x+4,y-2,LEAF[2]);
    p.line(x,y-2,x-1,y,LEAF[3]);
    p.px(x-2,y+1,C[4]);
  }],
  watermelon: ["A red watermelon wedge with dark seeds and a green rind.",RED,(p,x,y,C)=>{
    poly(p,x,y,[[-5,-2],[0,-4],[5,-2],[4,2],[2,4],[-2,4],[-4,2]],LEAF[0]);
    poly(p,x,y,[[-4,-2],[0,-3],[4,-2],[3,1],[2,2],[-2,2],[-3,1]],C[3]);
    p.polyline([[x-4,y],[x-2,y+3],[x+2,y+3],[x+4,y]],LEAF[3]);
    p.px(x-2,y-1,C[1]);
    p.px(x+1,y-2,C[0]);
    p.px(x+2,y,C[0]);
    p.px(x,y+1,C[1]);
  }],
  wheat: ["A golden wheat ear with paired grains and a bent stalk.",GOLD,(p,x,y,C)=>{
    p.line(x-2,y+4,x+1,y-5,C[2]);
    for(const dy of [-3,-1,1]){
      p.line(x-2,y+dy-1,x,y+dy,C[3]);
      p.line(x,y+dy,x+3,y+dy-1,C[4]);
    }
  }],
  yam: ["A rough, dark-skinned yam with a tapered root tip.",ROOT,(p,x,y,C)=>{
    tuber(p,x,y,C);
    p.line(x-3,y+1,x,y-2,C[1]);
    p.line(x-1,y+3,x+1,y+1,C[1]);
    p.line(x+2,y-2,x+4,y-4,C[2]);
    p.px(x-4,y+4,C[3]);
  }],
  cherry: ["Two shiny red cherries connected by a forked stem.",RED,(p,x,y,C)=>{
    p.polyline([[x-2,y],[x+1,y-4],[x+3,y-5]],LEAF[3]);
    p.line(x+1,y-4,x+2,y+1,LEAF[2]);
    round(p,x-2,y+1,2.7,2.7,C);
    round(p,x+2,y+2,2.6,2.6,C);
    p.px(x+2,y+1,C[4]);
  }],
  berry: ["A cluster of three small red berries with a green stem.",RED,(p,x,y,C)=>{
    for(const [dx,dy] of [[-2,-1],[2,-1],[0,2]])round(p,x+dx,y+dy,2.35,2.4,C);
    p.line(x,y-2,x+2,y-4,LEAF[3]);
  }],
};

export const {item:produceItem,drawIcon:drawProduceIcon} = inventoryItems("produce",items);

import { clamp } from "../../core/index.js";
import { asset, CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, round, wave } from "./art.js";
import { drawRawIcon } from "./raw-items.js";
import { drawProcessedIcon } from "./processed-items.js";
import { panel } from "./ui.js";

const UI = ["#342b42","#563d53","#835966","#b67c72","#ecc196"];

export function ui(name,desc,width,height,options,paint,extra={}){
  return asset({name,desc,tags:["ui","pixel",...name.toLowerCase().split(" ")],size:[width,height],
    origin:[width/2,height/2],palette:UI,bg:"dark",duration:2.4,options,...extra},paint);
}

export function frame(p,x,y,w,h,C){
  panel(p,x,y,w,h,{outline:C[0],rim:C[4],top:C[2],body:C[1],low:C[3]},{r:3});
  p.line(x+3,y+2,x+w-4,y+2,C[3]);
  p.px(x+2,y+3,C[4]);
}
export function label(p,s,x,y,max,C=CREAM[4]){
  p.text([...String(s??"").normalize("NFC")].slice(0,max).join(""),x,y,C,{font:"mini"});
}
export function slot(p,x,y,C,selected=false){
  p.rect(x,y,15,15,selected?GOLD[3]:C[0]);p.rect(x+1,y+1,13,13,selected?GOLD[1]:C[2]);
  p.rect(x+2,y+2,11,11,C[1]);p.line(x+2,y+13,x+12,y+13,selected?GOLD[4]:C[3]);
}

export const ITEM_IDS=["carrot","apple","wheat","seed","wood","ore","fish","egg","milk","coin","berry","stone"];
const icons = {
  carrot(p,x,y){
    p.poly([[x-3,y-2],[x+2,y-3],[x+4,y-1],[x-3,y+5],[x-4,y+4]],GOLD[1]);
    p.poly([[x-2,y-2],[x+2,y-2],[x+3,y],[x-3,y+4]],RED[3]);p.line(x-1,y-1,x-2,y+2,GOLD[4]);
    p.line(x+1,y-2,x+1,y-5,LEAF[3]);p.line(x+1,y-2,x+4,y-5,LEAF[2]);
  },
  apple(p,x,y) {
    round(p,x-.6,y,4.4,3.9,RED);p.line(x,y-2,x+1,y-5,WOOD[1]);p.line(x+1,y-4,x+3,y-5,LEAF[3]);
  },
  wheat(p,x,y) {
    p.line(x-2,y+4,x+1,y-5,GOLD[2]);
    for(const dy of [-3,-1,1]){p.line(x-2,y+dy-1,x,y+dy,GOLD[3]);p.line(x,y+dy,x+3,y+dy-1,GOLD[4]);}
  },
  seed(p,x,y) {
    p.poly([[x-3,y-4],[x+3,y-4],[x+4,y+4],[x-4,y+4]],GOLD[0]);p.rect(x-2,y-3,5,6,GOLD[3]);
    p.line(x,y+1,x+2,y-2,LEAF[2]);p.dot(x-2,y-2,GOLD[4],.9);
  },
  ore(p,x,y) {
    p.poly([[x-5,y+1],[x-3,y-3],[x+1,y-4],[x+5,y],[x+3,y+4],[x-3,y+4]],STEEL[1]);
    p.poly([[x-4,y],[x-2,y-3],[x+1,y-3],[x+4,y],[x+1,y+2],[x-2,y+2]],STEEL[3]);
    p.px(x-1,y-1,GOLD[4]);p.px(x+2,y+1,GOLD[2]);
  },
  fish(p,x,y) {
    p.tri(x-1,y,x-5,y-3,x-5,y+3,WATER[2]);round(p,x+1,y,4,2.7,WATER);
    p.px(x+3,y-1,WATER[0]);p.px(x+3,y-2,WATER[4]);
  },
  egg(p,x,y) {
    round(p,x,y,3.6,4.5,CREAM);p.px(x+1,y+1,GOLD[2]);
  },
  milk(p,x,y) {
    p.rect(x-3,y-1,7,5,STEEL[1]);p.rect(x-2,y-4,5,4,STEEL[2]);p.rect(x-2,y-2,4,5,CREAM[4]);
    p.line(x-2,y-4,x+2,y-4,VIOLET[4]);
  },
  coin(p,x,y,ph=0) {
    const w=2+2*Math.abs(wave(ph,1,.25));round(p,x,y,w,4.2,GOLD);
    if(w>3.1){p.line(x,y-2,x,y+2,GOLD[4]);p.px(x+1,y-1,GOLD[2]);}
  },
  berry(p,x,y) {
    for(const [dx,dy] of [[-2,-1],[2,-1],[0,2]])round(p,x+dx,y+dy,2.35,2.4,RED);
    p.line(x,y-2,x+2,y-4,LEAF[3]);
  },
  ingot(p,x,y) {
    p.poly([[x-6,y+2],[x-5,y-1],[x-2,y-4],[x+4,y-4],[x+6,y-1],[x+5,y+3],[x-4,y+4]],STEEL[0]);
    p.poly([[x-5,y+1],[x-2,y-3],[x+4,y-3],[x+5,y-1],[x+2,y+1]],STEEL[3]);
    p.poly([[x-5,y+2],[x+2,y+2],[x+5,y],[x+4,y+2],[x-4,y+3]],STEEL[2]);
    p.line(x-2,y-3,x+3,y-3,STEEL[4]);
  },
};

export function icon(p,id,x,y,ph){
  if(Object.hasOwn(icons,id))icons[id](p,x,y,ph);
  else if(!drawRawIcon(p,id,x,y))drawProcessedIcon(p,id,x,y);
}

export function itemGrid(p,C,ph,o,{x,y,cols,rows}){
  const items=Array.isArray(o.items)?o.items:[];
  const select=clamp(o.selected<0?Math.floor(ph*cols*rows):Math.floor(o.selected),0,cols*rows-1);
  for(let i=0;i<cols*rows;i++){
    const px=x+i%cols*17,py=y+Math.floor(i/cols)*17;
    slot(p,px,py,C,i===select);
    icon(p,items[i],px+7,py+7,ph);
  }
}
export function meter(p,ph,C,o,kind){
  const value=clamp(o.value<0?0.64+wave(ph)*.25:o.value), main=kind==="health"?RED:WATER;
  frame(p,-43,-11,86,22,C);
  if(kind==="health"){
    p.poly([[-35,-5],[-31,-5],[-29,-2],[-27,-5],[-23,-5],[-23,0],[-29,6],[-35,0]],main[2]);
    p.line(-34,-3,-32,-4,main[4]);
  }else{
    p.poly([[-27,-7],[-35,1],[-30,1],[-32,6],[-23,-2],[-28,-2]],GOLD[3]);
    p.line(-28,-5,-32,-1,GOLD[4]);
  }
  p.rect(-21,-5,58,10,C[0]);p.rect(-20,-4,56,8,C[2]);
  const full=Math.round(value*54);
  if(full>0){p.rect(-19,-3,full,6,main[2]);p.line(-19,-3,-20+full,-3,main[4]);}
  for(const x of [-6,8,22])p.line(x,-4,x,3,C[0],.35);
}

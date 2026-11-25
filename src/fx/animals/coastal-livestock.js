import { ramp } from "../../core/index.js";
import { asset, GOLD, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

const fur = {
  chicken: ["#58465a","#8f7d87","#cfbac0","#f0ddd5","#fff0d5"],
  chick: ["#76524a","#aa724d","#deaa58","#f4ce7b","#fff0bb"],
  duck: ["#464555","#786c68","#ac967f","#d5b89a","#eddbb6"],
  cow: ["#554c58","#817383","#b3a1a0","#e0cabb","#f7e5cd"],
  calf: ["#554c58","#817383","#b3a1a0","#e0cabb","#f7e5cd"],
  sheep: ["#564a5b","#887787","#c4adb0","#e6d2c5","#f5e5d2"],
  lamb: ["#564a5b","#887787","#c4adb0","#e6d2c5","#f5e5d2"],
  rabbit: ["#614f56","#927770","#bb978c","#dcba9e","#f3d8b0"],
  fox: ["#604756","#9a605a","#c67d63","#e5a076","#f4d5a6"],
  pig: ["#704e5d","#9c6e78","#ca9292","#e5b2a7","#f8d4bc"],
  goat: ["#56515e","#857782","#bdb0ab","#dfd2bd","#f7e6c7"],
  deer: ["#644c52","#896b64","#b48b70","#d1a779","#ead1a6"],
};
const palettes = Object.fromEntries(Object.entries(fur).map(([key,value])=>[key,ramp(value)]));
const bird = new Set(["chicken","chick","duck"]);
const shapes = {
  chicken:[5.2,3.8,-5,5.4,-9,2.8], chick:[3.5,2.7,-3,3.4,-5.5,2.1], duck:[5.3,3.7,-5,5,-8,2.6],
  cow:[11,6.8,-9,9,-10,4.7], sheep:[8.6,5.8,-8,7,-8,3.3], rabbit:[4.5,4.2,-5,4,-7,2.8],
  fox:[7.5,4.5,-6.5,7,-8,3.2], pig:[8,5.4,-7,7.5,-7,3.5], goat:[8.7,5.7,-8,8,-10,3.6],
  calf:[7,4.4,-6,6,-7,3.1], lamb:[5,3.4,-5,4,-5.5,2.4], deer:[9,5,-9,8,-12,3.5],
};
const comb=ramp(["#b96259"])[0];

export const { meta, draw } = asset({
  name:"Coastal livestock", desc:"Farm and woodland animals at consistent scale, with gentle idle and feeding loops.",
  tags:["animal","farm","coast"], size:[48,48], origin:[24,36], duration:2.5, fps:16,
  palette:fur.chicken, options:{ species:"chicken", facing:"right", feed:false },
},(p,t,_C,o)=>{
  const species=shapes[o.species]?o.species:"chicken";
  const C=palettes[species], [rx,ry,y,headX,headY,headR]=shapes[species];
  const xsign=o.facing==="left"?-1:1;
  const at=(x)=>x*xsign;
  const disc=(x,y,w,h,c)=>p.ellipse(at(x),y,w,h,c);
  const stroke=(x,y,tx,ty,c)=>p.line(at(x),y,at(tx),ty,c);
  const poly=(points,c)=>p.poly(points.map(([x,y])=>[at(x),y]),c);
  const isBird=bird.has(species);
  const peck=o.feed?Math.round(3*Math.max(0,wave(t,2,o.seed*.05))**4):0;
  const lift=species==="rabbit"?Math.max(0,Math.round(wave(t,1,o.seed*.1))):0;
  groundShadow(p,0,1,rx+2,Math.max(2,ry*.44),.75);
  for(const [x,dy] of [[-rx*.51,-1],[-rx*.23,1],[rx*.44,-1],[rx*.57,1]]) {
    if(isBird && dy===-1) continue;
    stroke(x,y+ry-1,x,dy-lift,C[0]);
    if(isBird) stroke(x,dy-lift,x+2,dy-lift,GOLD[2]);
    else p.px(at(x+1),dy-lift,C[1]);
  }
  if(species==="fox") {
    poly([[-6,-7],[-11,-9],[-15,-7],[-16,-3],[-11,-2],[-6,-4]],C[0]);
    poly([[-7,-6],[-12,-8],[-15,-5],[-12,-3],[-7,-4]],C[2]);
    stroke(-15,-5,-15,-3,C[4]);
  } else if(isBird){
    poly([[-3,y+1],[-rx-3,y-4],[-rx-2,y+1],[-2,y+3]],C[1]);
  } else if(species==="rabbit") disc(-rx,y+1,2.5,2,C[4]);
  disc(0,y-lift,rx,ry,C[0]);
  disc(0,y-lift-1,rx-1,ry-1,C[2]);
  p.ellipse(-rx*.23,y-lift-ry*.36,rx*.60,ry*.53,C[3]);
  if(species==="cow") {
    poly([[-7,-12],[-3,-15],[-1,-12],[-3,-8],[-7,-9]],C[1]);
    poly([[1,-13],[5,-12],[7,-8],[3,-6],[0,-8]],C[0]);
  }
  if(species==="calf") disc(-2,-7,2,1.5,C[1]);
  if(species==="sheep") for(const [x,y] of [[-5,-9],[-3,-12],[2,-11],[4,-7]]) disc(x,y,2.6,2,C[3]);
  if(species==="lamb") disc(-1,-7,2,1.2,C[4]);
  if(species==="deer") for(const [x,y] of [[-5,-10],[-2,-12],[1,-10],[4,-11]])p.px(at(x),y,C[4]);
  if(isBird) {
    disc(-1,y-lift,Math.max(1,rx*.62),Math.max(1,ry*.56),C[1]);
    stroke(-3,y-1,1,y-2,C[3]);
  }
  const hx=headX+(peck?1:0), hy=headY+peck-lift;
  if(["fox","rabbit","goat","cow","calf","pig","deer"].includes(species)){
    const long=species==="rabbit"?6:species==="fox"||species==="goat"||species==="deer"?4:2;
    for(const delta of [-2,1]) {
      poly([[hx+delta-1,hy],[hx+delta-2,hy-headR-long],[hx+delta+1,hy-headR],[hx+delta+2,hy]],C[0]);
      stroke(hx+delta-1,hy-headR-long+1,hx+delta,hy-headR+1,C[3]);
    }
  }
  if(species==="deer") for(const d of [-2,2]){
    stroke(hx+d,hy-3,hx+d-1,hy-9,C[0]);
    stroke(hx+d-1,hy-7,hx+d+2,hy-10,C[1]);
  }
  disc(hx,hy,headR+1,headR,C[0]);
  disc(hx,hy-1,headR,Math.max(1,headR-1),species==="sheep"||species==="lamb"?C[1]:C[3]);
  if(isBird){
    poly([[hx+headR-1,hy],[hx+headR+3,hy+1],[hx+headR-1,hy+2]],GOLD[2]);
    if(species==="chicken") {
      poly([[hx-2,hy-3],[hx-2,hy-5],[hx+1,hy-5],[hx+2,hy-3]],comb);
    }
  } else if(["cow","calf","pig","fox","deer"].includes(species)) {
    disc(hx+headR-1,hy+2,headR*.75,headR*.52,C[4]);
    p.px(at(hx+headR),hy+2,C[0]);
  }
  p.px(at(hx+1),hy-1,C[0]);
});

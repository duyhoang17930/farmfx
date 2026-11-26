import { CREAM, GOLD, LEAF, RED, STEEL, WATER, WOOD, box, post, round, wave } from "./art.js";
import { bench, boltHeads, BRASS, CERAMIC, COAL, COPPER, exhaust, hot, INDUSTRIAL,
  lamp, machine, plinth, tank, vapor, vent, wheel } from "./machine.js";

export const kiln = machine("Kiln","A brick dome with a firing arch and a shelf of finished pottery.",CERAMIC,(p,C,t,o)=>{
  p.poly([[-21,0],[-20,-16],[-15,-28],[-7,-34],[8,-34],[17,-28],[21,-17],[21,0]],C[0]);
  p.poly([[-19,-1],[-19,-16],[-14,-27],[-7,-33],[7,-33],[16,-27],[19,-17],[19,-1]],C[2]);
  for(const [x,y,w] of [[-14,-27,29],[-18,-20,36],[-19,-13,38],[-19,-6,38]]) {
    p.line(x,y,x+w,y,C[1]);
    p.line(x+4,y-1,x+9,y-1,C[3]);
    p.line(x+5,y-3,x+5,y,C[1]);
    p.line(x+w-6,y-2,x+w-6,y,C[1]);
  }
  exhaust(p,-5,-40,9,8,C);
  p.ellipse(-5,-10,9,11,C[0]);
  hot(p,-12,-16,14,14,t,o.active);
  round(p,11,-5,5,5,RED);
  p.ellipse(11,-9,3.7,1.5,C[1]);
  if(o.active) vapor(p,0,-39,t,o.seed,CREAM,3);
});

export const advancedFurnace = machine("Advanced furnace","A reinforced double-door furnace with lit viewports and a side pressure gauge.",STEEL,(p,C,t,o)=>{
  plinth(p,C,38,7);
  box(p,-18,-6,33,28,5,C);
  exhaust(p,-1,-43,10,11,C);
  for(const x of [-12,1]) {
    p.rect(x-2,-27,13,15,C[1]);
    hot(p,x,-24,9,8,t,o.active);
    p.line(x,-13,x+8,-13,C[3]);
  }
  vent(p,-13,-10,22,4,C);
  round(p,17,-24,4,4,CREAM);
  p.line(17,-24,19,-25+Math.round(wave(t)),C[0]);
  lamp(p,13,-11,o.active);
  boltHeads(p,[[-16,-31],[13,-31],[-16,-8],[13,-8]]);
});

export const smelter = machine("Smelter","A suspended copper crucible melts ore above a glowing ingot mold.",COPPER,(p,C,t,o)=>{
  plinth(p,STEEL,35,5);
  post(p,-15,-3,30,STEEL);
  post(p,15,-3,30,STEEL);
  p.beam(-17,-31,17,-31,5,STEEL[1]);
  p.line(-16,-33,16,-33,STEEL[4]);
  const tip=Math.round(wave(t));
  p.poly([[-11,-24],[10,-24],[9,-17],[2+tip,-13],[-6,-16]],C[0]);
  p.poly([[-9,-22],[8,-22],[8,-18],[2+tip,-15],[-5,-17]],C[2]);
  p.ellipse(0,-24,10,3,C[1]);
  p.ellipse(0,-24,7.8,2,o.active?GOLD[3]:C[0]);
  box(p,-8,-2,16,4,3,C);
  if(o.active) {
    p.line(2+tip,-17,2,-8,GOLD[2],0.68+0.3*wave(t,2));
    p.ellipse(2,-8,5,1.5,GOLD[3]);
    p.glow(2,-12,8,GOLD[2],0.31);
  }
});

export const blastFurnace = machine("Blast furnace","A tall steel tower with a hot inspection slot, banded shell and side air pipes.",COAL,(p,C,t,o)=>{
  plinth(p,C,40,6);
  tank(p,0,-6,13,31,C);
  exhaust(p,-5,-45,10,9,C);
  for(const y of [-31,-21,-12]) {
    p.line(-12,y,11,y,STEEL[1]);
    p.line(-11,y-1,10,y-1,STEEL[3]);
  }
  p.beam(10,-18,18,-18,6,STEEL[1]);
  p.beam(18,-18,18,-5,6,STEEL[1]);
  p.line(16,-17,16,-8,STEEL[3]);
  hot(p,-7,-17,13,7,t,o.active);
  vent(p,-9,-9,16,5,STEEL);
  if(o.active) vapor(p,0,-44,t,o.seed,CREAM,2);
},{size:[64,80]});

export const charcoalKiln = machine("Charcoal kiln","A low clay charcoal oven with a blackened flue, split logs and cooling smoke.",COAL,(p,C,t,o)=>{
  p.poly([[-21,0],[-20,-12],[-13,-25],[-3,-31],[8,-29],[15,-20],[18,-10],[18,0]],C[0]);
  p.poly([[-19,-1],[-18,-12],[-12,-24],[-3,-30],[8,-28],[14,-20],[16,-11],[16,-1]],C[2]);
  p.polyline([[-18,-12],[-12,-23],[-3,-29],[6,-28]],C[3]);
  p.line(-15,-9,-12,-7,C[1]);
  p.line(0,-22,3,-20,C[1]);
  exhaust(p,-10,-35,7,8,C);
  p.ellipse(-1,-8,8,8,C[0]);
  hot(p,-7,-11,12,9,t,o.active);
  for(const [x,y] of [[10,-3],[18,-3],[15,-8],[21,-7]]) {
    p.beam(x,y,x+5,y-3,4,WOOD[1]);
    p.ellipse(x,y,2.4,2.1,WOOD[3]);
    p.px(x,y,WOOD[2]);
  }
  if(o.active) vapor(p,-6,-34,t,o.seed,CREAM,3);
});

export const oilPress = machine("Oil press","A brass screw press lowers into a slatted barrel above a golden drip tray.",BRASS,(p,C,t,o)=>{
  bench(p,WOOD,36,9);
  for(const x of [-15,14]) post(p,x,-7,28,WOOD);
  box(p,-16,-32,32,4,4,WOOD);
  const stroke=2+Math.round(2*wave(t));
  p.rect(-2,-34,4,13+stroke,C[1]);
  for(let y=-32;y<-22+stroke;y+=3) p.line(-2,y,1,y-1,C[4]);
  p.beam(-9,-38,9,-38,3,C[2]);
  tank(p,0,-9,9,12,C);
  p.ellipse(0,-21,7,2.2,C[1]);
  p.line(6,-12,14,-12,STEEL[3]);
  p.ellipse(15,-8,5,1.9,C[1]);
  if(o.active) p.px(14,-11+Math.floor(3*(t*3%1)),GOLD[4]);
});

export const oilPump = machine("Oil pump","A walking beam rocks over a tall rig and a black oil sump.",INDUSTRIAL,(p,C,t)=>{
  plinth(p,C,42,5);
  p.beam(-10,-7,0,-29,4,C[1]);
  p.beam(11,-7,0,-29,4,C[1]);
  p.line(-8,-13,9,-13,C[3]);
  const tilt=Math.round(5*wave(t));
  p.beam(-18,-30-tilt,20,-32+tilt,5,C[0]);
  p.line(-17,-31-tilt,20,-33+tilt,C[4]);
  p.poly([[-21,-33-tilt],[-16,-33-tilt],[-16,-26-tilt],[-20,-24-tilt]],GOLD[2]);
  p.line(-19,-25-tilt,-19,-8,STEEL[3]);
  wheel(p,15,-13,7,STEEL,t,5);
  p.line(15,-12,18,-30+tilt,C[3]);
  p.ellipse(-17,-6,6,2.5,C[0]);
  p.line(-21,-6,-14,-7,WATER[2]);
});

export const refinery = machine("Refinery","Twin distillation tanks with linked pipes and a blue sight glass.",INDUSTRIAL,(p,C,t,o)=>{
  plinth(p,C,48,6);
  tank(p,-12,-5,9,32,C);
  tank(p,12,-5,10,23,C);
  p.polyline([[-12,-38],[-12,-46],[11,-46],[11,-30]],STEEL[2]);
  p.polyline([[-11,-39],[-11,-45],[10,-45],[10,-30]],STEEL[4]);
  p.rect(9,-25,5,14,C[0]);
  const fill=o.active?7+Math.round(4*wave(t)):3;
  p.rect(10,-12-fill,3,fill,WATER[3]);
  p.line(-20,-20,-5,-20,C[1]);
  p.line(3,-16,20,-16,C[1]);
  exhaust(p,-5,-42,5,9,C);
  lamp(p,-11,-13,o.active);
},{size:[64,80]});

export const factory = machine("Factory","A broad brick works with sawtooth roofs, paired chimneys and lit windows.",CERAMIC,(p,C,t,o)=>{
  plinth(p,STEEL,62,6);
  for(const [x,w,h] of [[-23,7,15],[16,9,19]]) {
    exhaust(p,x,-31-h,w,h,C);
    if(o.active) vapor(p,x+w/2,-31-h,t,o.seed+x,CREAM,3);
  }
  box(p,-29,-4,54,26,9,C);
  for(const x of [-29,-11,7]) {
    p.poly([[x,-30],[x+12,-43],[x+19,-40],[x+18,-30]],STEEL[0]);
    p.poly([[x+2,-31],[x+12,-42],[x+17,-40],[x+15,-31]],STEEL[2]);
    p.line(x+3,-32,x+12,-41,STEEL[4]);
  }
  for(const x of [-23,-9,5]) {
    p.rect(x,-25,9,10,C[0]);
    p.rect(x+1,-24,7,8,o.active?GOLD[3]:WATER[1]);
    p.line(x+4,-24,x+4,-17,C[1]);
    p.line(x+1,-21,x+7,-21,C[1]);
  }
  vent(p,13,-20,10,16,STEEL);
},{size:[80,80],origin:[40,68]});

export const assemblyMachine = machine("Assembly machine","An enclosed assembly station stamps components on a short feed track.",INDUSTRIAL,(p,C,t,o)=>{
  plinth(p,C,44,7);
  box(p,-19,-7,32,25,6,C);
  p.rect(-13,-28,24,16,C[0]);
  p.rect(-12,-27,22,13,WATER[1]);
  p.line(-10,-25,-4,-25,WATER[3]);
  const down=o.active?Math.round(4*wave(t,2)):0;
  p.rect(-5,-28,10,7,STEEL[1]);p.line(-4,-27,3,-27,STEEL[3]);
  p.rect(-2,-22,4,8+down,STEEL[3]);p.line(-2,-21,-2,-15+down,STEEL[4]);
  p.rect(-5,-15+down,10,3,C[0]);p.line(-4,-14+down,3,-14+down,STEEL[3]);
  box(p,-24,-3,46,4,4,STEEL);
  for(const x of [-21,-17,14,18])p.line(x,-9,x+1,-7,STEEL[1]);
  p.line(-23,-9,-15,-9,GOLD[2]);p.line(13,-9,21,-9,GOLD[2]);
  box(p,-11+Math.round(5*wave(t)),-9,8,4,2,GOLD);
  lamp(p,15,-26,o.active,LEAF);
  boltHeads(p,[[-17,-15],[15,-15],[-17,-29]]);
});

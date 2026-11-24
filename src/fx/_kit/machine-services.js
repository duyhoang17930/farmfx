import { CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, box, post, round, wave } from "./art.js";
import { bench, boltHeads, BRASS, CERAMIC, coin, hot, INDUSTRIAL,
  lamp, machine, plinth, vapor, wheel } from "./machine.js";
import { twinkle } from "./sprite.js";

export const alchemyStation = machine("Alchemy station","Glass alembics and a coiled copper tube bubble over a cluttered bench.",VIOLET,(p,C,t,o)=>{
  bench(p,WOOD,34,11);
  p.polyline([[-10,-28],[-10,-35],[2,-35],[8,-29],[10,-22]],GOLD[3]);
  p.beam(-9,-30,-9,-22,6,C[1]);
  round(p,-9,-19,7.5,8.5,C);
  p.ellipse(-9,-18,5,4,o.active?WATER[3]:WATER[2]);
  p.rect(8,-26,4,7,WATER[2]);
  round(p,10,-16,6,5.5,WATER);
  p.rect(9,-25,3,3,GOLD[2]);
  if(o.active) for(let i=0;i<3;i++) {
    const u=(t+i/3)%1;
    p.px(-12+i*3,-16-u*7,CREAM[4]);
  }
  box(p,14,-9,6,4,2,LEAF);
});

export const enchantingTable = machine("Enchanting table","An open book floats above a runed plinth between two crystal lamps.",VIOLET,(p,C,t,o)=>{
  plinth(p,C,35,8);
  box(p,-11,-7,22,10,5,C);
  for(const x of [-14,14]) {
    post(p,x,-6,13,STEEL);
    p.poly([[x-4,-21],[x,-27],[x+4,-21],[x,-16]],C[0]);
    p.poly([[x-3,-21],[x,-26],[x+2,-21],[x,-17]],o.active?C[4]:C[2]);
  }
  const y=-22-Math.round(2*wave(t));
  p.poly([[-13,y],[-8,y-4],[0,y-1],[8,y-4],[13,y],[10,y+5],[0,y+3],[-10,y+5]],C[0]);
  p.poly([[-12,y],[-8,y-3],[0,y],[8,y-3],[12,y],[9,y+3],[0,y+2],[-9,y+3]],CREAM[4]);
  p.line(0,y,0,y+3,CREAM[1]);
  p.line(-8,y,-2,y+1,C[2]);
  p.line(2,y+1,8,y,C[2]);
  if(o.active) {
    p.glow(0,y,10,C[3],0.22);
    twinkle(p,7,y-8,1.8*(1+wave(t)),GOLD[3],GOLD[4]);
  }
});

export const cookingStation = machine("Cooking station","A kitchen range with a steaming soup pot, side pan and small firebox.",CERAMIC,(p,C,t,o)=>{
  box(p,-20,0,36,13,6,C);
  hot(p,-9,-10,14,8,t,o.active);
  for(const x of [-16,9,13])p.px(x,-6,C[4]);
  p.ellipse(-5,-15,10,6,RED[1]);
  p.ellipse(-5,-22,10,3.2,STEEL[0]);
  p.ellipse(-5,-22,8,2,GOLD[o.active?3:1]);
  p.line(-16,-19,-13,-17,STEEL[3]);
  p.ellipse(12,-14,6,3.3,STEEL[0]);
  p.ellipse(12,-15,4.5,2,STEEL[2]);
  p.line(17,-15,25,-17,STEEL[3]);
  if(o.active)vapor(p,-5,-24,t,o.seed,CREAM,4);
});

export const brewingStation = machine("Brewing station","A wooden cask feeds a copper tap over a row of bottles and a drip tray.",WOOD,(p,C,t,o)=>{
  bench(p,C,40,10);
  p.ellipse(-3,-24,15,13,C[0]);
  p.ellipse(-3,-24,13,12,C[2]);
  p.ellipse(-7,-24,10,11,C[3]);
  for(const y of [-31,-25,-18])p.line(-13,y,6,y,C[1]);
  p.polyline([[5,-34],[12,-29],[12,-19],[6,-14]],STEEL[2]);
  p.beam(-4,-19,-4,-14,4,GOLD[1]);
  p.line(-4,-18,1,-18,GOLD[4]);
  for(const [x,ramp] of [[5,WATER],[11,LEAF],[17,RED]]) {
    p.rect(x,-18,3,4,ramp[1]);
    round(p,x+1,-12,2.7,4,ramp);
  }
  if(o.active)p.px(0,-17+Math.floor(7*((t*2)%1)),GOLD[3]);
});

export const fishTrap = machine("Fish trap","A floating woven fish trap with a funnel opening and a small bobbing float.",WOOD,(p,C,t,o)=>{
  const y=-7+Math.round(wave(t)*1.25);
  p.ellipse(0,0,21,7,WATER[1]);
  p.ellipse(0,0,18,5,WATER[2]);
  p.line(-17,2,-10,3,WATER[3]);
  p.poly([[-18,y],[-12,y-10],[11,y-10],[17,y],[12,y+6],[-12,y+6]],C[0]);
  p.poly([[-16,y],[-11,y-8],[10,y-8],[15,y],[11,y+4],[-11,y+4]],C[2]);
  for(const x of [-11,-6,-1,4,9])p.line(x,y-8,x+2,y+4,C[1]);
  for(const yy of [y-4,y,y+3])p.line(-11,yy,10,yy,C[3]);
  p.ellipse(12,y,5.5,6,C[0]);
  p.ellipse(12,y,3.5,4,C[1]);
  p.line(15,y-3,23,y-6,C[4]);
  round(p,23,y-6,2.8,3,RED);
  if(o.active) {
    const u=t%1;
    p.line(16+u*7,2,20+u*7,2,WATER[4],0.8*(1-u));
  }
});

export const recyclingMachine = machine("Recycling machine","A green recycling cabinet feeds scrap through rollers and sorts it into a bin.",LEAF,(p,C,t,o)=>{
  plinth(p,C,40,6);
  box(p,-18,-5,31,28,6,C);
  p.rect(-13,-29,21,8,C[0]);
  for(const [i,x] of [-10,-5,0,5].entries()) {
    p.line(x,-28,x,-23,STEEL[2]);
    p.dot(x,-26,STEEL[4],o.active?Math.max(0,wave(t,2,i/5)):0.2);
  }
  p.polyline([[-9,-15],[-5,-18],[-1,-15]],C[4]);
  p.polyline([[1,-14],[2,-9],[-3,-10]],C[4]);
  p.polyline([[-5,-9],[-9,-9],[-10,-13]],C[4]);
  box(p,8,-2,12,9,4,STEEL);
  p.px(13,-12,GOLD[3]);
  lamp(p,12,-25,o.active,WATER);
});

export const bank = machine("Bank","A stone vault with brass trim, a round locking dial and a coin emblem.",STEEL,(p,C)=>{
  plinth(p,C,42,6);
  box(p,-18,-5,34,30,5,C);
  p.poly([[-21,-32],[-14,-40],[14,-40],[21,-33],[15,-29],[-16,-29]],C[0]);
  p.poly([[-19,-33],[-13,-39],[12,-39],[18,-33],[13,-31],[-16,-31]],C[3]);
  p.rect(-14,-28,28,21,C[1]);
  p.line(-13,-27,12,-27,GOLD[3]);
  wheel(p,0,-18,9,C,0,6);
  round(p,0,-36,4,3.3,GOLD);
  p.line(0,-37,0,-34,GOLD[4]);
  boltHeads(p,[[-11,-25],[11,-25],[-11,-9],[11,-9]]);
},{moving:false});

export const coinMint = machine("Coin mint","A gold-trimmed stamping press drops currency into a front tray.",BRASS,(p,C,t,o)=>{
  plinth(p,STEEL,37,6);
  for(const x of [-14,13])post(p,x,-5,26,C);
  box(p,-16,-29,30,5,5,C);
  const stamp=Math.round(5*wave(t,2));
  p.rect(-4,-25,8,13+stamp,C[1]);
  p.line(-3,-24,-3,-14+stamp,C[4]);
  p.rect(-6,-13+stamp,12,4,C[3]);
  p.ellipse(0,-8,7,3,C[0]);
  box(p,6,-1,13,5,2,C);
  coin(p,11,-8,t);
  if(o.active) coin(p,7+Math.round(5*t),-12+Math.round(5*t),t*2);
});

export const repairStation = machine("Repair station","A service bench holds a wrench, a vise and a softly pulsing work lamp.",INDUSTRIAL,(p,C,t,o)=>{
  bench(p,C,40,12);
  post(p,-15,-10,27,C);
  p.beam(-16,-37,0,-37,4,C[1]);
  p.poly([[-5,-37],[5,-37],[8,-32],[-8,-32]],C[0]);
  p.line(-5,-33,5,-33,o.active?GOLD[4]:C[2]);
  box(p,5,-14,13,6,4,STEEL);
  p.line(6,-20,16,-20,STEEL[4]);
  p.line(11,-18,11,-25,STEEL[1]);
  p.beam(-10,-17,-1,-21,3,STEEL[2]);
  p.polyline([[-2,-21],[1,-23],[4,-22]],STEEL[4]);
  p.rect(-6,-9,11,5,C[1]);
  if(o.active) p.glow(0,-28,12,GOLD[3],0.17+0.07*wave(t));
  lamp(p,14,-10,o.active,LEAF);
});

export const teleporter = machine("Teleporter","Two pylons project a violet gate over a circular platform.",VIOLET,(p,C,t,o)=>{
  p.ellipse(0,-1,23,7,C[0]);
  p.ellipse(0,-3,22,5,C[2]);
  p.ellipse(0,-3,17,3,C[1]);
  for(const x of [-16,16]) {
    box(p,x-3,-4,6,32,4,STEEL);
    p.rect(x-2,-29,5,6,o.active?C[4]:C[1]);
    p.px(x-1,-28,C[3]);
  }
  p.beam(-15,-37,15,-37,6,C[0]);
  p.line(-15,-38,15,-38,C[3]);
  if(!o.active)return;
  p.ellipse(0,-21,13,15,C[2],0.55);
  p.ellipse(0,-21,11,14,C[3],0.55);
  p.ellipse(0,-21,8,12,C[4],0.45);
  for(let i=0;i<7;i++) {
    const phase=t+i/7;
    twinkle(p,9*wave(phase),-22+12*wave(phase,1,0.23),1.4*(1+wave(phase,3)),C[3],C[4]);
  }
  p.glow(0,-22,16,C[3],0.39);
});

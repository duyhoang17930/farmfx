import { ramp } from "../../core/index.js";
import { CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, box, post, round, wave } from "./art.js";
import { BRASS, COPPER, exhaust, hot, INDUSTRIAL, lamp, machine, plinth,
  soilCrop, tank, vapor, vent, wheel } from "./machine.js";

export const powerGenerator = machine("Power generator","A petrol generator with copper windings, a side fan and a green status light.",INDUSTRIAL,(p,C,t,o)=>{
  plinth(p,C,41,6);
  box(p,-19,-5,34,20,6,C);
  p.rect(-14,-23,17,15,C[0]);
  for (const x of [-12,-9,-6,-3,0]) {
    p.rect(x,-20,2,10,COPPER_COLOR[2]);
    p.px(x,-20,COPPER_COLOR[3]);
  }
  wheel(p,9,-16,7,STEEL,t,5);
  vent(p,-13,-8,23,4,C);
  exhaust(p,-11,-32,7,8,STEEL);
  lamp(p,15,-11,o.active,LEAF);
});

const COPPER_COLOR = ramp(COPPER);

export const steamGenerator = machine("Steam generator","A brass boiler with a rocking pressure gauge and a short steam stack.",BRASS,(p,C,t,o)=>{
  plinth(p,STEEL,42,6);
  tank(p,-5,-5,13,24,C);
  exhaust(p,-10,-40,9,13,C);
  for(const y of [-23,-14,-9])p.line(-18,y,7,y,C[1]);
  round(p,4,-27,5,5,CREAM);
  p.line(4,-27,6,-29+Math.round(2*wave(t)),RED[2]);
  p.beam(10,-20,19,-20,5,C[1]);
  p.beam(19,-20,19,-5,5,C[1]);
  p.line(18,-18,18,-6,C[3]);
  hot(p,-12,-16,13,8,t,o.active);
  if(o.active) vapor(p,-5,-39,t,o.seed,CREAM,4);
});

export const solarPanel = machine("Solar panel","An angled blue photovoltaic array with an indicator on its stand.",WATER,(p,C,t,o)=>{
  post(p,-8,0,17,STEEL);
  post(p,11,0,17,STEEL);
  p.poly([[-23,-12],[-12,-35],[24,-35],[15,-13]],STEEL[0]);
  p.poly([[-20,-14],[-11,-33],[22,-33],[14,-15]],C[1]);
  for(let y=-30;y<=-17;y+=6) {
    const x=-11+Math.floor((-33-y)*0.50);
    p.line(x,y,x+33,y,C[3]);
  }
  for(const x of [-6,2,10,18]) p.line(x,-33,x-8,-15,C[2]);
  p.line(-12,-34,24,-34,C[4]);
  if(o.active) {
    const u=(t+0.15)%1;
    const x=-9+Math.round(u*25);
    p.line(x,-32,x-6,-17,C[4],Math.sin(u*Math.PI)*0.6);
  }
  lamp(p,12,-5,o.active,LEAF);
});

export const batteryStation = machine("Battery station","Three upright battery packs with charge bars dock on a reinforced platform.",VIOLET,(p,C,t,o)=>{
  plinth(p,C,43,6);
  for(const [i,x] of [-18,-6,6].entries()) {
    box(p,x,-5,10,22,3,C);
    p.rect(x+2,-31,6,4,STEEL[2]);
    p.rect(x+2,-23,6,13,C[0]);
    const fill=o.active?7+Math.round(3*wave(t,1,i*0.2)):3;
    p.rect(x+3,-11-fill,4,fill,LEAF[3]);
    p.line(x+3,-12-fill,x+6,-12-fill,LEAF[4]);
  }
  p.line(-17,-6,18,-6,STEEL[4]);
  lamp(p,20,-12,o.active,LEAF);
});

export const miningDrill = machine("Mining drill","A tall frame lowers a rotating steel auger into an ore bed.",BRASS,(p,C,t,o)=>{
  p.ellipse(0,-3,13,5,STEEL[1]);
  p.poly([[-12,-3],[-6,-9],[8,-10],[13,-5],[9,0]],STEEL[2]);
  for(const x of [-17,17]) post(p,x,0,39,C);
  p.beam(-20,-37,20,-37,5,C[1]);
  p.line(-18,-39,18,-39,C[4]);
  const height=Math.round(4*wave(t));
  box(p,-8,-20+height,16,16,3,C);
  p.tri(-6,-20+height,6,-20+height,0,-5+height,STEEL[3]);
  for(let i=0;i<4;i++) {
    const y=-19+height+i*3+(o.active?Math.floor(t*12)%3:0);
    const w=Math.max(1,5-i);
    p.line(-w,y,w,y-2,STEEL[1]);
  }
  lamp(p,14,-27,o.active);
});

export const miningRod = machine("Mining rod","A slender copper mast suspends a crystal that sends pulses toward the ground.",COPPER,(p,C,t,o)=>{
  p.ellipse(0,-2,14,5,C[1]);
  p.ellipse(0,-4,11,3,C[3]);
  post(p,0,-3,38,C);
  box(p,-7,-34,13,8,4,C);
  p.poly([[-4,-45],[1,-50],[6,-43],[4,-37],[-1,-36],[-6,-42]],VIOLET[0]);
  p.poly([[-4,-43],[1,-49],[4,-43],[-1,-38]],VIOLET[o.active?4:2]);
  p.line(1,-47,1,-39,VIOLET[3]);
  if(o.active) {
    const u=(t+0.1)%1;
    const r=3+u*13;
    p.ellipse(0,-2,r,r*0.32,VIOLET[3],0.24*(1-u));
    p.glow(0,-43,6,VIOLET[4],0.35+0.15*wave(t,2));
  }
});

export const autoHarvester = machine("Auto harvester","A wheeled harvester sweeps its front reel through a row of crops.",BRASS,(p,C,t,o)=>{
  wheel(p,-11,-6,6,STEEL,t);
  wheel(p,12,-6,5,STEEL,t);
  box(p,-17,-8,25,16,5,C);
  p.poly([[-12,-24],[-6,-32],[4,-32],[10,-24]],STEEL[0]);
  p.poly([[-10,-25],[-5,-31],[3,-31],[8,-25]],WATER[2]);
  p.line(-8,-25,-5,-29,WATER[4]);
  p.beam(6,-15,16,-9,4,STEEL[1]);
  wheel(p,18,-8,7,C,t,5);
  for(const x of [9,15,22])soilCrop(p,x,2,LEAF,0.75);
  lamp(p,-13,-15,o.active);
});

export const autoCollector = machine("Auto collector","A teal intake pulls loose items into a strapped collection bin.",INDUSTRIAL,(p,C,t,o)=>{
  plinth(p,C,37,5);
  box(p,-17,-4,28,20,6,C);
  p.poly([[-14,-22],[-8,-29],[13,-29],[19,-23],[11,-17],[-8,-17]],C[0]);
  p.poly([[-9,-22],[-6,-26],[11,-26],[14,-23],[9,-20],[-6,-20]],WATER[2]);
  p.rect(-13,-16,20,9,C[1]);
  for(const x of [-10,3]) p.line(x,-16,x,-7,C[3]);
  vent(p,9,-17,5,9,C);
  if(o.active)for(let i=0;i<4;i++) {
    const u=(t+i/4)%1;
    p.px(-5+i*4,-23-14*(1-u),LEAF[i%2+3]);
  }
  lamp(p,13,-12,o.active,LEAF);
});

export const autoPlanter = machine("Auto planter","A green seed hopper drops grains behind two furrow-forming wheels.",LEAF,(p,C,t,o)=>{
  wheel(p,-13,-6,6,STEEL,t,5);
  wheel(p,12,-7,6,STEEL,t,5);
  box(p,-14,-8,27,11,6,C);
  p.poly([[-14,-30],[15,-30],[12,-18],[-7,-18]],C[0]);
  p.poly([[-12,-29],[13,-29],[10,-19],[-6,-19]],C[2]);
  p.line(-11,-28,11,-28,C[4]);
  p.ellipse(1,-30,13,3,C[1]);
  p.ellipse(1,-30,11,1.8,GOLD[3]);
  p.line(2,-17,4,-11,C[3]);
  if(o.active)for(let i=0;i<3;i++) {
    const u=(t+i/3)%1;
    p.px(1+i*2,-10+10*u,GOLD[4]);
  }
});

export const autoFeeder = machine("Auto feeder","A grain hopper dispenses feed into a long wooden animal trough.",WOOD,(p,C,t,o)=>{
  for(const x of [-17,15])post(p,x,0,10,C);
  box(p,-20,-3,38,7,5,C);
  p.poly([[-18,-10],[-14,-14],[20,-14],[16,-10]],C[0]);
  box(p,-11,-14,23,21,5,C);
  p.poly([[-15,-32],[-11,-38],[16,-38],[19,-32]],RED[1]);
  p.line(-11,-37,16,-37,RED[4]);
  p.rect(-3,-23,8,8,C[0]);
  p.line(-3,-23,4,-23,GOLD[3]);
  if(o.active) for(let i=0;i<6;i++) {
    const u=(t+i/6)%1;
    p.px(-2+(i%3)*2,-16+u*5,GOLD[i%2+3]);
  }
});

export const roboticArm = machine("Robotic arm","A servo arm cycles between positions with an opening two-finger gripper.",BRASS,(p,C,t)=>{
  plinth(p,STEEL,35,6);
  tank(p,-8,-5,8,9,STEEL);
  const x=7+Math.round(11*wave(t,1,0.14)), y=-28+Math.round(5*wave(t,1,0.35));
  const elbow=[-3+Math.round(4*wave(t)),-37+Math.round(3*wave(t))];
  for(const [a,b] of [[[-8,-15],elbow],[elbow,[x,y]]]) {
    p.beam(...a,...b,8,C[0]);
    p.beam(...a,...b,5,C[2]);
    p.line(a[0]-1,a[1],b[0]-1,b[1],C[4]);
  }
  round(p,...elbow,4.2,4.2,STEEL);
  round(p,x,y,3.4,3.4,STEEL);
  const gap=3+Math.round(2*wave(t,2));
  for(const sign of [-1,1]) p.polyline([[x,y+2],[x+sign*gap,y+6],[x+sign*gap,y+9],[x+sign,y+10]],STEEL[3]);
});

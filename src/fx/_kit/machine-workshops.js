import { TAU } from "../../core/index.js";
import { CREAM, GOLD, RED, STEEL, VIOLET, WATER, WOOD, box, post, round, wave } from "./art.js";
import { bench, boltHeads, BRASS, CERAMIC, exhaust, hot, INDUSTRIAL, lamp, machine, plinth, vapor, wheel } from "./machine.js";

export const forge = machine("Forge","An open hearth under a blackened hood with a bellows and hot coals.",CERAMIC,(p,C,t,o)=>{
  box(p,-19,0,28,12,5,C);
  p.poly([[-18,-13],[-18,-25],[-11,-33],[8,-33],[14,-25],[14,-13]],C[0]);
  p.poly([[-16,-14],[-16,-25],[-10,-32],[7,-32],[13,-25],[13,-14]],C[2]);
  p.line(-15,-25,-10,-31,C[4]);
  hot(p,-12,-24,19,13,t,o.active);
  p.line(-18,-12,12,-12,C[4]);
  exhaust(p,-5,-40,10,9,STEEL);
  p.poly([[13,-4],[25,-7],[23,-12],[13,-12]],WOOD[1]);
  p.polyline([[13,-12],[23,-11],[25,-7]],WOOD[3]);
  p.line(14,-13,22,-16+2*wave(t),WOOD[4]);
  if(o.active) vapor(p,0,-38,t,o.seed);
});

export const anvil = machine("Anvil","A steel anvil on a banded stump with a hammer resting beside the horn.",STEEL,(p,C)=>{
  box(p,-9,0,19,13,4,WOOD);
  p.poly([[-9,-6],[9,-6],[14,-10],[14,-12],[9,-8],[-9,-8]],C[1]);
  p.poly([[-13,-15],[-9,-21],[-18,-23],[-18,-26],[10,-26],[21,-24],[16,-21],
    [9,-20],[6,-15],[10,-13],[-14,-13]],C[0]);
  p.poly([[-17,-25],[9,-25],[20,-24],[13,-22],[-11,-22]],C[4]);
  p.poly([[-9,-21],[8,-21],[5,-15],[8,-14],[-11,-14]],C[2]);
  p.line(-5,-20,-7,-15,C[3]);
  p.beam(1,-26,7,-29,2,WOOD[3]);
  p.rect(5,-31,7,3,C[1]);
  p.line(5,-31,11,-31,C[3]);
},{moving:false});

function saw(p,x,y,r,C,t) {
  p.circle(x,y,r,C[1]);
  p.circle(x,y,r-2,C[3]);
  for (let i=0;i<10;i++) {
    const a=TAU*(i/10+t);
    const ax=x+Math.cos(a)*r,ay=y+Math.sin(a)*r;
    p.line(x+Math.cos(a)*(r-2),y+Math.sin(a)*(r-2),ax,ay,C[4]);
  }
  p.circle(x,y,2,C[1]);
  p.px(x,y,C[4]);
}

export const sawmill = machine("Sawmill","A rotating circular saw cuts a log on a compact slatted bench.",WOOD,(p,C,t,o)=>{
  bench(p,C,37,13);
  for(const x of [-12,-4,4,12]) p.line(x,-14,x+5,-19,C[1]);
  p.poly([[-6,-14],[6,-14],[10,-18],[-2,-18]],C[0]);
  saw(p,1,-19,8,STEEL,t);
  const x = -13 + Math.round(2*wave(t));
  p.beam(x,-15,12,-15,6,C[2]);
  p.line(x,-17,12,-17,C[4]);
  round(p,x,-15,3,3,C);
  p.px(x,-15,C[1]);
  if(o.active) for(let i=0;i<4;i++) {
    const u=(t+i/4)%1;
    p.dot(1+u*11,-17-u*6,GOLD[4],Math.sin(u*Math.PI)*0.7);
  }
});

export const lumberMill = machine("Lumber mill","A roofed timber frame with a reciprocating blade, feed rollers and stacked planks.",WOOD,(p,C,t)=>{
  plinth(p,C,43,6);
  for(const x of [-17,15]) post(p,x,-4,29,C);
  p.poly([[-23,-33],[3,-43],[25,-34],[17,-28],[-18,-28]],C[0]);
  p.poly([[-21,-33],[3,-42],[23,-34],[16,-30],[-17,-30]],C[2]);
  p.line(-21,-33,3,-42,C[4]);
  for(const x of [-12,-4,4,12]) p.ellipse(x,-11,4,2.3,STEEL[1]);
  const stroke = Math.round(3*wave(t,2));
  p.rect(-3,-29+stroke,5,16,STEEL[3]);
  for(let y=-27;y<-15;y+=3) p.line(-4,y+stroke,-3,y+stroke+1,STEEL[4]);
  for(let i=0;i<3;i++) p.line(0,-7-i*2,21,-7-i*2,C[i+2]);
  p.line(-15,-12,-4,-11,C[4]);
});

export const stoneCutter = machine("Stone cutter","A guided cutting blade crosses a pale stone block on a masonry bed.",STEEL,(p,C,t)=>{
  plinth(p,C,39,7);
  box(p,-17,-7,14,9,4,C);
  box(p,-15,-17,24,5,4,C);
  p.line(-12,-20,12,-20,C[4]);
  const x=3+Math.round(7*wave(t));
  p.rect(x-3,-18,7,7,C[1]);
  saw(p,x,-11,5,C,t);
  box(p,5,-1,12,6,2,CREAM);
  p.line(10,-6,10,-2,CREAM[1]);
  p.line(13,-6,13,-2,CREAM[1]);
});

export const crusher = machine("Crusher","A heavy jaw press opens over a stone hopper and a short discharge chute.",INDUSTRIAL,(p,C,t,o)=>{
  plinth(p,C,36,7);
  box(p,-16,-7,29,23,5,C);
  p.poly([[-20,-28],[-15,-33],[17,-33],[22,-28],[16,-23],[-15,-23]],C[1]);
  p.poly([[-16,-28],[-12,-31],[15,-31],[18,-28],[14,-25],[-14,-25]],C[0]);
  p.rect(-11,-24,21,15,C[0]);
  const jaw=4+Math.round(wave(t,2)*3);
  for(const x of [-8,-2,4]) {
    p.tri(x,-22,x+2,-22+jaw,x+4,-22,C[3]);
    p.tri(x,-10,x+2,-13,x+4,-10,C[2]);
  }
  p.poly([[-7,-9],[7,-9],[12,-3],[-10,-3]],C[3]);
  boltHeads(p,[[-13,-15],[12,-16]]);
  lamp(p,15,-20,o.active);
});

export const grinder = machine("Grinder","A rotating millstone sits above a flour drawer and a brass feed funnel.",CERAMIC,(p,C,t,o)=>{
  box(p,-16,0,31,13,5,C);
  tankMill(p,C,t);
  p.poly([[-8,-33],[8,-33],[5,-26],[-5,-26]],GOLD[1]);
  p.ellipse(0,-33,8,2.6,GOLD[0]);
  p.ellipse(0,-33,6,1.6,GOLD[3]);
  p.rect(-5,-8,10,6,C[0]);
  p.rect(-4,-4,8,2,CREAM[3]);
  lamp(p,12,-8,o.active);
});

function tankMill(p,C,t) {
  p.ellipse(0,-17,13,6,C[1]);
  p.ellipse(0,-20,13,6,C[0]);
  p.ellipse(0,-21,11.5,4.5,C[3]);
  for(let i=0;i<5;i++){
    const a=TAU*(t+i/5);
    p.line(0,-21,Math.cos(a)*10,-21+Math.sin(a)*4,C[2]);
  }
  p.ellipse(0,-21,3.5,2.5,C[1]);
}

export const loom = machine("Loom","A tall wooden loom pulls a patterned teal cloth under a sliding shuttle.",WOOD,(p,C,t)=>{
  bench(p,C,36,12);
  for(const x of [-15,14]) post(p,x,-8,25,C);
  box(p,-17,-30,34,4,3,C);
  p.rect(-12,-27,24,17,STEEL[0]);
  for(let x=-11;x<=11;x+=3) p.line(x,-28,x,-10,CREAM[3]);
  p.rect(-12,-18,24,9,WATER[1]);
  p.rect(-12,-15,24,4,WATER[3]);
  for(let x=-10;x<12;x+=5) p.px(x,-13,GOLD[4]);
  const shuttle=Math.round(8*wave(t));
  p.beam(shuttle-3,-22,shuttle+3,-22,3,GOLD[2]);
  p.line(shuttle-2,-23,shuttle+2,-23,GOLD[4]);
});

export const sewingStation = machine("Sewing station","A treadle sewing machine stitches bright fabric on a narrow table.",VIOLET,(p,C,t,o)=>{
  bench(p,WOOD,37,13);
  p.rect(-9,-22,18,9,C[0]);
  p.rect(-8,-22,15,4,C[2]);
  p.rect(5,-24,7,13,C[0]);
  p.line(6,-23,8,-23,C[4]);
  p.line(7,-21,7,-13,C[3]);
  p.rect(-13,-15,11,3,RED[3]);
  p.line(-9,-18,-9,-15+Math.round(wave(t,3)*2),STEEL[4]);
  p.rect(1,-26,4,4,GOLD[2]);
  p.line(1,-26,4,-26,GOLD[4]);
  lamp(p,13,-10,o.active,C);
  p.line(-8,-4,8,-4+Math.round(wave(t)*2),C[2]);
});

export const spinningWheel = machine("Spinning wheel","A tall spoked wheel drives a small spindle wrapped in cream thread.",BRASS,(p,C,t)=>{
  post(p,-14,0,18,WOOD);
  post(p,14,0,11,WOOD);
  p.beam(-17,-8,17,-6,5,WOOD[2]);
  p.line(-15,-9,17,-7,WOOD[4]);
  wheel(p,-7,-21,12,C,t,8);
  p.beam(9,-13,20,-13,3,WOOD[2]);
  p.ellipse(14,-13,4,2.4,CREAM[3]);
  p.line(-4,-31,17,-15,CREAM[2]);
  p.line(1,-13,17,-12,CREAM[3]);
});

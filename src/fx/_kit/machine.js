import { rand } from "../../core/index.js";
import { asset, CREAM, GOLD, STEEL, WOOD, box, post, round, wave } from "./art.js";
import { groundShadow } from "./sprite.js";

export const BRASS = ["#3c3340","#73503e","#a57445","#ceaa62","#f0d790"];
export const INDUSTRIAL = ["#273945","#3c5660","#57767b","#83a39f","#c3d2b6"];
export const CERAMIC = ["#4a3645","#795248","#a17259","#cd9976","#ebc4a0"];
export const COPPER = ["#432e40","#704649","#a46351","#d18c64","#f3bf8c"];
export const COAL = ["#302938","#4a3d50","#655566","#8a7481","#b79d9e"];

export function machine(name, desc, palette, draw, { size = [64,64], origin = [size[0]/2,size[1]-12], moving = true } = {}) {
  return asset({
    name, desc, tags: ["machine", "station", name.toLowerCase()], size, origin, palette,
    duration: moving ? 2 : 1, fps: moving ? 12 : 1, options: moving ? { active: true } : {},
  }, (p, phase, C, o) => {
    groundShadow(p, 0, 0, Math.min(size[0]/2-4, 22), 4.6);
    draw(p, C, o.active ? phase : 0, o);
  });
}

export function bench(p, C, w = 34, h = 12) {
  post(p,-w/2+3,0,h,C);
  post(p,w/2-3,0,h,C);
  p.line(-w/2+4,-4,w/2-4,-4,C[1]);
  box(p,-w/2,-h+3,w,4,6,C);
}

export function plinth(p, C, w = 36, h = 5) {
  box(p,-w/2,0,w,h,5,C);
  p.line(-w/2+2,-3,w/2-3,-3,C[3]);
}

export function vent(p,x,y,w,h,C) {
  p.rect(x,y,w,h,C[0]);
  p.line(x+1,y+1,x+w-2,y+1,C[2]);
  for (let dx = 2; dx < w-1; dx += 3) p.line(x+dx,y+2,x+dx,y+h-2,C[1]);
}

export function boltHeads(p, points, C = STEEL) {
  for (const [x,y] of points) {
    p.px(x,y,C[0]);
    p.px(x,y-1,C[4]);
  }
}

export function lamp(p,x,y,active,C = GOLD) {
  p.rect(x-2,y-2,5,5,C[0]);
  p.rect(x-1,y-1,3,3,C[active ? 3 : 1]);
  p.px(x-1,y-1,C[active ? 4 : 2]);
  if (active) p.glow(x,y,4,C[3],0.28);
}

export function hot(p,x,y,w,h,phase,active) {
  p.rect(x,y,w,h,STEEL[0]);
  p.rect(x+1,y+h-2,w-2,1,WOOD[1]);
  if (!active) return;
  p.rect(x+1,y+h-4,w-2,3,GOLD[1]);
  for (let i = 0; i < 3; i++) {
    const xx = x+(i+1)*w/4, yy = y+h-3;
    const rise = 2+Math.round((1+wave(phase,3,i/4))*(h-4)*0.28);
    p.tri(xx-3,yy,xx+1,yy-rise,xx+3,yy+1,GOLD[i+2]);
  }
  p.glow(x+w/2,y+h/2,Math.max(4,w/2),GOLD[3],0.45);
}

export function exhaust(p,x,y,w,h,C = STEEL) {
  p.rect(x,y,w,h,C[1]);
  p.line(x+1,y+1,x+1,y+h-1,C[3]);
  p.rect(x-1,y,w+2,3,C[0]);
  p.line(x,y,x+w-1,y,C[4]);
}

export function vapor(p,x,y,phase,seed,C = CREAM,count = 4) {
  for (let i = 0; i < count; i++) {
    const u = (phase + i/count) % 1;
    const dx = 3*wave(phase,1,rand(i,8,seed))*u;
    p.disc(x+dx,y-u*11,1+u*2,C[3],Math.sin(u*Math.PI)*0.37);
  }
}

export function tank(p,x,y,w,h,C) {
  p.rect(x-w,y-h,2*w,h,C[0]);
  p.rect(x-w+1,y-h,2*w-2,h-1,C[2]);
  p.rect(x-w+2,y-h,2,h-1,C[3]);
  p.ellipse(x,y-h,w,3,C[0]);
  p.ellipse(x-0.5,y-h-0.5,w-1.5,2,C[3]);
  p.line(x-w+3,y-h-1,x-1,y-h-2,C[4]);
  p.line(x-w,y-4,x+w-1,y-4,C[1]);
}

export function wheel(p,x,y,r,C,phase,spokes = 6) {
  p.circle(x,y,r,C[0]);
  p.circle(x,y,r-1,C[3]);
  p.circle(x,y,r-2,C[0]);
  for (let i = 0; i < spokes; i++) {
    const a = (phase+i/spokes)*Math.PI*2;
    p.line(x,y,x+Math.cos(a)*(r-1),y+Math.sin(a)*(r-1),C[2]);
  }
  p.circle(x,y,Math.max(2,r/4),C[1]);
  p.px(x-1,y-1,C[4]);
}

export function soilCrop(p,x,y,C,size = 1) {
  p.line(x,y,x,y-6*size,C[3]);
  p.tri(x,y-1,x-4*size,y-6*size,x,y-4*size,C[2]);
  p.tri(x,y-2,x+4*size,y-7*size,x+2*size,y-6*size,C[3]);
  p.px(x+2*size,y-6*size,C[4]);
}

export function coin(p,x,y,phase) {
  round(p,x,y,1.3+2.6*Math.abs(wave(phase)),3.1,GOLD);
  p.px(x-1,y-1,GOLD[4]);
}

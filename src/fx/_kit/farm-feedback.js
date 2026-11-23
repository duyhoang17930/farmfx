import { ease, rand, seg } from "../../core/index.js";
import { asset, round, wave } from "./art.js";
import { toss } from "./creature.js";
import { twinkle } from "./sprite.js";

export function burst(name,desc,tag,C,duration,paint,options={}){
  return asset({name,desc,tags:["feedback",tag],size:[48,48],origin:[24,33],duration,fps:24,loop:false,palette:C,options},
    (p,u,P,o)=>{if(u>=0&&u<1)paint(p,u,P,o);});
}

export function chips(p,u,C,o,count,kind){
  for(let i=0;i<count;i++){
    const start=rand(i,11,o.seed)*0.12, age=Math.max(0,u-start);
    if(u<start)continue;
    const side=rand(i,2,o.seed)<.54?-1:1, speed=0.5+rand(i,3,o.seed)*0.5;
    const y0=-3-rand(i,9,o.seed)*3, floor=-4+rand(i,13,o.seed)*6;
    const g=toss(0,y0,side*speed*43,-12-speed*29,age,240,floor);
    const fade=(1-seg(u,.52,.92))*(g.landed?1-seg(age-g.at,.03,.28):1);
    if(kind==="wood"){
      const dx=g.landed?1:Math.round(wave(age,3,i*.3)*1.65);
      p.line(g.x,g.y,g.x+dx,g.y+1,C[2+i%2],fade);
      p.dot(g.x-0.6,g.y,C[4],fade);
    }else{
      p.dot(g.x,g.y,C[4],fade);p.dot(g.x+1,g.y+1,C[2],fade);
    }
  }
}

export function glints(p,u,C,o,n=6){
  for(let i=0;i<n;i++){
    const delay=rand(i,4,o.seed)*.19,k=seg(u,delay,0.83+delay*.6);
    if(k<=0||k>=1)continue;
    const a=i*2.399,oR=2+(4+9*rand(i,7,o.seed))*ease.outCubic(k);
    const x=Math.cos(a)*oR,y=-11+Math.sin(a)*oR*.64-4*k;
    const life=Math.sin(Math.PI*k);
    twinkle(p,x,y,(i%3===0?3.4:1.85)*life,C[2],C[4]);
    if(i%3===0)p.glow(x,y,4,C[3],life*.35);
  }
}

export function puff(p,u,C,o,n=7){
  for(let i=0;i<n;i++){
    const delay=0.14*rand(i,1,o.seed);
    if(u<delay)continue;
    const k=seg(u,delay,0.84+delay),a=i*2.399;
    const x=Math.cos(a)*ease.outCubic(k)*(4+rand(i,4,o.seed)*10),y=-1+Math.sin(a)*k*4-k*5;
    const strength=0.46*Math.sin(Math.PI*k)**0.8;
    p.disc(x,y,1.5+3*k,C[2],strength);
    p.disc(x-.55,y-1,1+2*k,C[4],strength*.74);
  }
}

export function weather(name,desc,palette,paint,{size=[96,64],duration=3,bg="field",options={}}={}){
  const [w,h]=size;
  return asset({name,desc,tags:["weather","environment",name.toLowerCase()],size,origin:[w/2,h/2],palette,duration,bg,fps:18,options},
    (p,ph,C,o)=>paint(p,ph,C,o,w/2,h/2));
}

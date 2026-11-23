import { asset, round } from "./art.js";
import { livestock, coat, leg } from "./livestock.js";

const builds = {
  pig:   { body:[10.5,6.4], leg:4, head:[5,4.6],  ear:[2.6,3.3], tail:"curl", face:"snout" },
  goat:  { body:[9.5,5.7],  leg:7, head:[4.1,4.8],ear:[3.6,1.8], tail:"stub", face:"horns" },
  horse: { body:[12,6.6],   leg:9, head:[4.2,7],  ear:[1.6,3.3], tail:"mane", face:"mane" },
  cat:   { body:[7.5,4.6],  leg:4, head:[4.4,4.3],ear:[1.75,3], tail:"high", face:"whiskers" },
  dog:   { body:[8.5,5.1],  leg:5, head:[4.8,4.5],ear:[2.2,3.2], tail:"wag", face:"nose" },
};
function drawTail(g,x,y,R,C,M,kind) {
  if (kind==="curl") {
    g.line(x,y,x-3,y-2+R.tail/2,M[2]);g.ellipse(x-3,y-2+R.tail/2,1.6,1.25,M[3]);g.set(x-3,y-2+R.tail/2,C[1]);
  } else if (kind==="mane") {
    g.tube([[x,y],[x-2,y+3],[x-3+R.tail,y+9]],u=>1.6-u*.7,M[1]);
    g.line(x-1,y,x-3+R.tail,y+7,M[3]);
  } else {
    const h=kind==="high"?8:kind==="wag"?4:2;
    g.tube([[x,y],[x-2,y-h*.45],[x-4,y-h+R.tail*.5]],u=>1.22-u*.42,kind==="wag"?M[2]:C[2]);
    g.set(x-4,y-h+R.tail*.5,M[3]);
  }
}
function drawHead(g, x,y,s,R,C,M,b,back=false) {
  const [rx,ry]=b.head,[ew,eh]=b.ear;
  const ears=s?[[-rx*.65,-ry*.72],[rx*.25,-ry*.73]]:[[-rx*.8,-ry*.7],[rx*.8,-ry*.7]];
  for(const [dx,dy] of ears){
    if(b.face==="nose") {
      g.ellipse(x+dx,y+dy+2,ew,eh+1,M[1]);g.ellipse(x+dx-.4,y+dy+1,ew*.62,eh*.68,M[3]);
    } else {
      g.poly([[x+dx-ew,y+dy+eh],[x+dx-ew*.4,y+dy-eh],[x+dx+ew*.8,y+dy+eh*.55]],C[1]);
      g.line(x+dx-.6,y+dy-eh*.52,x+dx+ew*.25,y+dy+eh*.55,M[3]);
    }
  }
  coat(g,x,y,rx,ry,C,Number(back));
  if(b.face==="horns"){
    for(const d of [-1,1]){
      g.tube([[x+d*2,y-4],[x+d*3,y-7],[x+d*2,y-9]],0.8,M[3]);
      if(!back)g.line(x+d*2,y-6,x+d*3,y-7,M[4]);
    }
    if(!back)g.poly([[x-2,y+ry-1],[x+2,y+ry-1],[x+1,y+ry+3]],C[1]);
  }
  if(b.face==="mane"){
    g.tube([[x-2,y-ry],[x-3,y-ry*.6],[x-2,y-1]],1.2,M[1]);
    g.line(x-2,y-ry+1,x-3,y-ry*.6,M[3]);
  }
  if(back)return;
  const mx=x+(s?rx*.61:0),my=y+ry*.55;
  const muzzle=b.face==="snout"?[4,2.6]:b.face==="mane"?[3,2.9]:[2.7,1.85];
  g.ellipse(mx,my,...muzzle,b.face==="snout"?M[3]:M[2]);
  if(b.face==="snout")for(const dx of [-1,1])g.set(mx+dx,my-.55,M[0]);
  else g.set(mx+(s?1:0),my-.35,M[0]);
  if(b.face==="whiskers"){
    g.line(mx-2,my,mx-5,my-.6,M[4]);g.line(mx+2,my,mx+5,my-.6,M[4]);
  }
  for(const d of s?[1]:[-1,1]){
    const ex=x+d*rx*.54,ey=y-ry*.22;
    g.line(ex,ey,ex+(R.blink?1:0),ey+Number(!R.blink),M[0]);
    if(!R.blink)g.set(ex,ey,C[4]);
  }
}
export function quadruped(id,name,desc,palette,marking) {
  const b=builds[id], [bodyWidth,bodyHeight]=b.body;
  return livestock({name,desc,tags:[id,"animal"],size:[48,48],origin:[24,38],palette,marking,
    shadow:[bodyWidth*.83,bodyWidth+4,2.7],drawAnimal(g,f,R,C,M){
      const side=f!=="up"&&f!=="down",back=f==="up",x=side?-2:0;
      const y=-bodyHeight-b.leg+R.bob, width=side?bodyWidth:bodyWidth*.77, dx=width*.54;
      const headX=side?width*.74:0,headY=y+(back?-bodyHeight-3:side?-bodyHeight+1:1)+Math.round(R.graze*(side?5:2));
      for(const d of [-1,1])leg(g,x+d*dx,y+2,x+d*(dx+R.stride),-3-d*R.heel,1.2,C,M,true);
      if(side)drawTail(g,x-width+1,y-2,R,C,M,b.tail);
      if(back)drawHead(g,headX,headY,side,R,C,M,b,true);
      if(id==="horse"&&side)g.tube([[4,y],[6,y-5],[headX,headY]],3.5,C[2]);
      coat(g,x,y,width,side?bodyHeight:bodyHeight+2,C);
      if(id==="cat")for(const off of [-5,-2,1])g.line(x+off,y-3,x+off+2,y,M[2]);
      if(id==="dog")g.ellipse(x-4,y-1,width*.32,bodyHeight*.48,M[2]);
      if(id==="goat")g.line(x-4,y-3,x+2,y-4,C[4]);
      for(const d of [-1,1])leg(g,x+d*dx,y+bodyHeight*.65,x+d*(dx-R.stride),-Math.max(0,d*R.heel),1.4,C,M);
      if(back)drawTail(g,0,y+1,R,C,M,b.tail);
      else drawHead(g,headX,headY,side,R,C,M,b);
    }});
}

export function smallAnimal(name,desc,id,palette,draw,options={}){
  return asset({name,desc,tags:["animal","wildlife",id],size:[48,48],origin:[24,37],palette,duration:2.4,options},
    (p,ph,C,o)=>draw(p,ph,C,o));
}

import { fit, rand, TAU } from "../../core/index.js";
import { asset, CREAM, GOLD, LEAF, RED, VIOLET, WATER, WOOD, wave } from "./art.js";
const styles={
 rain:"light-rain heavy-rain thunderstorm", lightning:"lightning-flash",
 fog:"fog morning-mist cloud-shadow", storms:"sandstorm blizzard strong-wind wind-gust",
 clouds:"drifting-clouds", rays:"sun-rays moonlight", dawn:"sunset sunrise",
 stars:"starry-night aurora meteor-shower", dust:"falling-ash volcanic-smoke pollen floating-dust floating-embers", rainbow:"rainbow",
};
function skyColor(id,kind){
  if(/ash|volcanic|embers|sunset/.test(id))return RED;
  if(/sand|pollen|sunrise|sun-rays|dust/.test(id))return GOLD;
  if(/snow|blizzard|morning/.test(id))return CREAM;
  if(kind==="stars"||kind==="fog")return VIOLET;
  if(id==="strong-wind"||id==="wind-gust")return LEAF;
  return WATER;
}
export function extraWeather(id){
  const kind=Object.keys(styles).find(k=>styles[k].split(" ").includes(id));
  const loop=!["lightning","dawn"].includes(kind)&&id!=="wind-gust";
  const intensity=id.includes("heavy")||id==="thunderstorm"||id==="sandstorm"||id==="blizzard"?1.55:id==="light-rain"?0.56:1;
  return asset({name:id.replaceAll("-"," "),desc:`A seeded, adjustable ${id.replaceAll("-"," ")} weather layer.`,
    tags:["weather",kind],size:[160,112],origin:[80,56],palette:skyColor(id,kind),duration:loop?5:1.65,fps:15,loop,bg:"sky",
    options:{intensity}},(p,t,C,o)=>{
    if(t>=1&&!loop)return;
    const fade=loop?1:Math.sin(Math.PI*t), count=Math.round(Math.max(1,Math.min(3,o.intensity))*26);
    if(kind==="rain"||kind==="storms"||kind==="dust"){
      const rain=kind==="rain", drift=kind==="storms";
      for(let i=0;i<count;i++){
        const u=(rand(i,8,o.seed)+t*(rain?3:drift?2:1))%1;
        const len=rain?4+rand(i,2,o.seed)*6:drift?2+rand(i,2,o.seed)*6:2;
        const x=((rand(i,3,o.seed)+u*(drift?.8:.16))%1)*144-72;
        const y=rain?-48+u*90:drift?(rand(i,4,o.seed)-.5)*92+3*wave(u):-45+u*91;
        const a=fade*Math.sin(u*Math.PI)*0.65;
        if(rain)p.line(x,y,x-4,y+len,C[3+i%2],a);
        else if(drift)p.line(x-len,y,x+len,y+1,C[2+i%3],a);
        else if(id.includes("smoke"))p.disc(x,y,3+u*3,C[1],a*.42);
        else{p.dot(x,y,C[3+i%2],a);if(id.includes("embers"))p.glow(x,y,3,C[4],a*.32);}
      }
      if(id==="thunderstorm"){
        const flash=Math.max(0,1-Math.abs(t-.37)/.04);
        p.rect(-79,-55,158,110,C[4],flash*.35);
      }
    }else if(kind==="fog"||kind==="clouds"){
      for(let i=0;i<13;i++){
        const u=(t+rand(i,11,o.seed))%1,x=-62+u*124;
        const y=(rand(i,5,o.seed)-.5)*69;
        p.disc(x,y,8+rand(i,3,o.seed)*9,id==="cloud-shadow"?C[0]:C[i%2+2],Math.sin(u*Math.PI)*(kind==="fog"?.24:.42));
      }
    }else if(kind==="lightning"){
      const flash=Math.max(0,Math.sin(Math.PI*t)**8);
      p.rect(-79,-55,158,110,C[4],flash*.38);
      const points=[[-25,-52],[-19,-31],[-30,-15],[-7,1],[-13,18],[12,43]];
      p.polyline(points,C[4],flash);p.glowLine(-20,-32,-9,12,14,C[3],flash*.63);
    }else if(kind==="rays"){
      const east=id==="moonlight"?-31:31;
      for(let i=0;i<5;i++){
        const x=east+i*4-10,y=-47,shift=wave(t,1,i/6)*6;
        p.tri(x,y,x+shift-30+i*7,51,x+shift-16+i*7,51,C[3],0.10+i*.015);
      }
      p.glow(east,-38,14,C[4],0.33);
    }else if(kind==="dawn"){
      const sign=id==="sunset"?1:-1,y=10+sign*29*(t-.5);
      for(let i=0;i<6;i++)p.rect(-79,27+i*4,158,4,C[1+i%3],fade*(.48-i*.04));
      p.circle(0,y,14,C[3],fade);p.circle(0,y-1,12,C[4],fade);p.glow(0,y,19,C[3],fade*.33);
    }else if(kind==="stars"){
      for(let i=0;i<38;i++){
        const x=(rand(i,3,o.seed)-.5)*147,y=(rand(i,9,o.seed)-.5)*90,a=.23+Math.max(0,wave(t,1,i/38))*.75;
        p.dot(x,y,C[4],a);
      }
      if(id==="aurora")for(let x=-68;x<68;x++){
        const y=-22+8*Math.sin(x/18+t*TAU);p.line(x,y,x,y+8+wave(t)*3,LEAF[3],.29);
      }
      if(id==="meteor-shower")for(let i=0;i<5;i++){
        const u=(t+i/5)%1,x=65-u*119,y=-42+u*65;
        const a=Math.sin(u*Math.PI);p.line(x-4,y+3,x+9,y-7,C[4],a);p.glow(x,y,4,GOLD[3],a*.31);
      }
    }else{
      for(const [i,name] of [RED,GOLD,LEAF,WATER,VIOLET].entries())
        p.arc(0,27,42-i*3,2.7,Math.PI,TAU,fit(name,5)[3],.5+.16*wave(t));
    }
  });
}

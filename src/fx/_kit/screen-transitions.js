import { clamp, ease, rand, seg } from "../../core/index.js";
import { asset, GOLD, LEAF, RED, STEEL, VIOLET, WATER } from "./art.js";

const families={
  fade:"fade-in fade-out crossfade day-transition night-transition",
  dissolve:"pixel-dissolve season-transition biome-transition island-unlock-transition",
  wipe:"pixel-wipe",
  iris:"circle-open circle-close dungeon-enter dungeon-exit player-death player-respawn",
  flash:"teleport-transition boss-introduction boss-defeated",
};
function screenColor(id){
  if(/teleport|night|biome/.test(id))return VIOLET;
  if(/day|defeated|season/.test(id))return GOLD;
  if(/death|introduction/.test(id))return RED;
  if(id.includes("island"))return LEAF;
  if(id.includes("respawn"))return WATER;
  return STEEL;
}

export function screenTransition(id){
  const type=Object.keys(families).find(key=>families[key].split(" ").includes(id));
  const opening=/fade-in|circle-open|dungeon-exit|player-respawn/.test(id);
  const closing=/fade-out|circle-close|dungeon-enter|player-death/.test(id);
  const max=1.6, width=160,height=96;
  const fx=asset({name:id.replaceAll("-"," "),desc:`A pixel-art ${id.replaceAll("-"," ")} transition with a midpoint scene-swap cue.`,
    tags:["transition","screen",type],size:[width,height],origin:[width/2,height/2],palette:screenColor(id),
    loop:false,duration:max,fps:20,bg:"dark",options:{focusX:0,focusY:0,text:id.includes("boss")?id.replaceAll("-"," ").toUpperCase():""}},(p,t,C,o)=>{
    if(t>=1)return;
    const amount=opening?1-ease.inOutCubic(t):closing?ease.inOutCubic(t):
      t<.5?ease.inOutCubic(t*2):ease.inOutCubic((1-t)*2);
    const cx=clamp(o.focusX,-60,60),cy=clamp(o.focusY,-35,35);
    if(type==="iris"){
      const range=Math.hypot(width/2+Math.abs(cx),height/2+Math.abs(cy))+1;
      const r=range*(1-amount);
      p.shade(-80,-48,80,48,(x,y,v)=>{
        if(x>=80||y>=48)return;
        const d=Math.hypot(x-cx,y-cy);
        if(d<r)return;
        v.a=Math.min(1,amount*3);
        return d<r+1.3&&r>1?C[3]:C[0];
      });
    }else if(type==="dissolve"||type==="wipe"){
      for(let row=0;row<16;row++)for(let col=0;col<27;col++){
        const r=type==="wipe"?clamp((col+row*.3)/30):rand(col,row,o.seed);
        if(r>amount)continue;
        const x=col*6-80,y=row*6-48;
        p.rect(x,y,Math.min(6,80-x),6,r>amount-.14?C[3]:C[0],type==="wipe"?1:.95);
      }
    }else{
      p.rect(-80,-48,160,96,type==="flash"?C[3]:C[0],amount);
      if(type==="flash"||id==="crossfade")p.rect(-80,-48,160,96,C[4],Math.max(0,1-Math.abs(t-.5)*6)**2*.7);
      if(type==="flash"&&o.text)p.text(String(o.text).slice(0,19),0,-5,C[4],{align:"center",a:1-seg(Math.abs(t-.5),.12,.45)});
    }
  });
  return {...fx,meta:{...fx.meta,omitTerminalFrame:true,events:{sceneSwap:opening?0:closing?max:max/2,completion:max}}};
}

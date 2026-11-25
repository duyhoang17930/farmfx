import { ease, rand, seg, TAU } from "../../core/index.js";
import { asset, CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, round, wave } from "./art.js";
import { chips, glints, puff } from "./farm-feedback.js";
import { twinkle } from "./sprite.js";
import { icon } from "./farm-ui.js";

const variants={
  impact:"resource-hit resource-break tree-shake tree-fall-dust falling-leaf-burst rock-break ore-break crystal-break construction-dust building-demolish",
  crack:"resource-crack",
  appear:"resource-spawn resource-respawn build-complete building-upgrade build-placement crop-growth crop-wither crop-harvest",
  pickup:"item-drop item-bounce item-magnet item-collect rare-item-drop legendary-item-drop coin-drop coin-burst coin-collect experience-drop experience-collect animal-product-drop",
  flash:"level-up skill-unlock achievement-unlock recipe-unlock blueprint-unlock crafting-complete fertilizer-sparkle animal-heart animal-feed heal energy-restore buff-activate buff-expire confetti",
  progress:"crafting-start crafting-progress",
  sparks:"smelting-sparks welding-sparks electric-spark power-pulse",
  heat:"machine-steam machine-smoke machine-overheat",
  preview:"build-preview",
  portal:"teleport-in teleport-out portal-swirl",
  water:"fishing-ripple fishing-bite fishing-catch water-ripple swimming-splash",
  warning:"hunger-warning low-energy-warning floating-text screen-flash",
  trail:"dash-trail speed-trail",
  shadow:"player-shadow", glow:"item-glow",
};
const loops=new Set(["build-preview","crafting-progress","machine-steam","machine-smoke","machine-overheat","portal-swirl","item-glow","player-shadow"]);
const feedback={
 "resource-break":[8,1],"rock-break":[11,1.12],"ore-break":[13,.92],"building-demolish":[15,1.27],
 "resource-spawn":[6,1],"resource-respawn":[9,.86],"build-placement":[5,.75],"build-complete":[8,1.13],"building-upgrade":[12,1.23],
 "crop-growth":[7,.75],"crop-harvest":[12,1.10],"tree-shake":[6,.86],"falling-leaf-burst":[13,1.12],
 "skill-unlock":[12,.95],"recipe-unlock":[7,1.0],"blueprint-unlock":[10,1.1],"buff-expire":[4,.63],
 "achievement-unlock":[13,1.11],"crafting-complete":[9,.98],"animal-feed":[6,.68],
 "welding-sparks":[13,1.1],"electric-spark":[9,.8],"power-pulse":[8,1.2],
 "fishing-ripple":[7,.85],"water-ripple":[10,1],"fishing-bite":[8,.75],"fishing-catch":[12,1.06],
};
function palette(id){
  if(/leaf|crop|grow|fertiliz|heal|wood|tree/.test(id))return /wither/.test(id)?WOOD:LEAF;
  if(/water|fish|steam|energ|crystal|speed/.test(id))return WATER;
  if(/portal|teleport|rare|skill|recipe|blueprint|buff|experience/.test(id))return VIOLET;
  if(/smelt|overheat|hunger|warning|heart/.test(id))return RED;
  if(/ore|break|rock|resource|build/.test(id))return STEEL;
  return GOLD;
}
export function gameplayEffect(id){
  const kind=Object.keys(variants).find(k=>variants[k].split(" ").includes(id));
  const loop=loops.has(id), duration=loop?2:1.15;
  const wide=id==="screen-flash"?[320,180]:[80,64];
  const origin=id==="screen-flash"?[160,90]:[40,46];
  const fx=asset({name:id.replaceAll("-"," "),desc:`A pixel-art ${id.replaceAll("-"," ")} effect with configurable color and seed.`,
    tags:["gameplay",kind],size:wide,origin,palette:palette(id),bg:id==="screen-flash"?"dark":"field",duration,fps:20,loop,
    options:{...(kind==="progress"?{value:-1}:{}),...(id==="floating-text"?{text:"READY"}:{})}},(p,t,C,o)=>{
    if(!loop&&t>=1)return;
    const fade=loop?1:1-seg(t,.64,.97), bump=Math.sin(Math.PI*t), strength=/legendary|level-up|demolish|confetti|burst/.test(id)?1.4:1;
    const [count,scale]=feedback[id]??[8,1];
    if(kind==="impact"||kind==="crack"){
      const tree=/tree|leaf/.test(id);
      if(kind==="impact") {chips(p,t,C,o,count,tree?"wood":"stone");if(/dust|break|demolish/.test(id))puff(p,t,C,o,Math.round(6*scale));}
      p.polyline([[-12,0],[-5,-3],[2,0],[7,-5],[12,-3]],C[4],fade*.85);
      p.line(-1,-1,-4,-8,C[3],fade);
    }else if(kind==="appear"){
      const r=6+ease.outCubic(t)*20*scale;
      p.ellipse(0,-2,r,r*.29,C[3],fade*.9);p.ellipse(0,-2,r*.7,r*.2,C[1],fade*.65);
      for(let i=0;i<6;i++){const a=i*TAU/6;p.line(Math.cos(a)*r,-2+Math.sin(a)*r*.29,Math.cos(a)*r,-7+Math.sin(a)*r*.29,C[4],fade);}
      glints(p,t,C,o,count);
    }else if(kind==="pickup"){
      const coin=id.includes("coin"), xp=id.includes("experience"), rising=/collect|magnet/.test(id);
      const y=rising?-6-(id.includes("magnet")?30:23)*ease.outCubic(t):
        -4-Math.abs(Math.sin(t*TAU*(id.includes("bounce")?1.5:1.1)))*16*(1-t);
      const x=id.includes("magnet")?(1-t)**2*20:0;
      const hold=coin?"coin":xp?"experience-orb":id.includes("animal")?"egg":"wood";
      if(fade>.1)icon(p,hold,x,y,t);
      glints(p,t,C,o,Math.round(5*strength));
      if(coin&&id.includes("burst"))for(let i=0;i<5;i++)p.dot((i-2)*t*13,y-3+rand(i,8,o.seed)*4,C[4],fade);
      if(/rare|legendary/.test(id))p.glow(0,y,14,C[3],fade*.3);
    }else if(kind==="flash"||kind==="sparks"){
      glints(p,t,C,o,Math.round(count*strength));
      if(kind==="sparks"||/confetti|activate/.test(id))for(let i=0;i<count+4;i++){
        const a=rand(i,5,o.seed)*TAU,d=ease.outQuad(t)*(10+rand(i,9,o.seed)*20)*scale;
        const x=Math.max(-36,Math.min(36,Math.cos(a)*d));
        const y=Math.min(15,-11+Math.sin(a)*d*.65+8*t*t);
        p.line(x,y,x+Math.cos(a)*3,y+Math.sin(a)*2,C[2+i%3],fade);
      }
      if(id.includes("heart")||id==="heal")p.poly([[-7,-16],[-4,-19],[0,-16],[4,-19],[7,-16],[0,-8]],C[3],fade);
    }else if(kind==="progress"){
      const val=o.value<0?(loop?.5-.5*wave(t,1,.25):t):o.value;
      p.rect(-25,-19,50,10,C[0],fade);p.rect(-24,-18,48,8,C[1],fade);
      p.rect(-22,-16,Math.max(0,Math.min(44,val*44)),4,C[3],fade);
      p.px(-22+Math.min(43,val*44),-15,C[4]);
    }else if(kind==="heat"){
      for(let i=0;i<7;i++){
        const u=(t+i/7)%1,x=(rand(i,6,o.seed)-.5)*16+u*7,y=-7-u*28;
        p.disc(x,y,2+u*5,C[2],Math.sin(u*Math.PI)*.35);
        p.blend(x-1,y-1,C[4],Math.sin(u*Math.PI)*.22);
      }
    }else if(kind==="preview"){
      p.polyline([[-20,-7],[0,-19],[20,-7],[0,5],[-20,-7]],C[4],.74);
      for(const x of [-19,19])p.line(x,-8,x,-27,C[3],.49);
      p.line(-19,-27,0,-39,C[3],.49);
    }else if(kind==="portal"||kind==="glow"){
      const r=11+(loop?2*wave(t):ease.outCubic(id==="teleport-out"?1-t:t)*10);
      p.ellipse(0,-12,r,r*.65,C[2],fade*.37);
      for(let i=0;i<5;i++){const a=(t+i/5)*TAU;twinkle(p,Math.cos(a)*r,-12+Math.sin(a)*r*.65,1.9*fade,C[3],C[4]);}
      p.glow(0,-12,r,C[3],.29*fade);
    }else if(kind==="water"){
      const r=4+ease.outCubic(t)*22*scale;
      for(let i=0;i<count;i++){
        const a=i*TAU/count,x=Math.cos(a)*r,y=Math.sin(a)*r*.35;
        p.line(x,y,x*.9,y*.9,C[4],fade);
        if(/catch|bite|splash/.test(id))p.dot(x,y-bump*(5+i%4),C[3],fade);
      }
    }else if(kind==="warning"){
      if(id==="screen-flash")p.rect(-160,-90,320,180,C[4],bump*.65);
      else if(id==="floating-text")p.text(o.text,-22,-14-t*12,C[4],{a:fade});
      else{p.tri(-12,-8,0,-31,12,-8,C[2],fade);p.line(0,-24,0,-16,C[4],fade);p.dot(0,-13,C[4],fade);}
    }else if(kind==="trail"){
      for(let i=0;i<6;i++)p.line(-35+i*3,-10+i*3,-9+i*4+10*t,-10+i*3,C[2+i%2],fade*(.3+.6*bump));
    }else p.blend(0,-2,C[0],.36),p.ellipse(0,0,8,3,C[0],.49);
  });
  return {...fx,meta:{...fx.meta,...(loop?{}:{events:{completion:duration}})}};
}

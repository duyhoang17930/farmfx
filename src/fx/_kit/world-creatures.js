import { ease, fit, rand, TAU } from "../../core/index.js";
import { CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, round, wave } from "./art.js";
import { groundShadow, Layer, twinkle } from "./sprite.js";

const palettes={green:LEAF,blue:WATER,red:RED,poison:["#36434a","#4b6652","#719557","#a8bb62","#e7df93"],
  crystal:["#38445f","#526c99","#719cbe","#aae0dd","#eff4dc"],bone:CREAM,ghost:VIOLET,stone:STEEL,fire:RED,
  ice:WATER,lightning:GOLD,wood:WOOD,amber:GOLD,pink:RED,dark:["#2d253e","#463651","#644c68","#8b6e8d","#d1a3b7"]};
const layer=new Layer(48,48);
const tails=new Set(["fox","squirrel","raccoon","wolf","snow-wolf","angry-boar","donkey","deer","mini-dragon","frost-dragon","fire-dragon"]);
export function roster(source){
  return Object.fromEntries(source.trim().split(String.fromCharCode(10)).flatMap(line=>{
    const [family,palette,scale,...ids]=line.trim().split(/ +/);
    return ids.map(id=>[id,{family,palette,scale:+scale}]);
  }));
}
function eyes(p,x,y,side,C){
  p.rect(x-4,y-1,2,2,C[0]);p.px(x-4,y-2,C[4]);
  if(!side){p.rect(x+3,y-1,2,2,C[0]);p.px(x+3,y-2,C[4]);}
}
function humanoid(p,id,C,side,back,family,step,beat){
  const stone=family==="golem", skeleton=family==="bone", tall=family==="treant"||family==="demon";
  const w=stone||tall?11:8,y=-23+step-3*beat, head=side*2;
  for(const a of [-1,1]){
    p.beam(a*5,-9,a*(5+step),-2,stone?7:4,C[0]);p.line(a*5,-7,a*(5+step),-3,C[3]);
    p.beam(a*(w-1),-18+step,a*(w+2+4*beat),-8+step,stone?7:4,C[1]);
  }
  p.poly([[-w,-19+step],[w,-19+step],[w-2,-9+step],[3,-6+step],[-w+2,-8+step]],C[0]);
  p.rect(-w+2,-17+step,w*2-4,7,C[skeleton?1:2]);p.line(-w+2,-15+step,w-3,-15+step,C[3]);
  round(p,head,y,stone?9:8,7.5,C);
  if(!back)eyes(p,head,y+1,side,C);
  if(skeleton){p.line(-3,y+4,3,y+4,C[0]);for(let j=-2;j<=2;j+=2)p.px(j,y+5,C[4]);}
  if(family==="folk"||tall)for(const a of [-1,1]){
    p.tri(head+a*5,y-3,head+a*12,y-9,head+a*7,y+1,C[1]);p.line(head+a*6,y-3,head+a*11,y-8,C[3]);
  }
  if(family==="mummy")for(const dy of [-5,-1,3])p.line(-7,y+dy,7,y+dy+1,C[1]);
  if(family==="wizard"||/king|pharaoh|knight/.test(id)){
    p.poly([[-8,y-3],[-6,y-11],[0,y-7],[6,y-11],[8,y-3]],GOLD[2]);p.line(-7,y-4,7,y-4,GOLD[4]);
  }
  if(id.includes("archer")||family==="wizard"){p.arc(13,-11,7,1.8,-1.35,1.25,WOOD[3]);p.line(14,-17,14,-5,CREAM[3]);}
  if(stone||tall)p.polyline([[-5,-13],[1,-15],[4,-13],[1,-10]],family==="treant"?LEAF[3]:C[4]);
}
function creature(p,spec,id,C,phase,state,facing){
  const side=facing==="left"?-1:facing==="right"?1:0,back=facing==="up",wind=wave(phase);
  const step=["move","walk"].includes(state)?Math.round(2*wave(phase,2)):0;
  const beat=state.startsWith("attack")?Math.sin(Math.PI*phase):0;
  const family=spec.family;
  if(family==="slime"){
    const a=Math.round(2*wind+2*beat),y=-8+a,r=12+a;
    p.ellipse(0,y,r,9-a,C[0]);p.ellipse(-0.4,y-1,r-1,8-a,C[2]);p.line(-6,y-4,-1,y-6+a,C[4]);
    p.line(2,y+4,7,y+3,C[1]);if(!back)eyes(p,side*2,y,side,C);
    if(id.includes("crystal"))p.poly([[-2,y-8],[2,y-13],[5,y-7],[2,y-4]],C[4]);
  }else if(["folk","bone","golem","treant","demon","mummy","wizard"].includes(family)){
    humanoid(p,id,C,side,back,family,step,beat);
  }else if(["ghost","elemental","jelly","snail","plant","mimic","mushroom","worm"].includes(family)){
    const y=-16+Math.round(2*wind)-3*beat;
    if(family==="mimic"){
      p.rect(-13,-15,26,16,C[0]);p.rect(-12,-14,24,14,C[2]);p.line(-12,-12,11,-12,C[4]);
      p.rect(-10,-10,20,7+Math.round(4*beat),C[0]);for(let x=-8;x<10;x+=4)p.px(x,-9,CREAM[4]);
      p.rect(-2,-15,4,3,GOLD[3]);
    }else if(family==="snail"){
      round(p,-3,-11,9,8,C);p.arc(-3,-11,5,1.3,0.3,5.4,C[1]);p.ellipse(6,-3,8,3,C[2]);
      for(const x of [8,12]){p.line(x,-4,x+1,-9,C[3]);p.px(x+1,-9,C[4]);}
    }else if(family==="mushroom"){
      p.beam(0,-3,0,y,9,CREAM[2]);p.ellipse(0,y,13,8,C[1]);p.ellipse(-2,y-2,10,6,C[2]);
      for(const [a,b] of [[-5,-2],[2,-4],[4,1]])p.px(a,y+b,C[4]);
      if(!back)eyes(p,0,-8,side,C);
    }else if(family==="plant"){
      p.beam(0,0,0,y,5,LEAF[2]);p.tri(-12,-6,0,-5,-5,-11,LEAF[3]);p.tri(10,-8,0,-6,7,-13,LEAF[2]);round(p,0,y,11,8,C);
      p.line(-7,y,7,y,C[0]);for(let x=-5;x<6;x+=4)p.px(x,y+1,CREAM[4]);
    }else if(family==="worm"){
      for(let n=4;n>=0;n--)round(p,-4+n*4,-5-n+Math.round(2*wave(phase,1,n/7)),7-n/2,4+n/2,C);
      p.ellipse(-5,-7,4.6,3.3,C[0]);p.px(-7,-7,C[4]);p.px(-3,-8,C[4]);
    }else{
      p.ellipse(0,y,11,10,C[1]);p.ellipse(-1,y-2,9,8,C[2]);p.line(-5,y-5,0,y-7,C[4]);
      for(let i=0;i<5;i++){
        const x=i*4-8,end=y+10+Math.round(wave(phase,1,i/5)*4);
        if(family==="jelly")p.polyline([[x,y+5],[x+2,y+10],[x,end+5]],C[3]);
        else p.tri(x-3,y+3,x+3,y+3,x+2,end,C[2]);
      }
      if(!back)eyes(p,side*2,y,side,C);
    }
  }else if(["bird","bat","bee","dragon","insect"].includes(family)){
    const y=-13+Math.round(3*wind),wings=Math.round(7*wave(phase,family==="bird"?1:3));
    for(const a of [-1,1]){
      p.poly([[a*4,y-1],[a*18,y-6+wings],[a*15,y+1+wings],[a*9,y+4],[a*4,y+3]],C[1]);p.line(a*7,y,a*17,y-5+wings,C[3]);
    }
    round(p,0,y,7,8,C);
    if(family==="bee")for(const dy of [-2,2])p.line(-5,y+dy,5,y+dy,C[1]);
    if(family==="dragon"||family==="bat")for(const a of [-1,1])p.tri(a*3,y-6,a*6,y-12,a*7,y-5,C[3]);
    if(family==="bird")p.tri(side*4-2,y-2,side*6+3,y,side*4-2,y+2,GOLD[3]);
    if(!back)eyes(p,side*2,y-2,side,C);
  }else{
    const fish=family==="fish", spider=["spider","crab","octopus"].includes(family), y=fish?-12:-9+step;
    if(tails.has(id)||fish){p.tri(-8,y,-17,y-6,-15,y+4,C[1]);p.line(-16,y-5,-10,y-1,C[4]);}
    for(const a of [-1,1])for(const n of spider?[0,1,2,3]:[0,1]){
      const x=a*(4+n*3),bend=spider?a*(15+n*1.1):x+step*(n===0?1:-1),ys=fish?y+6:-2+step;
      p.polyline([[x,y],[bend,ys-4],[bend+a*(spider?2:0),ys]],C[1]);p.px(bend,ys-4,C[3]);
    }
    round(p,0,y,spider?9:11,spider?8:6.5,C);
    const hx=side*7;
    if(fish){p.line(-6,y-2,6,y-3,C[4]);p.px(6,y-1,C[0]);}
    else{
      round(p,hx,y-4,7,6,C);
      if(!spider)for(const a of [-1,1])p.tri(hx+a*3,y-6,hx+a*7,y-14,hx+a*7,y-4,C[2]);
      if(!back)eyes(p,hx,y-3,side,C);
    }
    if(id.includes("puffer"))for(const a of [-1,1])p.line(a*6,y-4,a*9,y-8,C[3]);
    if(/angry|scorpion/.test(id))p.px(hx+4,y-1,CREAM[4]);
  }
}
const states={
  enemy:["idle","move","attack","hurt","stunned","death","spawn"],
  boss:["idle","move","attack","attack-heavy","attack-ranged","phase","hurt","death","spawn","reward"],
  animal:["idle","walk","eat","sleep"],
};
export function worldCreature(id,kind,spec){
  const size=kind==="boss"?[96,96]:kind==="animal"?[48,48]:[64,64];
  const origin=[size[0]/2,size[1]-12], duration=1.25;
  const meta={name:id.replaceAll("-"," "),desc:`A top-down ${id.replaceAll("-"," ")} with selectable animation states.`,
    tags:[kind,spec.family],size,origin,duration,fps:12,loop:true,bg:"field",
    collision:{width:kind==="boss"?30:kind==="animal"?12:16,height:kind==="boss"?19:10},
    clips:states[kind],options:{state:"idle",facing:"down",palette:palettes[spec.palette],seed:1}};
  function draw(p,t,o){
    const phase=t/duration,state=o.state,C=fit(o.palette,5), exit=state==="death", enter=state==="spawn"||state==="phase";
    const visibility=enter?ease.outCubic(phase):exit?1-ease.inQuad(phase):1;
    const attack=state.startsWith("attack"),side=o.facing==="left"?-1:1,scale=spec.scale*(kind==="boss"?1.9:1);
    const shift=(state==="hurt"?3:attack?(state==="attack-heavy"?8:4):0)*Math.sin(phase*Math.PI)*side;
    const depth=state==="sleep"?4:0;
    groundShadow(p,shift,0,Math.min(21,12*scale),3.8,visibility*0.85);
    creature(layer.begin(-24,-40),spec,id,C,phase,state,o.facing);
    const bounds=kind==="boss"?46:23;
    p.shade(-bounds,-origin[1]+1,bounds,10,(x,y,v)=>{
      const color=layer.get((x-shift)/scale,(y-depth)/scale);
      v.a=visibility;
      return state==="hurt"&&phase<0.23&&color?C[4]:color;
    });
    if(["stunned","phase","reward"].includes(state))for(let i=0;i<3;i++){
      const a=TAU*(phase+i/3);
      twinkle(p,Math.cos(a)*14*scale,Math.min(-12,-25*scale)+Math.sin(a)*3,
        2.1+rand(i,7,o.seed),GOLD[3],GOLD[4]);
    }
    if(attack&&phase>0.28&&phase<0.58){
      const u=(phase-0.28)/0.3;
      if(state==="attack-ranged")p.ellipse(side*(17+19*u),-11,4,3,C[4],1-u);
      else p.arc(shift,-10,Math.min(23,11*scale+9*u),2,-1.2,1.2,C[4],1-u);
    }
  }
  return {meta,draw};
}

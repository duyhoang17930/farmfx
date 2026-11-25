import { ease, fit, Painter, seg } from "../../core/index.js";
import { CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, wave } from "./art.js";
import { icon } from "./farm-ui.js";
import { explorer, HOOD } from "./island-explorer.js";
import { groundShadow, twinkle } from "./sprite.js";
import * as gather from "../exploration/gather-swing.js";

// Mode, frames at 15 fps, held prop or implement. Looping modes never need an end cue.
const clips = {
  idle:["stride",24], walk:["stride",12], run:["stride",8], sprint:["stride",6],
  dash:["rush",7], "dodge-roll":["roll",11], jump:["jump",14], landing:["land",8],
  "axe-swing":["gather",9,"axe"], "pickaxe-swing":["gather",9,"pickaxe"],
  "shovel-dig":["swing",13,"shovel"], "hammer-swing":["swing",10,"hammer"], "hoe-swing":["swing",11,"hoe"],
  "scythe-swing":["sweep",12,"scythe"], watering:["use",17,"watering-can"], sowing:["scatter",12,"seed"],
  harvesting:["reach",12,"carrot"], "sword-attack":["sweep",9,"sword"], "sword-combo":["combo",21,"sword"],
  "heavy-attack":["swing",17,"greatsword"], "spear-attack":["thrust",12,"spear"],
  "bow-aim":["hold",16,"bow"], "bow-shoot":["shoot",11,"bow"], "magic-cast":["cast",15,"orb"],
  "shield-block":["guard",11,"shield"], "fishing-cast":["shoot",15,"rod"], "fishing-wait":["wait",24,"rod"],
  "fishing-reel":["reel",16,"rod"], "fishing-catch":["reach",16,"fish"], eating:["use",15,"bread"],
  drinking:["use",15,"milk"], "item-pickup":["reach",11,"wood"], "item-carry":["carry",12,"wood"],
  "item-throw":["shoot",12,"stone"], building:["swing",14,"hammer"], crafting:["reach",16,"gear"],
  pushing:["push",12], pulling:["pull",12], swimming:["swim",14], climbing:["climb",14], hurt:["hurt",8],
  knockback:["recoil",10], stunned:["stun",22], death:["down",17], respawn:["appear",16],
  sleeping:["rest",26], "waking-up":["rise",13], celebration:["cheer",18], "level-up":["cheer",22],
  teleport:["vanish",16],
};
const loops = new Set(["stride","hold","wait","reel","carry","push","pull","swim","climb","stun","rest"]);
const cue = {gather:4/15, swing:0.5, sweep:0.39, combo:0.22, thrust:0.43, use:0.48, scatter:0.48,
  reach:0.51, shoot:0.46, cast:0.48, guard:0.32, land:0.18, down:0.62, vanish:0.73};

function held(p,id,x,y,reach,t) {
  const xx=x+reach;
  if(id==="bow") {
    p.arc(x,y,6,1.4,-1.1,1.1,WOOD[3]);p.line(x+2,y-5,x+2,y+5,CREAM[3]);
    p.line(x-1,y,x+7,y,STEEL[3]);
  } else if(id==="rod"){
    p.line(x,y,x+7,y-10,WOOD[4]);p.line(x+7,y-10,x+9,y+2+wave(t)*2,CREAM[3]);
    p.px(x+9,y+2+wave(t)*2,RED[4]);
  } else if(id==="shield"){
    p.poly([[x-4,y-4],[x+4,y-4],[x+4,y+2],[x,y+6],[x-4,y+2]],STEEL[1]);
    p.line(x-3,y-3,x+3,y-3,STEEL[4]);p.line(x,y-2,x,y+3,GOLD[3]);
  } else if(id==="watering-can"){
    p.ellipse(x,y,4.5,3,WATER[2]);p.line(x+1,y,x+7,y-3,WATER[4]);p.arc(x-4,y-1,3,1,1.5,4.9,WATER[3]);
  } else if(id==="orb"){
    p.circle(xx,y,3.1,VIOLET[2]);p.px(xx-1,y-1,VIOLET[4]);p.glow(xx,y,5,VIOLET[3],0.32);
  } else if(id==="sword"||id==="spear"||id==="greatsword"||id==="scythe") {
    const length=id==="spear"?10:id==="greatsword"?8:5;
    p.line(x-2,y+2,x+length,y-4,STEEL[1]);p.line(x,y+1,x+length,y-5,STEEL[4]);
    p.line(x-1,y-1,x+2,y+2,WOOD[3]);
    if(id==="scythe")p.arc(x+length,y-4,5,1.5,-2.9,-0.2,STEEL[3]);
  } else if(id){
    icon(p,id,xx,y,0);
  }
}

export function playerClip(id) {
  const [mode,frames,item]=clips[id];
  const duration=frames/15, loop=loops.has(mode), hit=cue[mode];
  const events = loop?undefined:{...(hit===undefined?{}:{contact:mode==="gather"?hit:duration*hit}),completion:duration,
    ...(["swing","sweep","combo","thrust","shoot","cast"].includes(mode)&&hit!==undefined?{damage:duration*hit}:{}),
    ...(mode==="combo"?{secondContact:duration*0.59}: {})};
  const meta={name:id.replaceAll("-"," "),desc:`Island explorer ${id.replaceAll("-"," ")} in four directions.`,
    size:[64,64],origin:[32,48],duration,fps:15,loop,bg:"field",tags:["player",mode],options:{facing:"down",palette:HOOD},
    collision:{width:12,height:8},...(events?{events,omitTerminalFrame:true}:{})};
  function draw(p,t,o){
    if(!loop&&t>=duration)return;
    if(mode==="gather"){gather.draw(p,t,{...o,tool:item});return;}
    const phase=t/duration, facing=o.facing, direction=facing==="left"?-1:1;
    const side=facing==="left"||facing==="right";
    const pulse=Math.sin(Math.PI*phase);
    const action=mode==="combo"?Math.sin(2*Math.PI*phase)**2:pulse;
    const swing=["swing","sweep","thrust","combo"].includes(mode);
    const moving=["rush","stride","carry","push","pull","climb","swim"].includes(mode)&&id!=="idle";
    const dip=mode==="land"?4*Math.sin(Math.PI*seg(phase,0,.72)):["reach","scatter","hurt","recoil"].includes(mode)?3*action:0;
    const height=mode==="jump"?10*pulse:mode==="cheer"?4*pulse:mode==="climb"?5:mode==="swim"?-4:0;
    const x=side?direction*(mode==="rush"?12*phase:mode==="recoil"?-8*phase:0):0;
    const roll=mode==="roll"?phase*2*Math.PI:mode==="down"?ease.inQuad(seg(phase,0.15,0.76))*1.35:
      mode==="rest"?1.35:mode==="rise"?(1-ease.outCubic(phase))*1.35:0;
    const lean=mode==="push"?2:mode==="pull"||mode==="hurt"?-2:mode==="rush"?3:swing?Math.round(3*wave(phase,1,-0.1)):0;
    const prop=["watering-can","bow","rod","orb","shield","bread","milk","wood","fish","seed","gear","stone","carrot","sword","spear","greatsword","scythe"].includes(item);
    const gripY=mode==="use"?-7-6*pulse:mode==="reach"?-6+5*pulse:mode==="cheer"?-13-4*pulse:
      swing?-10-7*wave(phase):mode==="scatter"?-7-4*action:-8;
    const gripX=side?(swing?3+7*action:6+3*action):4+2*action;
    const hand=(item||mode==="cheer")?[Math.round(gripX),Math.round(gripY)]:undefined;
    const tip=swing&&!prop?[Math.round(gripX+6+3*action),Math.round(gripY-3-5*wave(phase))]:undefined;
    const lift=Math.round(-height-5*Math.sin(roll)**2-(mode==="roll"?14*Math.sin(roll/2)**2:0));
    const body=new Painter(p.frame).place(p.toX(x,lift),p.toY(x,lift),p.fx<0,Math.atan2(p.sn,p.cs)+direction*roll*p.fx);
    body.fade=p.fade*(mode==="vanish"?1-seg(phase,0.6,1):mode==="appear"?seg(phase,0,0.64):1);
    groundShadow(p,x,0,mode==="swim"?9:6.5,2,0.9-height*0.04);
    explorer(body,fit(o.palette,5),facing,{shadow:false,step:moving?Math.min(3,Math.floor(4*phase)): -1,
      bob:Math.round(dip+(id==="idle"?Math.max(0,wave(phase)):0)),lean,hand,tool:tip?item:undefined,tip});
    if(prop){
      const propPainter=new Painter(body.frame).place(body.tx,body.ty,body.fx*direction<0,Math.atan2(body.sn,body.cs));
      propPainter.fade=body.fade;
      held(propPainter,item,gripX,gripY,0,phase);
    }
    if(mode==="swim")p.ellipse(0,-1,9+pulse*3,2,WATER[3],0.58);
    if(["stun","cheer","appear","vanish","cast"].includes(mode))for(let i=0;i<4;i++){
      const a=(phase+i/4)*Math.PI*2;
      twinkle(p,Math.cos(a)*11,-23+Math.sin(a)*4,1.5+(i%2),mode==="cast"?VIOLET[3]:GOLD[3],GOLD[4]);
    }
    if(mode==="scatter"||mode==="use"&&item==="watering-can")for(let i=0;i<4;i++){
      const u=seg(phase,0.35+i*0.04,0.91);
      if(u>0&&u<1)p.dot(direction*(7+u*(8+i)),-8+11*u, item==="seed"?LEAF[3]:WATER[3],Math.sin(u*Math.PI));
    }
  }
  return {meta,draw};
}

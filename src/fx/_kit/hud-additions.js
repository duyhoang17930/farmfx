import { clamp } from "../../core/index.js";
import { CREAM, GOLD, LEAF, RED, VIOLET, WATER } from "./art.js";
import { frame, icon, label, ui } from "./farm-ui.js";

const colors={experience:VIOLET,stamina:LEAF,hunger:GOLD,mana:VIOLET,armor:WATER,oxygen:WATER,boss:RED,enemy:RED,resource:GOLD};
const eventIcons={buff:"speed-potion",debuff:"poison-potion",cooldown:"energy-ring",skill:"skill-point",level:"experience-orb",combo:"iron-ingot",resource:"wood"};
export function hudAsset(id){
  const first=id.split("-")[0], palette=colors[first]??GOLD;
  const bar=id.endsWith("-bar"), map=id==="minimap", compass=id==="compass", labelName=first.toUpperCase();
  return ui(id.replaceAll("-"," "),`A HUD ${id.replaceAll("-"," ")} with externally supplied state.`,
    map?80:128,map?80:32,{value:.65,max:1,label:id==="interaction-prompt"?"E INTERACT":labelName,count:8,markerX:0,markerY:0},(p,_phase,C,o)=>{
    if(map){
      frame(p,-37,-37,74,74,C);
      p.rect(-30,-30,60,60,WATER[1]);
      p.poly([[-26,-13],[-17,-21],[0,-24],[15,-17],[24,-4],[21,19],[4,24],[-19,17]],LEAF[2]);
      p.polyline([[-18,-4],[-11,5],[2,5],[13,14]],GOLD[3]);
      p.circle(clamp(o.markerX,-25,25),clamp(o.markerY,-25,25),2.6,GOLD[4]);return;
    }
    frame(p,-61,-13,122,26,C);
    if(bar){
      label(p,o.label,-55,-7,24);
      p.rect(-54,1,109,7,C[0]);p.rect(-53,2,107,5,C[2]);
      const fill=Math.round(107*clamp(o.value/Math.max(.001,o.max)));
      if(fill){p.rect(-53,2,fill,5,palette[2]);p.line(-53,2,-54+fill,2,palette[4]);}
      if(first==="boss"||first==="resource")for(const x of [-31,-8,15,38])p.line(x,3,x,6,C[0]);
    }else if(compass){
      for(const [x,s] of [[-44,"W"],[-15,"N"],[15,"E"],[44,"S"]]){label(p,s,x,-3,1);p.px(x+1,6,GOLD[3]);}
      const x=clamp(o.value)*90-45;p.tri(x,-10,x-3,-7,x+3,-7,GOLD[4]);
    }else{
      if(eventIcons[first])icon(p,eventIcons[first],-46,0,0);
      label(p,o.label,eventIcons[first]?-34:-53,-3,20);
      if(id!=="interaction-prompt")p.text(String(o.count).slice(0,6),54,-3,GOLD[4],{font:"mini",align:"right"});
    }
  },{duration:1,fps:1});
}

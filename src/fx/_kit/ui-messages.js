import { ease, seg } from "../../core/index.js";
import { CREAM, GOLD, RED, WATER } from "./art.js";
import { frame, icon, label, ui } from "./farm-ui.js";
const markers={
  "level-up-toast":"experience-orb","skill-unlock-toast":"skill-point","recipe-unlock-toast":"paper",
  "achievement-toast":"golden-egg","quest-start-toast":"ancient-scroll","quest-complete-toast":"gold-key","inventory-full-toast":"wood",
  "insufficient-resource-toast":"stone","insufficient-gold-toast":"coin","crafting-complete-toast":"gear","building-complete-toast":"brick",
  "island-unlock-toast":"gold-key","new-biome-toast":"treasure-map","rare-item-toast":"ruby","save-success-toast":"star",
  "error-toast":"poison-potion","warning-toast":"bomb","tutorial-popup":"paper",
};
export function uiMessage(id){
  const warning=/error|full|warning|insufficient/.test(id);
  return ui(id.replaceAll("-"," "),`A one-shot ${id.replaceAll("-"," ")} with editable message and icon.`,
    192,72,{title:id.replace(/-(toast|popup)$/,"").replaceAll("-"," ").toUpperCase(),text:"",item:markers[id]},(p,t,C,o)=>{
    if(t>=.98)return;
    const y=Math.round((1-ease.outCubic(seg(t,0,.22)))*13+seg(t,.8,.98)*20);
    frame(p,-90,-26+y,180,37,C);
    p.rect(-83,-19+y,23,23,C[0]);icon(p,o.item,-71,-8+y,0);
    p.line(-55,-17+y,80,-17+y,warning?RED[3]:id==="tutorial-popup"?WATER[4]:GOLD[3]);
    label(p,o.title,-53,-12+y,30,warning?RED[4]:GOLD[4]);label(p,o.text,-53,-2+y,32,CREAM[4]);
  },{duration:2.4,fps:16,loop:false});
}

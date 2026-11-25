import { clamp, TAU } from "../../core/index.js";
import { CREAM, GOLD, LEAF, RED, VIOLET, WATER, round } from "./art.js";
import { frame, icon, label, slot, ui } from "./farm-ui.js";

const set={
  button:"button icon-button toggle checkbox radio-button keyboard-prompt controller-prompt touch-prompt",
  slider:"slider progress-bar loading-bar scrollbar",
  vertical:"dropdown context-menu tab pagination",
  card:"panel modal popup confirmation-dialog recipe-card quest-card achievement-card",
  item:"item-slot equipment-slot locked-slot item-rarity-border item-stack-counter item-drag-preview",
  radial:"circular-progress radial-menu", marks:"skill-node skill-connection notification-badge selection-highlight",
};
export function widget(id){
  const kind=Object.keys(set).find(k=>set[k].split(" ").includes(id));
  const wide=kind==="card"||kind==="vertical";
  return ui(id.replaceAll("-"," "),`A configurable ${id.replaceAll("-"," ")} component.`,wide?160:96,wide?80:48,
    {text:id.replaceAll("-"," ").toUpperCase(),value:.62,selected:true,item:"gold-ingot",count:5},(p,_t,C,o)=>{
    const value=clamp(o.value), selected=o.selected;
    if(kind==="button"){
      if(id==="toggle"){
        p.rect(-18,-8,37,16,C[0]);p.rect(-16,-6,33,12,selected?LEAF[2]:C[2]);round(p,selected?10:-10,0,6,6,GOLD);
      }else if(id==="checkbox"||id==="radio-button"){
        if(id==="checkbox"){p.rect(-35,-8,16,16,C[0]);p.rect(-34,-7,14,13,C[2]);if(selected){p.line(-32,0,-29,3,GOLD[4]);p.line(-29,3,-23,-3,GOLD[4]);}}
        else{p.ring(-27,0,8,2,C[4]);if(selected)p.circle(-27,0,4.3,GOLD[3]);}
        label(p,o.text,-14,-3,14);
      }else{
        frame(p,-42,-11,84,22,C);
        if(id==="icon-button")icon(p,o.item,-30,0,0);
        if(id.includes("prompt")){
          p.rect(-35,-6,14,13,GOLD[3]);label(p,id==="keyboard-prompt"?"E":id==="controller-prompt"?"A":"+\n",-31,-3,1,C[0]);
        }
        label(p,o.text,id==="button"?-34:-15,-3,id==="button"?16:13);
      }
    }else if(kind==="slider"){
      p.rect(-39,-6,78,12,C[0]);p.rect(-37,-4,74,8,C[2]);
      if(id==="slider"||id==="scrollbar"){
        const x=-34+68*value;p.circle(x,0,6,GOLD[2]);p.circle(x-1,-1,4,GOLD[4]);
      }else{
        p.rect(-36,-3,72*value,6,id==="loading-bar"?GOLD[3]:LEAF[3]);
        if(id==="loading-bar")for(let j=-33;j<-36+72*value;j+=7)p.line(j,-2,j+2,2,GOLD[1]);
      }
    }else if(kind==="vertical"){
      frame(p,-72,-31,144,62,C);
      if(id==="tab"||id==="pagination"){
        for(let i=0;i<4;i++){
          const x=-60+i*31;p.rect(x,-10,28,21,i===1?C[3]:C[1]);label(p,String(i+1),x+11,-3,1,i===1?GOLD[4]:CREAM[4]);
        }
      }else{
        for(const [i,text] of [String(o.text),"SELECTED OPTION","OTHER OPTION"].entries()){
          const y=-22+i*15;p.rect(-63,y,127,13,i===1?C[3]:C[0]);label(p,text,-58,y+4,27);
        }
      }
    }else if(kind==="card"){
      frame(p,-75,-33,150,66,C);p.rect(-67,-26,134,12,C[0]);label(p,o.text,-62,-23,28,GOLD[4]);
      if(id==="recipe-card"||id==="quest-card"||id==="achievement-card"){
        slot(p,-62,-5,C,true);icon(p,id==="achievement-card"?"skill-point":o.item,-55,2,0);
        label(p,id==="recipe-card"?"INGREDIENTS":id==="quest-card"?"OBJECTIVE":"REWARD",-39,-3,20);
        p.rect(-38,8,91*value,4,LEAF[3]);
      }else{
        p.line(-62,-4,50,-4,C[3]);p.line(-62,4,38,4,C[3]);
        if(id==="confirmation-dialog"){p.rect(-49,13,44,12,LEAF[2]);p.rect(5,13,44,12,RED[2]);label(p,"YES",-37,16,3);label(p,"NO",17,16,2);}
      }
    }else if(kind==="item"){
      if(id==="item-drag-preview")p.rect(-13,-13,26,26,C[0],.62);
      slot(p,-7,-7,C,selected);
      if(id==="locked-slot"){p.arc(0,-1,3,1,Math.PI,TAU,GOLD[3]);p.rect(-3,-1,7,5,GOLD[3]);p.px(0,1,C[0]);}
      else icon(p,o.item,0,0,0);
      if(id==="item-stack-counter")label(p,String(o.count),5,6,3,GOLD[4]);
      if(id==="equipment-slot")p.ring(0,0,10,1,VIOLET[4]);
      if(id==="item-rarity-border")for(const [x,y] of [[-9,-9],[9,-9],[-9,9],[9,9]])p.circle(x,y,1.6,VIOLET[4]);
    }else if(kind==="radial"){
      p.ring(0,0,17,3,C[2]);p.arc(0,0,17,3,-Math.PI/2,-Math.PI/2+TAU*value,LEAF[4]);
      if(id==="radial-menu")for(let i=0;i<6;i++){
        const a=TAU*i/6, x=Math.cos(a)*17,y=Math.sin(a)*17;p.circle(x,y,3,i===1?GOLD[4]:WATER[3]);
      }
      icon(p,o.item,0,0,0);
    }else{
      if(id==="skill-connection"){p.line(-27,0,27,0,C[3]);p.circle(-27,0,3,GOLD[4]);p.circle(27,0,3,GOLD[4]);}
      if(id==="skill-node"){p.circle(0,0,11,C[0]);p.ring(0,0,10,2,selected?GOLD[4]:C[3]);icon(p,o.item,0,0,0);}
      if(id==="notification-badge"){p.circle(0,0,10,RED[2]);p.text(String(o.count).slice(0,3),0,-2,CREAM[4],{align:"center"});}
      if(id==="selection-highlight"){for(const [x,y] of [[-12,-12],[12,-12],[-12,12],[12,12]]){p.line(x,y,x-Math.sign(x)*5,y,GOLD[4]);p.line(x,y,x,y-Math.sign(y)*5,GOLD[4]);}}
    }
  },{duration:1,fps:1});
}

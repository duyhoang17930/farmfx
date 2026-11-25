import { rand } from "../../core/index.js";
import { asset, CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, box, post, wave } from "./art.js";
import { icon } from "./farm-ui.js";
import { groundShadow } from "./sprite.js";
import { exhaust, vapor } from "./machine.js";

const signs={blacksmith:"hammer","lumber-house":"wood","mining-house":"ore",bakery:"bread",restaurant:"soup",tavern:"coffee",
  "fishing-hut":"fish","hunter-hut":"raw-meat","potion-shop":"small-health-potion","weapon-shop":"steel-ingot","seed-shop":"seed",
  "clothing-shop":"cloth","merchant-house":"coin-pouch","town-hall":"coin",library:"paper",museum:"fossil",temple:"magic-orb",
  shrine:"soul-shard",church:"golden-egg","bank-building":"gold-bar","factory-building":"gear","power-station":"battery",
  warehouse:"resource-crate",laboratory:"circuit-board","animal-shelter":"animal-feed",pigsty:"trough","sheep-pen":"wool",
  "duck-house":"egg","fish-farm":"fish","upgraded-barn":"milk","upgraded-coop":"egg",
  "upgraded-greenhouse":"seed","portal-building":"spirit-essence","abandoned-house":"bark"};
const towers=/tower/;
const gates=/entrance|portal/;
const factories=/factory|power|warehouse|laboratory|smith/;
const animal=/shelter|pigsty|pen|duck|fish-farm|barn|coop|greenhouse/;
const civic=/hall|library|museum|temple|shrine|church|bank/;
const roofs=[RED,LEAF,WATER,WOOD,VIOLET,STEEL];

function window(p,x,y,C,active){
  p.rect(x-5,y-6,11,13,WOOD[0]);p.rect(x-4,y-5,9,11,active?GOLD[3]:WATER[2]);
  p.line(x,y-5,x,y+5,WOOD[2]);p.line(x-4,y,x+4,y,WOOD[2]);p.line(x-5,y+6,x+5,y+6,C[4]);
}
function doorway(p,x,y,w,h,C,open){
  p.rect(x-w,y-h,w*2,h,C[0]);p.rect(x-w+1,y-h+1,w*2-2,h-1,open?STEEL[0]:WOOD[2]);
  if(!open){p.line(x-3,y-h+2,x-3,y-2,WOOD[4]);p.px(x+3,y-8,GOLD[4]);}
}
export function extraBuilding(id){
  const mode=towers.test(id)?"tower":gates.test(id)?"gate":factories.test(id)?"industry":animal.test(id)?"farm":civic.test(id)?"civic":"house";
  const index=[...id].reduce((a,b,i)=>a+b.charCodeAt(0)*(i+1),0);
  const palette=roofs[index%roofs.length], W=mode==="tower"?18:mode==="gate"?29:mode==="industry"?35:mode==="farm"?31:28;
  const size=[96,112],origin=[48,96];
  const fx=asset({name:id.replaceAll("-"," "),desc:`A top-down ${id.replaceAll("-"," ")} with a selectable door and interior lights.`,
    tags:["building",mode],size,origin,palette,duration:3,fps:12,options:{open:false,active:true}},(p,t,C,o)=>{
    groundShadow(p,0,0,W+5,6);
    const wall=mode==="industry"||mode==="civic"||mode==="gate"?STEEL:WOOD;
    if(mode==="gate"){
      const magic=id.includes("portal");
      p.poly([[-W,0],[-W,-29],[-19,-48],[-11,-61],[12,-58],[23,-48],[W,-26],[W,0]],wall[0]);
      p.poly([[-W+2,-1],[-W+2,-28],[-18,-46],[-10,-59],[10,-56],[22,-47],[W-2,-26],[W-2,-1]],C[2]);
      p.polyline([[-25,-25],[-15,-47],[-8,-56],[9,-54]],C[4]);
      p.poly([[-15,0],[-15,-24],[-10,-34],[4,-36],[14,-27],[15,0]],STEEL[0]);
      p.polyline([[-15,0],[-15,-24],[-10,-34],[4,-36],[14,-27],[15,0]],C[4]);
      if(magic&&o.active){p.ellipse(0,-18,11,15,VIOLET[2]);p.arc(0,-19,10,2,-Math.PI+t*6.28,t*6.28,VIOLET[4]);p.glow(0,-18,13,VIOLET[3],.32);}
      if(id.includes("mine")){p.line(-19,-4,18,-4,WOOD[4]);p.line(-7,1,-4,-23,STEEL[3]);p.line(7,1,4,-23,STEEL[3]);}
    }else if(mode==="tower"){
      box(p,-W,0,W*2,59,7,wall);
      p.poly([[-W-5,-54],[-12,-68],[0,-83],[16,-66],[W+4,-54],[W,-50],[-W,-50]],C[0]);
      p.poly([[-W-3,-54],[-10,-68],[0,-81],[15,-65],[W+1,-54],[-W+1,-52]],C[2]);
      p.line(-15,-58,0,-80,C[4]);doorway(p,0,0,7,20,wall,o.open);
      if(id==="clock-tower"){p.circle(0,-46,9,GOLD[2]);p.circle(0,-46,7,CREAM[3]);p.line(0,-46,3,-48,STEEL[0]);p.line(0,-46,0,-51,STEEL[0]);}
      else window(p,0,-40,C,o.active);
    }else{
      const h=mode==="industry"?42:mode==="civic"?38:33;
      box(p,-W,0,W*2,h,8,wall);
      for(let i=0;i<6;i++){const y=-3-i*5;if(y>-h)p.line(-W+2,y,W-3,y,wall[1]);}
      if(mode==="industry"){
        exhaust(p,W-12,-58,9,22,STEEL);
        if(o.active)vapor(p,W-7,-58,t,o.seed,CREAM,3);
      }else if(mode!=="farm"){
        exhaust(p,W-11,-52,7,15,WOOD);
        if(o.active&&index%2===0)vapor(p,W-8,-52,t,o.seed,CREAM,2);
      }
      if(mode==="farm"&&/pen|sty/.test(id)){
        for(let x=-W+2;x<W;x+=10)post(p,x,0,18,WOOD);
        p.line(-W,-14,W,-14,WOOD[4]);p.line(-W,-8,W,-8,WOOD[3]);
      }else{
        const roofH=mode==="civic"?-64:mode==="industry"?-55:-54;
        p.poly([[-W-5,-h],[-W+4,-h-10],[0,roofH],[W+5,-h-4],[W+3,-h+4],[-W-3,-h+4]],C[0]);
        p.poly([[-W-3,-h],[-W+5,-h-9],[0,roofH+1],[W+3,-h-4],[W,-h+2],[-W+1,-h+2]],C[2]);
        p.line(-W+6,-h-9,0,roofH+2,C[4]);p.line(-W,-h+1,W,-h+1,C[3]);
        if(mode==="civic"){for(const x of [-18,18])post(p,x,0,28,CREAM);}
        else if(id.includes("greenhouse"))p.line(-W+5,-h-2,W,-h-2,WATER[4]);
        if(mode!=="civic")for(const x of [-17,17])window(p,x,-18,C,o.active);
        doorway(p,0,0,8,21,wall,o.open);
      }
      if(signs[id]){
        p.rect(-8,-h+5,17,12,WOOD[1]);p.line(-7,-h+5,7,-h+5,GOLD[3]);
        icon(p,signs[id],0,-h+10,0);
      }
      for(let i=0;i<4;i++)if(rand(i,3,o.seed)>0.31)p.px(-W+3+i*3,-2,wall[4]);
    }
    if(mode==="civic")p.line(-W,0,W,0,CREAM[3]);
  });
  return {...fx,meta:{...fx.meta,collision:{width:W*2,height:mode==="tower"?18:22}}};
}

import { rand } from "../../core/index.js";
import { asset, CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, box, post, wave } from "./art.js";
import { icon } from "./farm-ui.js";
import { groundShadow } from "./sprite.js";
import { exhaust, vapor } from "./machine.js";

const signs={blacksmith:"steel-ingot","lumber-house":"wood","mining-house":"ore",bakery:"bread",restaurant:"soup",tavern:"coffee",
  "fishing-hut":"fish","hunter-hut":"raw-meat","potion-shop":"small-health-potion","weapon-shop":"steel-ingot","seed-shop":"seed",
  "clothing-shop":"cloth","merchant-house":"coin-pouch","town-hall":"coin",library:"paper",museum:"fossil",temple:"magic-orb",
  shrine:"soul-shard",church:"golden-egg","bank-building":"gold-bar","factory-building":"gear","power-station":"battery",
  warehouse:"plank",laboratory:"circuit-board","animal-shelter":"animal-feed",pigsty:"raw-meat","sheep-pen":"wool",
  "duck-house":"egg","fish-farm":"fish","upgraded-barn":"milk","upgraded-coop":"egg",
  "upgraded-greenhouse":"seed","portal-building":"spirit-essence","abandoned-house":"bark"};
const towers=/tower/;
const gates=/entrance|portal/;
const factories=/factory|power|warehouse|laboratory|smith/;
const animal=/shelter|pigsty|pen|duck|fish-farm|barn|coop|greenhouse/;
const civic=/hall|library|museum|temple|shrine|church|bank/;
const roofs=[RED,LEAF,WATER,WOOD,VIOLET,STEEL];

// Each building gets its own outline, so they read apart before the sign or roof colour does.
const shapes={
  bakery:"store","clothing-shop":"store","seed-shop":"store","potion-shop":"store","weapon-shop":"store",restaurant:"store",
  tavern:"tall","merchant-house":"tall","abandoned-house":"ruin",
  library:"dome",museum:"dome","bank-building":"portico","town-hall":"portico",temple:"temple",church:"steeple",shrine:"pagoda",
  "factory-building":"sawtooth","power-station":"plant",warehouse:"vault",laboratory:"lab",blacksmith:"smithy",
  "upgraded-barn":"gambrel","upgraded-coop":"stilts","fishing-hut":"stilts","duck-house":"aframe","upgraded-greenhouse":"glass",
  pigsty:"pen","sheep-pen":"pen","animal-shelter":"leanto","hunter-hut":"leanto","fish-farm":"ponds",
  "lumber-house":"gable","mining-house":"gable",
};
const widths={store:28,tall:26,ruin:27,dome:33,portico:33,temple:32,steeple:27,pagoda:24,sawtooth:36,plant:36,vault:36,lab:31,
  smithy:30,gambrel:32,stilts:26,aframe:22,glass:30,pen:34,leanto:28,ponds:35,gable:28};

function window(p,x,y,C,active){
  p.rect(x-5,y-6,11,13,WOOD[0]);p.rect(x-4,y-5,9,11,active?GOLD[3]:WATER[2]);
  p.line(x,y-5,x,y+5,WOOD[2]);p.line(x-4,y,x+4,y,WOOD[2]);p.line(x-5,y+6,x+5,y+6,C[4]);
}
function doorway(p,x,y,w,h,C,open){
  p.rect(x-w,y-h,w*2,h,C[0]);p.rect(x-w+1,y-h+1,w*2-2,h-1,open?STEEL[0]:WOOD[2]);
  if(!open){p.line(x-3,y-h+2,x-3,y-2,WOOD[4]);p.px(x+3,y-8,GOLD[4]);}
}
function gable(p,W,h,top,C){
  p.poly([[-W-5,-h],[-W+4,-h-10],[0,top],[W+5,-h-4],[W+3,-h+4],[-W-3,-h+4]],C[0]);
  p.poly([[-W-3,-h],[-W+5,-h-9],[0,top+1],[W+3,-h-4],[W,-h+2],[-W+1,-h+2]],C[2]);
  p.line(-W+6,-h-9,0,top+2,C[4]);p.line(-W,-h+1,W,-h+1,C[3]);
}
function siding(p,W,h,wall){for(let i=0;i<8;i++){const y=-3-i*5;if(y>-h)p.line(-W+2,y,W-3,y,wall[1]);}}
function awning(p,x0,x1,y,A){
  p.rect(x0-1,y-1,x1-x0+2,9,A[0]);
  for(let x=x0,i=0;x<x1;x+=5,i++){
    const c=i%2?CREAM[4]:A[3],w=Math.min(5,x1-x);
    p.rect(x,y,w,7,c);p.rect(x+1,y+7,Math.max(1,w-2),1,c);
  }
  p.line(x0,y,x1-1,y,A[4]);p.line(x0,y+9,x1-1,y+9,STEEL[0]);
}
function shopWindow(p,x,y,w,active){
  p.rect(x,y,w,10,WOOD[0]);p.rect(x+1,y+1,w-2,8,active?GOLD[3]:WATER[2]);
  p.line(x+1,y+1,x+w-2,y+1,CREAM[4]);for(let i=x+4;i<x+w-1;i+=5)p.line(i,y+1,i,y+8,WOOD[1]);
}
function stack(p,x,top,w,C){p.rect(x,top,w,-top,C[0]);p.rect(x+1,top+1,w-2,-top-1,C[2]);p.line(x+1,top+1,x+1,-1,C[3]);p.rect(x-1,top,w+2,2,C[1]);}

export function extraBuilding(id){
  const mode=towers.test(id)?"tower":gates.test(id)?"gate":factories.test(id)?"industry":animal.test(id)?"farm":civic.test(id)?"civic":"house";
  const shape=mode==="tower"||mode==="gate"?mode:shapes[id]??"gable";
  const index=[...id].reduce((a,b,i)=>a+b.charCodeAt(0)*(i+1),0);
  const palette=roofs[index%roofs.length];
  const W=mode==="tower"?18:mode==="gate"?29:widths[shape];
  const size=[96,112],origin=[48,96];
  const fx=asset({name:id.replaceAll("-"," "),desc:`A top-down ${id.replaceAll("-"," ")} with a selectable door and interior lights.`,
    tags:["building",mode,shape],size,origin,palette,duration:3,fps:12,options:{open:false,active:true}},(p,t,C,o)=>{
    groundShadow(p,0,0,W+5,6);
    const wall=mode==="industry"||mode==="civic"||mode==="gate"?STEEL:WOOD;
    let signY=null,signX=0;
    if(shape==="gate"){
      const magic=id.includes("portal"),dungeon=id.includes("dungeon");
      const rock=dungeon?STEEL:wall;
      p.poly([[-W,0],[-W,-29],[-19,-48],[-11,-61],[12,-58],[23,-48],[W,-26],[W,0]],rock[0]);
      p.poly([[-W+2,-1],[-W+2,-28],[-18,-46],[-10,-59],[10,-56],[22,-47],[W-2,-26],[W-2,-1]],dungeon?STEEL[1]:C[2]);
      p.polyline([[-25,-25],[-15,-47],[-8,-56],[9,-54]],dungeon?STEEL[3]:C[4]);
      if(dungeon){ // cut stone courses and a keystone
        for(let y=-6;y>-46;y-=6)for(let x=-W+3+((y/6)%2?4:0);x<W-3;x+=9)p.line(x,y,x+6,y,STEEL[2]);
        p.poly([[-4,-40],[4,-40],[3,-34],[-3,-34]],STEEL[3]);
      }
      p.poly([[-15,0],[-15,-24],[-10,-34],[4,-36],[14,-27],[15,0]],STEEL[0]);
      p.polyline([[-15,0],[-15,-24],[-10,-34],[4,-36],[14,-27],[15,0]],C[4]);
      if(magic&&o.active){p.ellipse(0,-18,11,15,VIOLET[2]);p.arc(0,-19,10,2,-Math.PI+t*6.28,t*6.28,VIOLET[4]);p.glow(0,-18,13,VIOLET[3],.32);}
      if(id.includes("mine")){p.line(-19,-4,18,-4,WOOD[4]);p.line(-7,1,-4,-23,STEEL[3]);p.line(7,1,4,-23,STEEL[3]);}
      if(dungeon)for(const x of [-21,21]){p.line(x,-10,x,-20,WOOD[1]);p.rect(x-1,-23,3,3,GOLD[3]);if(o.active)p.glow(x,-23,5,GOLD[4],.28);}
    }else if(shape==="tower"){
      const mage=id==="magic-tower",watch=id==="watchtower";
      box(p,-W,0,W*2,59,7,wall);
      if(watch){ // open lookout with battlements instead of a cone
        p.rect(-W-4,-66,W*2+8,8,wall[0]);p.rect(-W-3,-65,W*2+6,6,wall[3]);
        for(let x=-W-4;x<W+4;x+=6)p.rect(x,-71,4,5,wall[2]);
        p.line(-W+4,-50,W-4,-50,wall[1]);post(p,-W+3,-66,10,WOOD);post(p,W-3,-66,10,WOOD);
        p.rect(-W+5,-79,W*2-10,4,C[2]);p.line(0,-79,0,-90,WOOD[1]);p.poly([[1,-90],[9,-87],[1,-84]],RED[3]);
      }else{
        const peak=mage?-89:-83;
        p.poly([[-W-5,-54],[-12,-68],[0,peak],[16,-66],[W+4,-54],[W,-50],[-W,-50]],C[0]);
        p.poly([[-W-3,-54],[-10,-68],[0,peak+2],[15,-65],[W+1,-54],[-W+1,-52]],C[2]);
        p.line(-15,-58,0,peak+3,C[4]);
        if(mage){
          for(let i=0;i<3;i++)p.line(-W+4+i*6,-56-i*9,W-4-i*4,-58-i*10,GOLD[3]);
          const bob=Math.round(wave(t,1)*2);p.circle(0,peak+1+bob,3,VIOLET[3]);p.px(0,peak+bob,CREAM[4]);
          if(o.active)p.glow(0,peak+1+bob,6,VIOLET[4],.35);
        }
      }
      doorway(p,0,0,7,20,wall,o.open);
      if(id==="clock-tower"){p.circle(0,-46,9,GOLD[2]);p.circle(0,-46,7,CREAM[3]);p.line(0,-46,3,-48,STEEL[0]);p.line(0,-46,0,-51,STEEL[0]);}
      else window(p,0,-40,C,o.active);
    }else if(shape==="store"){
      const h=33;box(p,-W,0,W*2,h,8,wall);siding(p,W,h,wall);gable(p,W,h,-54,C);
      exhaust(p,W-11,-52,7,15,WOOD);
      awning(p,-W+1,W-1,-25,[RED,LEAF,WATER,VIOLET,GOLD][index%5]);
      shopWindow(p,-W+4,-14,14,o.active);shopWindow(p,W-18,-14,14,o.active);
      doorway(p,0,0,7,18,wall,o.open);signY=-h+10;
    }else if(shape==="tall"){
      const h=52;box(p,-W,0,W*2,h,8,wall);siding(p,W,h,wall);gable(p,W,h,-72,C);
      exhaust(p,W-10,-70,7,15,WOOD);if(o.active&&index%2===0)vapor(p,W-7,-70,t,o.seed,CREAM,2);
      p.rect(-W,-27,W*2,3,WOOD[1]);for(let x=-W+2;x<W;x+=4)p.px(x,-30,WOOD[3]);
      for(const x of [-15,15]){window(p,x,-15,C,o.active);window(p,x,-41,C,o.active);}
      window(p,0,-41,C,o.active);doorway(p,0,0,7,19,wall,o.open);signY=-24;
    }else if(shape==="ruin"){
      const h=33;box(p,-W,0,W*2,h,8,wall);siding(p,W,h,wall);gable(p,W,h,-54,C);
      for(const [x,y,w] of [[-12,-45,6],[5,-49,5],[-20,-38,4]])p.rect(x,y,w,4,STEEL[0]);
      for(const x of [-17,17]){p.rect(x-5,-24,11,13,WOOD[0]);p.line(x-5,-24,x+5,-12,WOOD[3]);p.line(x+5,-24,x-5,-12,WOOD[3]);}
      p.line(-W+3,-8,-W+12,-2,LEAF[2]);p.line(W-4,-6,W-12,-1,LEAF[2]);
      doorway(p,0,0,8,21,wall,true);signY=-h+10;
    }else if(shape==="dome"){
      const h=34;
      p.ellipse(4,-h-8,W-7,17,C[0]);p.ellipse(4,-h-8,W-9,15,C[2]);p.ellipse(-2,-h-14,8,6,C[3]);
      p.rect(1,-h-30,6,8,C[1]);p.px(4,-h-31,GOLD[4]);
      box(p,-W,0,W*2,h,8,wall);
      p.rect(-W-2,-h+1,W*2+4,4,CREAM[3]);
      for(const x of [-W+5,-W+13,W-13,W-5])post(p,x,0,h-4,CREAM);
      for(const x of [-9,9])window(p,x,-20,C,o.active);
      p.rect(-W-2,-2,W*2+12,3,CREAM[2]);doorway(p,0,0,6,15,wall,o.open);signY=-h+11;
    }else if(shape==="portico"){
      const h=36,hall=id==="town-hall";
      box(p,-W,0,W*2,h,8,wall);
      if(hall){p.rect(-5,-h-34,10,16,CREAM[2]);p.rect(-4,-h-33,8,14,CREAM[3]);p.circle(0,-h-27,3,GOLD[3]);
        p.poly([[-7,-h-34],[0,-h-44],[7,-h-34]],C[2]);p.line(0,-h-44,0,-h-52,WOOD[0]);p.poly([[1,-h-52],[8,-h-49],[1,-h-46]],RED[3]);}
      p.poly([[-W-3,-h-3],[0,-h-19],[W+3,-h-3]],C[0]);p.poly([[-W,-h-4],[0,-h-17],[W,-h-4]],C[2]);
      p.rect(-W-3,-h-3,W*2+6,5,CREAM[3]);p.line(-W-3,-h+1,W+3,-h+1,CREAM[1]);
      for(const x of [-W+4,-W+12,W-12,W-4])post(p,x,0,h-3,CREAM);
      for(let i=0;i<3;i++)p.rect(-W-2-i*2,-1+i*2,W*2+4+i*4,2,CREAM[3-i]);
      doorway(p,0,0,7,20,wall,o.open);signY=-h-7;
    }else if(shape==="temple"){
      const h=28;
      for(let i=0;i<3;i++)p.rect(-W-6+i*3,-2-i*3,W*2+12-i*6,3,CREAM[2+(i%2)]);
      box(p,-W+4,-8,W*2-8,h,6,wall);
      p.poly([[-W-6,-h-6],[-W+2,-h-16],[W-2,-h-16],[W+6,-h-6],[W-4,-h-10],[-W+4,-h-10]],C[2]);
      p.line(-W+2,-h-16,W-2,-h-16,C[4]);
      p.rect(-W+10,-h-24,W*2-20,8,wall[2]);
      p.poly([[-W+4,-h-22],[-W+12,-h-32],[W-12,-h-32],[W-4,-h-22],[W-12,-h-26],[-W+12,-h-26]],C[1]);
      p.line(0,-h-32,0,-h-40,GOLD[3]);p.px(0,-h-41,GOLD[4]);
      for(const x of [-W+9,W-9])post(p,x,-8,h-4,CREAM);
      doorway(p,0,-8,6,15,wall,o.open);signY=-h-10;
    }else if(shape==="steeple"){
      const h=34;box(p,-W+8,0,W*2-8,h,8,wall);gable(p,W-4,h,-56,C);
      box(p,-W,0,15,h+22,5,wall);
      p.poly([[-W-2,-h-22],[-W+7,-h-48],[-W+16,-h-22]],C[0]);p.poly([[-W,-h-23],[-W+7,-h-45],[-W+14,-h-23]],C[2]);
      p.line(-W+7,-h-48,-W+7,-h-56,GOLD[3]);p.line(-W+4,-h-53,-W+10,-h-53,GOLD[3]);
      p.rect(-W+4,-h-12,7,9,STEEL[0]);p.line(-W+7,-h-12,-W+7,-h-4,GOLD[2]);
      p.circle(6,-24,5,C[1]);p.circle(6,-24,3,o.active?GOLD[3]:WATER[3]);
      doorway(p,6,0,6,15,wall,o.open);signX=W-10;signY=-h+12;
    }else if(shape==="pagoda"){
      for(const x of [-W+1,W-1])p.rect(x-1,-28,3,28,RED[2]);
      p.rect(-W-3,-28,W*2+6,3,RED[1]);p.rect(-W+1,-23,W*2-2,2,RED[2]);
      box(p,-14,0,28,22,6,WOOD);
      p.poly([[-24,-20],[-18,-29],[18,-29],[24,-20],[16,-24],[-16,-24]],C[2]);p.line(-18,-29,18,-29,C[4]);
      box(p,-9,-28,18,8,4,WOOD);
      p.poly([[-17,-36],[-11,-43],[11,-43],[17,-36],[10,-39],[-10,-39]],C[1]);
      p.line(0,-43,0,-52,GOLD[3]);p.px(0,-53,GOLD[4]);
      doorway(p,0,0,5,13,WOOD,o.open);if(o.active)p.glow(0,-8,6,GOLD[4],.22);signY=-14;
    }else if(shape==="sawtooth"){
      const h=34;box(p,-W,0,W*2,h,8,wall);siding(p,W,h,wall);
      const seg=(W*2)/3;
      for(let i=0;i<3;i++){const x0=-W+i*seg;
        p.poly([[x0,-h],[x0+seg-3,-h-15],[x0+seg,-h-15],[x0+seg,-h]],C[0]);p.poly([[x0+1,-h-1],[x0+seg-3,-h-13],[x0+seg-1,-h-13],[x0+seg-1,-h-1]],C[2]);
        p.line(x0+seg-1,-h-13,x0+seg-1,-h-1,WATER[3]);}
      stack(p,W-10,-h-34,6,STEEL);if(o.active)vapor(p,W-7,-h-34,t,o.seed,CREAM,3);
      p.rect(-14,-22,28,22,STEEL[0]);for(let y=-20;y<0;y+=3)p.line(-13,y,13,y,STEEL[o.open?1:3]);
      for(const x of [-W+7,W-7])window(p,x,-20,C,o.active);signX=-W+10;signY=-h+8;
    }else if(shape==="plant"){
      const h=24;box(p,-W+12,0,W*2-12,h,7,wall);
      p.poly([[-W-2,0],[-W+3,-26],[-W+1,-50],[-W+21,-50],[-W+19,-26],[-W+24,0]],CREAM[1]);
      p.poly([[-W,0],[-W+4,-26],[-W+2,-49],[-W+20,-49],[-W+18,-26],[-W+22,0]],CREAM[3]);
      p.ellipse(-W+11,-50,9,2,STEEL[0]);if(o.active)vapor(p,-W+11,-52,t,o.seed,CREAM,4);
      for(const x of [W-14,W-4]){p.line(x,-h-6,x-3,-h-30,STEEL[1]);p.line(x,-h-6,x+3,-h-30,STEEL[1]);}
      p.line(W-17,-h-26,W-1,-h-26,STEEL[1]);p.line(W-16,-h-20,W-2,-h-20,STEEL[1]);
      p.rect(W-16,-h-8,15,2,GOLD[2]);if(o.active)p.px(W-9,-h-29,GOLD[4]);
      doorway(p,8,0,6,16,wall,o.open);signX=W-12;signY=-h+8;
    }else if(shape==="vault"){
      const h=24;
      p.ellipse(4,-h-6,W+1,16,C[0]);p.ellipse(4,-h-6,W-1,14,C[2]);
      for(let x=-W+6;x<W;x+=7)p.line(x,-h-6-Math.round(Math.sqrt(Math.max(0,1-((x-4)/W)**2))*13),x,-h+2,C[1]);
      box(p,-W,0,W*2,h,8,wall);siding(p,W,h,wall);
      p.rect(-15,-20,30,20,STEEL[0]);for(let y=-18;y<0;y+=3)p.line(-14,y,14,y,STEEL[o.open?1:2]);
      for(const x of [-W+5,W-9])p.rect(x,-10,5,10,WOOD[2]);signX=-W+10;signY=-h+8;
    }else if(shape==="lab"){
      const h=32;box(p,-W,0,W*2,h,8,wall);
      p.ellipse(-8,-h-6,11,9,WATER[1]);p.ellipse(-8,-h-6,9,7,WATER[3]);p.px(-11,-h-10,CREAM[4]);
      p.line(W-6,-h-6,W-6,-h-26,STEEL[1]);p.line(W-10,-h-20,W-2,-h-20,STEEL[1]);p.px(W-6,-h-27,o.active&&wave(t,2)>0?RED[4]:RED[2]);
      p.rect(W-2,-20,7,20,STEEL[1]);p.rect(W-1,-19,5,18,LEAF[3]);
      for(const x of [-16,16])window(p,x,-18,C,o.active);doorway(p,0,0,7,19,wall,o.open);signY=-h+8;
    }else if(shape==="smithy"){
      const h=26;
      stack(p,-W+2,-h-34,11,STEEL);if(o.active)vapor(p,-W+7,-h-34,t,o.seed,CREAM,3);
      box(p,-W,0,W*2,h,7,STEEL);
      p.poly([[-W-4,-h+2],[-W-4,-h-6],[W+6,-h-16],[W+6,-h-8]],C[0]);p.poly([[-W-2,-h+1],[-W-2,-h-5],[W+4,-h-14],[W+4,-h-8]],C[2]);
      p.rect(-6,-20,W+2,20,STEEL[0]);p.rect(-5,-19,W,19,WOOD[0]);
      p.rect(-2,-10,12,10,STEEL[1]);p.rect(0,-9,8,4,o.active?GOLD[4]:RED[2]);if(o.active)p.glow(4,-8,8,GOLD[4],.3);
      p.rect(-W+6,-5,9,3,STEEL[1]);p.rect(-W+8,-2,5,2,STEEL[0]);signX=-W+12;signY=-h+9;
    }else if(shape==="gambrel"){
      const h=34;box(p,-W,0,W*2,h,8,RED);
      for(let x=-W+3;x<W;x+=4)p.line(x,-h+2,x,-2,RED[1]);
      p.poly([[-W-5,-h+2],[-W+1,-h-14],[-12,-h-25],[12,-h-25],[W-1,-h-14],[W+5,-h+2]],C[0]);
      p.poly([[-W-3,-h+1],[-W+2,-h-13],[-11,-h-23],[11,-h-23],[W-2,-h-13],[W+3,-h+1]],C[2]);
      p.line(-W+2,-h-13,W-2,-h-13,C[4]);
      p.rect(-5,-h-6,10,9,CREAM[4]);p.rect(-4,-h-5,8,7,WOOD[1]);
      p.rect(-13,-26,26,26,CREAM[4]);p.rect(-12,-25,24,25,o.open?STEEL[0]:RED[2]);
      if(!o.open){p.line(-12,-25,11,-1,CREAM[4]);p.line(11,-25,-12,-1,CREAM[4]);}signY=-h-3;
    }else if(shape==="stilts"){
      const fish=id==="fishing-hut";
      if(fish){p.ellipse(0,2,W+8,8,WATER[2]);p.ellipse(0,2,W+5,6,WATER[3]);}
      for(let x=-W+4;x<W;x+=12)post(p,x,0,14,WOOD);
      box(p,-W+2,-12,(W-2)*2,24,7,WOOD);siding(p,W-2,24,WOOD);gable(p,W-2,36,-56,C);
      p.line(0,-12,10,0,WOOD[3]);p.line(1,-12,11,0,WOOD[1]);for(let i=0;i<4;i++)p.px(2+i*2,-10+i*3,WOOD[4]);
      window(p,-12,-24,C,o.active);doorway(p,4,-12,5,13,WOOD,o.open);
      if(fish){p.line(W-2,-30,W+8,-10,WOOD[1]);for(let i=0;i<4;i++)p.line(W+2+i*2,-22+i*4,W-4+i*2,-18+i*4,CREAM[2]);}
      signX=-12;signY=-42;
    }else if(shape==="aframe"){
      p.ellipse(W+4,-2,12,5,WATER[2]);p.ellipse(W+4,-2,10,4,WATER[3]);
      p.poly([[-W-3,0],[0,-38],[W+3,0]],C[0]);p.poly([[-W-1,-1],[0,-36],[W+1,-1]],C[2]);
      p.poly([[-W+6,-1],[0,-28],[W-6,-1]],WOOD[2]);
      p.ellipse(0,-6,5,6,WOOD[0]);p.rect(-5,-6,10,6,WOOD[0]);p.ellipse(0,-6,4,5,o.open?STEEL[0]:WOOD[1]);
      p.line(-W-3,0,0,-38,C[4]);signY=-18;
    }else if(shape==="glass"){
      const h=28,G=[STEEL[0],WATER[1],WATER[2],WATER[3],CREAM[4]];
      box(p,-W,0,W*2,h,8,G);
      for(let x=-W+6;x<W;x+=6)p.line(x,-h+1,x,-1,STEEL[2]);p.line(-W+1,-h/2,W-2,-h/2,STEEL[2]);
      for(let x=-W+4;x<W-2;x+=5)p.rect(x,-6,3,4,LEAF[(x>>2)&1?2:3]);
      gable(p,W,h,-48,G);for(let x=-W+2;x<W;x+=8)p.line(x,-h-4,x/2,-46,STEEL[2]);
      doorway(p,0,0,6,17,STEEL,o.open);signY=-h-2;
    }else if(shape==="pen"){
      const sheep=id==="sheep-pen";
      p.rect(-W,-24,W*2,22,sheep?LEAF[1]:WOOD[1]);p.rect(-W+1,-23,W*2-2,20,sheep?LEAF[2]:WOOD[0]);
      for(let i=0;i<10;i++)p.px(-W+4+((i*13)%(W*2-8)),-20+((i*7)%16),sheep?LEAF[3]:WOOD[2]);
      box(p,-W+2,-22,22,18,5,WOOD);
      p.poly([[-W-1,-38],[-W-1,-42],[-W+26,-46],[-W+26,-41]],C[2]);
      doorway(p,-W+13,-22,4,10,WOOD,o.open);
      p.rect(W-16,-10,12,4,WOOD[1]);p.rect(W-15,-9,10,2,sheep?LEAF[3]:GOLD[2]);
      for(let x=-W+2;x<W;x+=10)post(p,x,0,14,WOOD);
      p.line(-W,-11,W,-11,WOOD[4]);p.line(-W,-6,W,-6,WOOD[3]);
      for(let x=-W+2;x<W;x+=10)post(p,x,-24,8,WOOD);p.line(-W,-29,W,-29,WOOD[3]);
      signX=W-10;signY=-34;
    }else if(shape==="leanto"){
      const h=28,hunter=id==="hunter-hut";
      box(p,-W,0,W*2,h,7,WOOD);siding(p,W,h,WOOD);
      p.poly([[-W-5,-h+3],[-W-5,-h-5],[W+6,-h-19],[W+6,-h-11]],C[0]);p.poly([[-W-3,-h+2],[-W-3,-h-4],[W+4,-h-17],[W+4,-h-11]],C[2]);
      if(hunter){p.line(-4,-h+2,-9,-h-5,CREAM[3]);p.line(4,-h+2,9,-h-5,CREAM[3]);p.line(-7,-h-2,-11,-h,CREAM[3]);p.line(7,-h-2,11,-h,CREAM[3]);
        p.line(W-2,-16,W+9,-16,WOOD[1]);p.rect(W+1,-15,6,9,WOOD[3]);}
      else{p.rect(W-1,-9,10,9,GOLD[1]);p.rect(W,-8,8,7,GOLD[3]);p.line(W,-5,W+7,-5,GOLD[1]);}
      window(p,-15,-15,C,o.active);doorway(p,6,0,7,19,WOOD,o.open);signX=6;signY=-h+9;
    }else if(shape==="ponds"){
      for(const [x,y] of [[-W+2,-2],[2,-2]]){p.rect(x,y-14,W-4,14,STEEL[1]);p.rect(x+1,y-13,W-6,12,WATER[2]);
        p.line(x+2,y-10+Math.round(wave(t,1,x)*1),x+8,y-10,WATER[4]);}
      box(p,-12,-18,24,18,6,WOOD);p.poly([[-16,-34],[0,-44],[16,-34],[16,-30],[-16,-30]],C[2]);
      doorway(p,0,-18,4,10,WOOD,o.open);for(const x of [-W,W-1,0])post(p,x,0,8,WOOD);signY=-28;
    }else{ // a gabled cottage, with something of its trade beside it
      const h=33;box(p,-W,0,W*2,h,8,wall);siding(p,W,h,wall);gable(p,W,h,-54,C);
      exhaust(p,W-11,-52,7,15,WOOD);if(o.active&&index%2===0)vapor(p,W-8,-52,t,o.seed,CREAM,2);
      for(const x of [-17,17])window(p,x,-18,C,o.active);doorway(p,0,0,8,21,wall,o.open);
      if(id==="lumber-house")for(let i=0;i<5;i++)p.circle(W+3+(i%3)*5-(i>2?-2:0),-3-(i>2?5:0),3,WOOD[i%2?2:3]);
      if(id==="mining-house"){p.rect(W-1,-8,12,6,STEEL[1]);p.rect(W,-7,10,3,STEEL[3]);p.circle(W+2,-1,2,STEEL[0]);p.circle(W+8,-1,2,STEEL[0]);p.px(W+4,-9,GOLD[3]);}
      signY=-h+10;
    }
    if(signs[id]&&signY!==null){
      p.rect(signX-8,signY-5,17,12,WOOD[1]);p.line(signX-7,signY-5,signX+7,signY-5,GOLD[3]);
      icon(p,signs[id],signX,signY,0);
    }
    if(mode!=="tower"&&mode!=="gate")for(let i=0;i<4;i++)if(rand(i,3,o.seed)>0.31)p.px(-W+3+i*3,-2,wall[4]);
  });
  return {...fx,meta:{...fx.meta,collision:{width:W*2,height:mode==="tower"?18:22}}};
}

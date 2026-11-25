import { clamp } from "../../core/index.js";
import { CREAM, GOLD, LEAF, RED, WATER } from "./art.js";
import { frame, icon, itemGrid, label, slot, ui } from "./farm-ui.js";

const looks = {
  buttons:"main-menu pause-menu game-over-menu respawn-menu credits-menu",
  settings:"settings-menu character-creation",
  vertical:"save-slot-menu recipe-book skill-detail quest-log quest-detail achievement-menu bestiary relationship-menu animal-management farm-management sell-menu trade-menu",
  inventory:"character-menu equipment-menu backpack-menu expanded-inventory chest-inventory build-menu collection-book museum-menu merchant-menu",
  process:"crafting-queue building-upgrade-menu machine-interface furnace-interface fishing-menu cooking-menu alchemy-menu enchanting-menu repair-menu upgrade-menu",
  map:"land-purchase-menu world-map fast-travel-menu",
  skills:"skill-tree",
};
const samples = {
  "main-menu":["PLAY","LOAD","SETTINGS","QUIT"],"pause-menu":["RESUME","SAVE","SETTINGS","QUIT"],
  "game-over-menu":["RETRY","LOAD SAVE","EXIT"],"respawn-menu":["RETURN TO CAMP","LOAD SAVE"],
  "save-slot-menu":["MEADOW FARM","ISLAND CAMP","EMPTY SLOT"],"settings-menu":["MUSIC","SOUND","BRIGHTNESS"],
  "character-creation":["HOOD","SCARF","COAT","SKIN"],"quest-log":["FIRST HARVEST","MINE STONE","VISIT THE DOCK"],
  "quest-detail":["FIRST HARVEST","GATHER 5 CROPS","REWARD 20 GOLD"],"recipe-book":["PLANKS","STONE BRICKS","GEAR"],
  "skill-detail":["WOODCUTTING","GATHER MORE WOOD","REQUIRES 1 POINT"],"achievement-menu":["NEW BEGINNINGS","GREEN THUMB","ISLAND BUILDER"],
  bestiary:["SLIME","FOREST BAT","STONE GOLEM"],"relationship-menu":["FARMER","FISHER","BLACKSMITH"],
  "animal-management":["CHICKEN","COW","SHEEP"],"farm-management":["WATERED PLOTS","READY CROPS","EMPTY PLOTS"],
  "sell-menu":["WOOD","STONE","BERRIES"],"trade-menu":["YOUR OFFER","THEIR OFFER","CONFIRM TRADE"],
};
const itemIds=["wood","stone","seed","carrot","brick","gear","coin","gold-ingot","soup","fish","milk","leaf","hammer","magic-orb","rope","egg","iron-ingot","rice"];
const processItems={
  "crafting-queue":["wood","stone","gear"],"building-upgrade-menu":["wood","stone","brick"],
  "machine-interface":["gear","coal","iron-ingot"],"furnace-interface":["iron-ore","coal","iron-ingot"],
  "fishing-menu":["fish","raw-fish","fish-roe"],"cooking-menu":["carrot","potato","soup"],
  "alchemy-menu":["magic-dust","quartz","small-energy-potion"],"enchanting-menu":["steel-ingot","ruby","magic-orb"],
  "repair-menu":["gear","iron-ingot","repair-kit"],"upgrade-menu":["stone","gold-ingot","gear"],
};
const words=id=>id.replace(/-menu$|-/g,m=>m==="-menu"?"":" ").toUpperCase();
export function gameMenu(id){
  const kind=Object.keys(looks).find(k=>looks[k].split(" ").includes(id));
  return ui(id.replaceAll("-"," "),`A configurable ${id.replaceAll("-"," ")} panel with selection and display data.`,
    192,144,{title:words(id),entries:samples[id]??["CONTINUE","BACK"],items:processItems[id]??itemIds,selected:0,value:.62,footer:"CLOSE"},(p,_phase,C,o)=>{
    frame(p,-93,-69,186,138,C);
    p.rect(-83,-60,166,15,C[0]);p.text(String(o.title).slice(0,25),0,-56,GOLD[4],{font:"mini",align:"center"});
    label(p,o.footer,-79,55,22,C[4]);
    const entries=Array.isArray(o.entries)?o.entries:[];
    const selected=Number(o.selected);
    if(kind==="map"){
      p.rect(-80,-40,159,85,WATER[1]);
      for(let i=0;i<8;i++){
        const x=i%4*36-69,y=Math.floor(i/4)*38-31;
        p.poly([[x,y+10],[x+7,y],[x+19,y+2],[x+24,y+15],[x+15,y+19],[x+4,y+17]],LEAF[i===selected?3:1]);
        if(i===selected)p.circle(x+12,y+10,2.8,GOLD[4]);
        if(id==="land-purchase-menu"&&i>1)p.px(x+11,y+5,GOLD[3]);
      }
    }else if(kind==="inventory"){
      itemGrid(p,C,0,o,{x:-64,y:-36,cols:8,rows:5});
      if(id==="equipment-menu"||id==="character-menu"){p.rect(-83,-36,13,80,C[0]);for(let y=-29;y<43;y+=17)p.px(-77,y,GOLD[4]);}
    }else if(kind==="process"){
      for(const [i,item] of o.items.slice(0,3).entries()){
        const x=-61+i*49;slot(p,x,-21,C,i===selected);icon(p,item,x+7,-14,0);
        if(i<2)p.line(x+23,-14,x+34,-14,C[4]);
      }
      p.rect(-58,10,116,10,C[0]);p.rect(-57,11,114*clamp(o.value),8,LEAF[3]);
    }else if(kind==="skills"){
      for(let i=0;i<12;i++){
        const x=i%4*39-64,y=Math.floor(i/4)*27-35;
        if(i%4)p.line(x-22,y+7,x,y+7,C[4]);
        if(i>=4)p.line(x+7,y-12,x+7,y,C[3]);
        slot(p,x,y,C,i===selected);icon(p,o.items[i],x+7,y+7,0);
      }
    }else{
      for(const [i,entry] of entries.slice(0,5).entries()){
        const y=-35+i*16,x=kind==="buttons"?-47:-73,w=kind==="buttons"?94:147;
        p.rect(x,y,w,13,i===selected?C[3]:C[0]);p.line(x+1,y+1,x+w-2,y+1,i===selected?GOLD[4]:C[2]);
        label(p,entry,x+5,y+4,kind==="buttons"?20:27,CREAM[4]);
        if(kind==="settings"){p.rect(4,y+6,65,3,C[1]);p.circle(4+64*clamp(o.value),y+7,2,GOLD[4]);}
      }
      if(id==="game-over-menu")p.circle(59,-19,8,RED[2]);
    }
  },{duration:1,fps:1});
}

import { asset, CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, box, round } from "./art.js";
const accents={health:RED,energy:WATER,luck:GOLD,speed:LEAF,magnet:VIOLET,defense:STEEL,strength:WOOD,
  iron:STEEL,golden:GOLD,crystal:WATER,leather:WOOD,wooden:WOOD,large:WOOD,magic:VIOLET,mining:STEEL,
  farming:LEAF,explorer:LEAF,fire:RED,ice:WATER};
const descriptions={
 helmet:"A fitted helmet with a light brow and shaded face opening.",
 armor:"A front-facing torso plate with shoulders and a lower hem.",
 boots:"A matched pair of boots with reinforced toes.",
 gloves:"A pair of work gloves with broad cuffs.",
 backpack:"A backpack with a front pocket, bright clasp and shoulder straps.",
 ring:"A ring with a polished stone set in the band.",
 amulet:"A hanging amulet with a faceted pendant.",
 cape:"A draped cape with a darker lining and neck clasp.",
};
export function gearSprite(id){
  const [prefix,kind]=id.split("-"), palette=accents[prefix];
  return asset({name:id.replaceAll("-"," "),desc:descriptions[kind],size:[48,48],origin:[24,36],palette,
    tags:["equipment",kind,prefix],bg:"dark",duration:1,fps:1},(p,_phase,C)=>{
    if(kind==="helmet"){
      p.poly([[-13,-9],[-12,-24],[-8,-30],[6,-31],[12,-24],[13,-8],[7,-3],[6,-14],[-6,-14],[-7,-3]],C[0]);
      p.poly([[-11,-11],[-10,-23],[-7,-29],[5,-29],[10,-23],[11,-11],[7,-6],[6,-16],[-7,-16]],C[2]);
      p.polyline([[-10,-24],[-6,-29],[3,-29],[8,-26]],C[4]);p.line(-8,-17,8,-17,C[3]);
    }else if(kind==="armor"){
      p.poly([[-14,-24],[-6,-29],[-3,-26],[3,-26],[6,-29],[14,-24],[12,-17],[9,-16],[9,-4],[-9,-4],[-9,-16],[-12,-17]],C[0]);
      p.poly([[-12,-23],[-7,-27],[-3,-24],[3,-24],[7,-27],[12,-23],[10,-18],[7,-18],[7,-6],[-7,-6],[-7,-18],[-10,-18]],C[2]);
      p.polyline([[-6,-22],[0,-19],[6,-22]],C[4]);p.line(-8,-9,8,-9,C[3]);
    }else if(kind==="boots"||kind==="gloves"){
      for(const x of [-7,7]){
        const top=kind==="boots"?-24:-19;
        p.poly([[x-4,top],[x+4,top],[x+4,-10],[x+7,-7],[x+7,-3],[x-6,-3],[x-6,-8],[x-4,-12]],C[0]);
        p.poly([[x-3,top+1],[x+3,top+1],[x+3,-10],[x+6,-6],[x+5,-5],[x-5,-5],[x-4,-8]],C[2]);
        p.line(x-3,top+2,x+3,top+2,C[4]);p.line(x-4,-5,x+5,-5,C[3]);
      }
    }else if(kind==="backpack"){
      const w=prefix==="large"?25:20;
      p.arc(0,-23,7,2,Math.PI,Math.PI*2,C[2]);box(p,-w/2,-4,w,19,4,C);
      p.rect(-7,-15,14,9,C[1]);p.line(-6,-15,6,-15,C[4]);p.rect(-2,-13,4,4,GOLD[3]);
      p.line(-w/2+1,-22,-w/2+1,-8,C[4]);
      if(prefix==="wooden")for(const y of [-18,-12,-8])p.line(-8,y,8,y,C[3]);
    }else if(kind==="ring"){
      p.ring(0,-13,10,3.4,GOLD[1]);p.arc(0,-13,9,1.8,0,4.4,GOLD[4]);
      p.poly([[0,-29],[6,-24],[5,-19],[-5,-19],[-6,-24]],C[1]);
      p.poly([[0,-28],[4,-24],[0,-20],[-4,-24]],C[3]);p.px(-1,-25,C[4]);
    }else if(kind==="amulet"){
      p.polyline([[-10,-29],[-7,-19],[0,-12],[7,-19],[10,-29]],GOLD[2]);
      p.line(-9,-28,-6,-19,GOLD[4]);round(p,0,-10,6.3,7.4,C);p.px(0,-12,CREAM[4]);
    }else{
      p.poly([[-5,-28],[6,-27],[12,-12],[13,-2],[4,-5],[-3,-3],[-13,-2],[-12,-12]],C[0]);
      p.poly([[-4,-27],[5,-26],[10,-13],[11,-4],[4,-7],[-3,-5],[-11,-4],[-10,-12]],C[2]);
      p.line(-5,-24,-9,-6,C[4]);p.line(3,-22,6,-8,C[1]);round(p,0,-25,2.6,2.2,GOLD);
    }
  });
}

import { asset, CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, plate, round } from "./art.js";

const groups = {
  sword:"wooden-sword stone-sword copper-sword iron-sword steel-sword golden-sword crystal-sword obsidian-sword dagger greatsword",
  pole:"spear battle-axe", bow:"wooden-bow longbow crossbow magic-bow",
  shield:"wooden-shield iron-shield golden-shield crystal-shield",
  staff:"magic-staff fire-staff ice-staff lightning-staff poison-staff magic-wand",
  thrown:"boomerang", arrow:"arrow fire-arrow ice-arrow explosive-arrow",
};
const nature={wooden:WOOD,stone:["#373943","#575963","#72797a","#a4a79b","#d0cdb7"],
  copper:["#503540","#835243","#b47752","#de9962","#ffd391"],iron:["#322f3b","#55505a","#78717b","#99919a","#dbcec3"],steel:STEEL,
  golden:GOLD,crystal:WATER,obsidian:VIOLET,magic:VIOLET,fire:RED,ice:WATER,lightning:GOLD,poison:LEAF,explosive:RED};
const details={
  sword:"An outlined blade with a beveled edge and wrapped grip.",
  pole:"A two-handed pole weapon with an outlined steel head.",
  bow:"A curved game bow with a taut string and grip.",
  shield:"A beveled shield with a colored crest and riveted rim.",
  staff:"A fantasy casting implement with a faceted focus.",
  thrown:"A curved wooden boomerang with capped tips.",
  arrow:"A fletched game arrow with a colored tip.",
};
function shaft(p,x,y,ex,ey,C=WOOD){p.beam(x,y,ex,ey,3,C[0]);p.line(x,y,ex,ey,C[2]);p.line(x-1,y,ex-1,ey,C[3]);}
export function weaponSprite(id){
  const kind=Object.keys(groups).find(k=>groups[k].split(" ").includes(id));
  const palette=nature[id.split("-")[0]]??STEEL;
  return asset({name:id.replaceAll("-"," "),desc:details[kind],size:[48,48],origin:[24,38],palette,
    tags:["weapon",kind],bg:"dark",duration:1,fps:1},(p,_phase,C)=>{
    if(kind==="sword"){
      const l=id==="dagger"?15:id==="greatsword"?30:24,w=id==="greatsword"?5:3;
      shaft(p,-9,-1,-4,-10);
      p.beam(-8,-13,1,-7,3,C[1]);p.line(-8,-13,1,-7,C[4]);
      p.poly([[-5-w,-11],[0,-l+3],[12,-l-5],[10,-l+4],[-5+w,-9]],C[0]);
      p.poly([[-6,-11],[1,-l+3],[11,-l-3],[8,-l+4],[-3,-10]],C[2]);
      p.line(-4,-12,11,-l-3,C[4]);p.px(-10,-1,GOLD[4]);
    }else if(kind==="pole"){
      shaft(p,-11,1,8,-28);
      if(id==="spear"){
        p.poly([[4,-24],[6,-31],[15,-36],[12,-28],[8,-25]],C[1]);p.line(7,-31,14,-35,C[4]);
      }else{
        p.poly([[5,-28],[12,-34],[19,-32],[20,-24],[15,-19],[8,-23]],C[1]);
        p.polyline([[12,-33],[18,-31],[19,-25],[15,-20]],C[4]);
      }
    }else if(kind==="bow"){
      const r=id==="longbow"?17:13, y=-16;
      p.arc(0,y,r,3,-1.3,1.3,C[1]);p.arc(0,y,r-1,1.8,-1.3,1.3,C[4]);
      p.line(r*0.27,y-r*0.96,r*0.27,y+r*0.96,CREAM[3]);
      p.line(r-4,y+1,r,y+1,WOOD[3]);
      if(id==="crossbow"){shaft(p,-13,y+3,12,y-1,WOOD);p.line(-10,y+1,17,y-3,C[3]);}
      if(id==="magic-bow"){p.px(r-3,y,C[4]);p.glow(r-2,y,5,C[3],0.3);}
    }else if(kind==="shield"){
      plate(p,[[-13,-24],[0,-30],[13,-24],[12,-12],[7,-6],[0,-1],[-7,-6],[-12,-12]],C);
      p.polyline([[-12,-23],[0,-29],[11,-24]],C[4]);
      plate(p,[[-10,-22],[0,-26],[10,-22],[9,-12],[5,-8],[0,-4],[-5,-8],[-9,-12]],C,1);
      for(const [x,y] of [[-10,-21],[10,-21],[-8,-11],[8,-11],[0,-27]])p.px(x,y,C[4]);
      p.poly([[0,-23],[6,-17],[0,-9],[-6,-17]],GOLD[3]);p.line(0,-22,0,-10,GOLD[4]);
    }else if(kind==="staff"){
      const y=id==="magic-wand"?-21:-31;
      shaft(p,-9,1,5,y);
      plate(p,[[5,y-5],[11,y-1],[8,y+5],[3,y+6],[0,y]],C,3);
      p.line(5,y-3,3,y+3,C[2]);p.px(4,y-3,C[4]);p.px(3,y-2,C[4]);
      p.glow(5,y,5,C[3],0.25);
    }else if(kind==="arrow"){
      p.line(-12,0,12,-23,WOOD[3]);p.line(-11,0,12,-22,WOOD[4]);
      p.poly([[9,-23],[17,-27],[14,-19],[11,-22]],C[2]);p.line(10,-23,16,-26,C[4]);
      p.line(-11,0,-11,-7,id==="arrow"?CREAM[3]:C[3]);p.line(-11,0,-4,2,id==="arrow"?CREAM[4]:C[4]);
      if(id==="explosive-arrow"){p.ellipse(11,-21,3.4,2.7,C[1]);p.px(13,-23,GOLD[4]);}
    }else{
      p.poly([[-14,-24],[-4,-21],[4,-14],[15,-11],[13,-5],[1,-8],[-10,-15]],WOOD[1]);
      p.polyline([[-13,-23],[-4,-19],[4,-13],[14,-10]],WOOD[4]);
      round(p,-11,-20,2,2,GOLD);round(p,11,-9,2,2,GOLD);
    }
  });
}

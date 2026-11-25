import { ease, rand, seg, TAU } from "../../core/index.js";
import { asset, CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, box, post, round, wave } from "./art.js";
import { hot, vapor } from "./machine.js";
import { groundShadow, twinkle } from "./sprite.js";
import { terrain } from "./world-terrain.js";

const props={
  floor:"dungeon-floor cracked-floor collapsing-floor rune-floor",
  wall:"dungeon-wall dungeon-wall-corner iron-bars prison-cell",
  portal:"dungeon-entrance dungeon-exit dungeon-door locked-door boss-door prison-gate dungeon-complete-portal",
  trap:"spike-trap arrow-trap fire-trap poison-trap falling-rock-trap swinging-blade-trap",
  switch:"pressure-plate floor-button wall-button lever rotating-switch",
  block:"pushable-block rune-block puzzle-pedestal dungeon-pillar dungeon-stairs",
  optics:"magic-crystal laser-emitter laser-receiver rotating-mirror",
  shrine:"ancient-statue ancient-altar sacrifice-altar healing-fountain mana-fountain enemy-spawner boss-summoning-circle",
  light:"dungeon-torch dungeon-brazier", remains:"cobweb skeleton-remains",
  storage:"dungeon-barrel dungeon-crate dungeon-chest boss-chest",
};
function rune(p,x,y,C,a=1){
  p.polyline([[x-4,y+2],[x,y-4],[x+4,y+2],[x-4,y+2]],C[3],a);p.px(x,y,C[4]);
}
export function dungeonAsset(id){
  const kind=Object.keys(props).find(k=>props[k].split(" ").includes(id));
  if(kind==="floor"&&id!=="collapsing-floor"&&id!=="rune-floor")return terrain(id,id==="cracked-floor"?"crack":"floor","graveyard");
  if(id==="dungeon-wall"||id==="dungeon-wall-corner")return terrain(id,"wall","graveyard");
  if(id==="dungeon-stairs")return terrain(id,"stairs","graveyard");
  const magic=/boss|mana|rune|magic|receiver|emitter|summon/.test(id);
  const C0=magic?VIOLET:/crate|barrel|door|web/.test(id)?WOOD:/poison|healing/.test(id)?LEAF:STEEL;
  const isTrap=kind==="trap"||id==="collapsing-floor";
  const fx=asset({name:id.replaceAll("-"," "),desc:`A dungeon ${id.replaceAll("-"," ")} with a top-down footprint.`,tags:["dungeon",kind],
    size:[64,64],origin:[32,49],duration:isTrap?1.15:2.5,fps:16,options:{active:true,open:false},palette:C0},(p,t,C,o)=>{
    const active=o.active, phase=active?t:0;
    const u=wave(phase),press=o.open?2:active?Math.round((1+u)*1.3):0;
    if(kind!=="remains")groundShadow(p,0,0,17,4);
    if(kind==="floor"||kind==="switch"){
      const w=kind==="floor"?17:13;
      box(p,-w,0,w*2,4,7,C);
      p.poly([[-w+2,-4],[-w+6,-9],[w+3,-9],[w-1,-4]],C[1]);
      if(id==="lever"){
        p.beam(0,-7,7+u*5,-24,4,WOOD[2]);round(p,7+u*5,-24,3,3,RED);
      }else if(id==="rotating-switch"){
        p.ellipse(0,-7,8,3.8,C[2]);p.line(0,-7,Math.cos(phase*TAU)*7,-7+u*3,C[4]);
      }else if(id==="rune-floor"){
        rune(p,0,-7,C);p.glow(0,-7,9,C[3],0.18+.14*u);
      }else{
        if(id==="pressure-plate")p.rect(-9,-11+press,19,5,C[3]);
        else p.ellipse(0,-9+press,8,3.5,id==="collapsing-floor"?C[0]:C[3]);
        p.line(-4,-10+press,4,-10+press,C[4]);
        if(id==="wall-button"){post(p,0,0,23,C);p.circle(0,-20,4,RED[3]);}
      }
    }else if(kind==="portal"){
      const glow=/complete|boss/.test(id)&&active;
      p.poly([[-20,0],[-20,-25],[-15,-38],[-9,-42],[9,-42],[15,-38],[20,-25],[20,0]],STEEL[0]);
      p.polyline([[-18,0],[-18,-26],[-13,-37],[-7,-40],[7,-40],[13,-37],[18,-26],[18,0]],STEEL[3]);
      p.poly([[-13,0],[-13,-24],[-8,-33],[8,-33],[13,-24],[13,0]],o.open?STEEL[0]:C[2]);
      if(id==="dungeon-exit"){p.tri(-5,-21,0,-28,5,-21,GOLD[4]);p.line(0,-22,0,-16,GOLD[3]);}
      if(glow){p.ellipse(0,-16,10,14,C[1]);rune(p,0,-16,C);p.glow(0,-16,10,C[3],.25);}
      if(id.includes("locked")){p.rect(-4,-15,9,8,GOLD[2]);p.px(0,-11,STEEL[0]);}
      if(id==="prison-gate")for(let x=-10;x<=10;x+=5)p.line(x,-26,x,0,STEEL[3]);
    }else if(kind==="wall"){
      for(let x=-15;x<=15;x+=5){p.beam(x,0,x,-30,3,C[1]);p.line(x-1,0,x-1,-30,C[3]);}
      p.line(-16,-21,16,-21,C[4]);p.line(-16,-4,16,-4,C[3]);
      if(id==="prison-cell"){post(p,-18,0,35,STEEL);post(p,18,0,35,STEEL);p.line(-17,-30,17,-30,STEEL[3]);}
    }else if(kind==="trap"){
      box(p,-17,0,34,6,6,C);
      const burst=active?ease.outQuart(seg(t,0.2,0.46))*(1-seg(t,.58,.96)):0;
      if(id==="spike-trap")for(let x=-12;x<16;x+=6)p.tri(x-2,-7,x,-7-burst*15,x+2,-7,C[4]);
      else if(id==="arrow-trap"){
        box(p,-15,0,9,23,4,C);for(let i=0;i<3;i++){const x=-8+t*27;if(burst>0.09)p.line(x-3,-12+i*3,x+5,-12+i*3,C[4],burst);}
      }else if(id==="falling-rock-trap")round(p,1,-28+burst*18,8,7,C);
      else if(id==="swinging-blade-trap"){
        post(p,0,0,33,C);const x=u*16;p.line(0,-31,x,-9-Math.abs(x)/4,C[3]);p.arc(x,-9-Math.abs(x)/4,7,3,0.1,3,C[4]);
      }else if(id==="poison-trap"){if(burst>0.01)for(let i=0;i<6;i++)p.disc(i*5-12,-8-burst*(3+i%3*3),4,LEAF[3],burst*.48);}
      else if(burst>0.08)hot(p,-13,-23,26,17,t,true);
    }else if(kind==="block"){
      const h=id==="dungeon-pillar"?35:id==="rune-block"?19:15;
      box(p,-13,0,26,h,6,C);p.line(-11,-4,11,-4,C[3]);
      if(id.includes("rune")||id.includes("pedestal")){rune(p,0,-h+1,C);if(active)p.glow(0,-h,8,C[3],.19);}
    }else if(kind==="optics"){
      box(p,-11,0,22,8,4,C);post(p,0,-4,16,C);
      p.poly([[0,-33],[9,-25],[7,-16],[0,-12],[-7,-16],[-9,-26]],C[1]);
      p.poly([[0,-31],[7,-25],[0,-14],[-6,-24]],C[3]);p.line(0,-31,0,-15,C[4]);
      if(active&&id!=="magic-crystal"){
        const x=id==="rotating-mirror"?u*25:id==="laser-receiver"?-24:25;
        p.line(0,-22,x,-22+u*3,C[4]);p.glow(0,-22,10,C[3],.3);
      }
    }else if(kind==="shrine"){
      const isCircle=/spawner|circle/.test(id);
      p.ellipse(0,-2,20,7,C[1]);p.ellipse(0,-4,17,4.5,(/fountain/.test(id)?WATER:C)[2]);
      if(!isCircle)box(p,-12,-4,24,13,5,C);
      if(id==="ancient-statue"){p.beam(0,-15,0,-29,12,C[2]);round(p,0,-31,6.8,6.5,C);}
      else if(isCircle||active)rune(p,0,isCircle?-5:-18,C);
      if(id==="sacrifice-altar"){p.line(-12,-11,11,-11,RED[2]);p.circle(0,-22,4,RED[3]);}
      if(active)for(let i=0;i<4;i++)twinkle(p,(rand(i,2,o.seed)-.5)*30,-8-((phase+i/4)%1)*23,1.9,C[3],C[4]);
    }else if(kind==="light"){
      if(id==="dungeon-brazier"){for(const x of [-7,7])post(p,x,0,12,C);}
      else post(p,0,0,22,C);
      const y=id==="dungeon-brazier"?-12:-20;
      p.ellipse(0,y,10,5,C[3]);hot(p,-8,y-9,17,10,phase,active);if(active)vapor(p,0,y-10,phase,o.seed,CREAM,3);
    }else if(kind==="remains"){
      if(id==="cobweb"){
        for(let i=0;i<6;i++){const a=i*TAU/6;p.line(0,-19,Math.cos(a)*20,-19+Math.sin(a)*17,CREAM[2]);}
        for(const d of [6,12,18])p.arc(0,-19,d,1,0,TAU,CREAM[2]);
      }else{
        for(let i=0;i<4;i++){const x=i*6-10;p.line(x,-2,x+6,-10,CREAM[3]);p.px(x,-2,CREAM[4]);}
        round(p,1,-9,8,7,CREAM);p.rect(-3,-12,3,3,STEEL[0]);p.rect(3,-12,3,3,STEEL[0]);
      }
    }else{
      const w=id.includes("boss")?18:13;
      if(id.includes("barrel")){round(p,0,-10,12,13,C);p.ellipse(0,-20,11,4,C[3]);p.line(-9,-8,9,-8,C[1]);}
      else {box(p,-w,0,w*2,15,4,C);p.poly([[-w,-15],[w,-15],[w+3,o.open?-25:-19],[-w+3,o.open?-25:-19]],C[2]);
        p.rect(-4,-16,8,6,GOLD[3]);p.px(0,-13,C[0]);}
    }
  });
  return {...fx,meta:{...fx.meta,collision:{width:kind==="portal"?22:kind==="wall"?30:kind==="block"?26:0,height:10},
    ...(isTrap?{events:{contact:fx.meta.duration*.46,damage:fx.meta.duration*.5}}:{})}};
}

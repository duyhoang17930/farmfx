import { rand } from "../../core/index.js";
import { asset, CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, box, post, round, wave } from "./art.js";
import { groundShadow, twinkle } from "./sprite.js";
import { hot, tank, vapor } from "./machine.js";

const types={
 table:"wooden-table dining-table chair stool kitchen-counter", bed:"bed double-bed",
 cabinet:"wardrobe bookshelf cabinet refrigerator", fire:"stove fireplace torch campfire brazier street-lamp",
 fabric:"rug carpet flag banner", wall:"wall-clock painting window", door:"wooden-door stone-door metal-door",
 nature:"flower-pot fountain statue", sign:"notice-board quest-board",
 cart:"market-cart wheelbarrow minecart", rail:"minecart-track",
 tank:"water-tank water-pump", pile:"wooden-pallet stone-pile wood-pile", chest:"treasure-chest silver-chest golden-chest crystal-chest locked-chest large-storage-chest donation-box resource-crate trash-bin",
};
function shelf(p,w,h,C,open){
  box(p,-w,0,w*2,h,5,C);p.rect(-w+2,-h+3,w*2-4,h-6,C[open?0:1]);
  p.line(-w+3,-h/2,w-3,-h/2,C[3]);p.line(0,-h+4,0,-4,C[3]);
  p.px(-3,-h/2-2,C[4]);p.px(3,-h/2-2,C[4]);
}
export function sceneProp(id){
  const kind=Object.keys(types).find(k=>types[k].split(" ").includes(id));
  const palette=/silver|stone|metal|refrigerator|minecart|statue|stove|trash/.test(id)?STEEL:/gold|locked|treasure/.test(id)?GOLD:
    /crystal|painting|carpet/.test(id)?VIOLET:/rug|banner|flag|double-bed/.test(id)?RED:/water|cream|fountain/.test(id)?WATER:WOOD;
  const motion=["fire","fabric","nature","tank","wall"].includes(kind);
  const fx=asset({name:id.replaceAll("-"," "),desc:`A top-down ${id.replaceAll("-"," ")} prop with shaded surfaces.`,
    tags:["object",kind],size:[64,64],origin:[32,52],palette,bg:"field",duration:motion?2:1,fps:motion?12:1,
    options:{open:false,active:true}},(p,t,C,o)=>{
    const wiggle=wave(t);
    groundShadow(p,0,0,18,4);
    if(kind==="table"){
      const w=id==="dining-table"?39:id==="chair"||id==="stool"?16:28;
      const h=id==="kitchen-counter"?15:10;
      for(const x of [-w/2+3,w/2-3])post(p,x,0,h,C);
      box(p,-w/2,-h+3,w,5,7,C);
      p.line(-w/2+4,-h-6,w/2-5,-h-6,C[4]);
      if(id==="chair"){post(p,-6,-10,15,C);post(p,7,-10,15,C);p.rect(-8,-25,17,5,C[2]);}
      if(id==="dining-table")for(const x of [-8,8])p.ellipse(x,-15,4,2,CREAM[3]);
      if(id==="kitchen-counter")p.ellipse(5,-h-5,6,2.7,STEEL[2]);
    }else if(kind==="bed"){
      const w=id==="double-bed"?40:25;
      box(p,-w/2,0,w,8,10,WOOD);p.rect(-w/2+1,-24,w-2,15,WOOD[2]);
      p.rect(-w/2+3,-21,w-6,9,CREAM[3]);p.line(-w/2+4,-20,w/2-5,-20,CREAM[4]);
      p.poly([[-w/2+1,-14],[w/2-1,-14],[w/2,-4],[-w/2,-4]],C[2]);p.line(-w/2+2,-13,w/2-3,-13,C[4]);
    }else if(kind==="cabinet"){
      shelf(p,id==="bookshelf"?19:16,id==="refrigerator"?40:id==="wardrobe"?39:id==="cabinet"?27:35,C,o.open||id==="bookshelf");
      if(id==="bookshelf")for(let x=-14;x<=14;x+=4){p.line(x,-29,x,-22,x%3?GOLD[3]:RED[3]);p.line(x,-15,x,-8,x%4?WATER[4]:LEAF[3]);}
      if(id==="refrigerator"){p.line(-9,-26,10,-26,C[4]);p.line(-8,-22,-8,-14,C[4]);}
    }else if(kind==="fire"){
      if(id==="torch"||id==="street-lamp"){
        post(p,0,0,id==="torch"?22:32,WOOD);
        p.poly([[-8,-27],[-5,-38],[5,-38],[8,-27],[4,-22],[-4,-22]],STEEL[1]);hot(p,-5,-35,11,11,t,o.active);
      }else{
        if(id==="campfire"){
          p.beam(-11,-1,10,-11,5,WOOD[2]);p.beam(11,-1,-10,-11,5,WOOD[3]);hot(p,-8,-17,17,11,t,o.active);
        }else{box(p,-15,0,30,14,5,C);p.ellipse(0,-12,12,4,STEEL[1]);hot(p,-11,-16,22,12,t,o.active);}
        if(id==="fireplace"){post(p,-15,0,27,C);post(p,15,0,27,C);p.rect(-18,-30,37,5,C[3]);}
        if(o.active)vapor(p,1,-17,t,o.seed,CREAM,3);
      }
    }else if(kind==="fabric"){
      const raised=id==="flag"||id==="banner";
      if(raised)post(p,-11,0,33,WOOD);
      const y=raised?-30:-9;
      p.poly([[-12,y],[14,y+wiggle*2],[17,y+12],[6,y+9],[-14,y+13]],C[0]);
      p.poly([[-11,y+1],[13,y+1+wiggle*2],[15,y+10],[5,y+8],[-12,y+11]],C[2]);
      p.poly([[0,y+2],[6,y+6],[0,y+9],[-6,y+6]],C[4]);
      if(id==="banner"){p.line(-11,y,15,y,C[4]);p.line(10,y+7,10,y+11,C[3]);}
    }else if(kind==="wall"){
      if(id==="wall-clock"){
        round(p,0,-19,12,13,C);p.circle(0,-19,9,CREAM[3]);p.line(0,-19,0,-25,WOOD[0]);
        p.line(0,-19,Math.cos(t*6.28)*7,-19+Math.sin(t*6.28)*7,WOOD[1]);
      }else{
        p.rect(-16,-30,32,27,C[0]);p.rect(-14,-28,28,23,C[3]);
        if(id==="window"){p.rect(-12,-26,24,19,WATER[2]);p.line(0,-25,0,-8,C[1]);p.line(-11,-17,11,-17,C[1]);}
        else {p.circle(-5,-22,3,GOLD[4]);p.tri(-12,-9,-2,-21,12,-9,LEAF[3]);}
      }
    }else if(kind==="door"){
      p.rect(-15,-36,30,36,C[0]);p.rect(-12,-34,24,34,STEEL[0]);
      const open=o.open?9:24;p.rect(-12,-33,open,32,C[2]);p.line(-11,-33,-12+open,-33,C[4]);
      p.line(-9,-32,-9,-2,C[3]);p.px(-16+open,-14,GOLD[4]);
      if(id==="metal-door")for(const y of [-30,-3])p.line(-10,y,10,y,STEEL[3]);
    }else if(kind==="nature"){
      if(id==="flower-pot"){
        p.poly([[-10,-11],[10,-11],[7,-1],[-7,-1]],RED[2]);p.ellipse(0,-11,10,3,RED[4]);
        for(const x of [-6,0,7]){p.line(0,-11,x+wiggle,-24,LEAF[3]);round(p,x+wiggle,-24,3.8,3.8,VIOLET);}
      }else if(id==="fountain"){
        p.ellipse(0,-5,20,8,STEEL[3]);p.ellipse(0,-6,17,5.8,WATER[2]);post(p,0,-6,18,STEEL);
        for(let i=0;i<8;i++){const u=(t+i/8)%1;p.px((i%2?1:-1)*u*13,-23+u*u*16,WATER[4]);}
      }else{
        box(p,-12,0,24,7,4,C);p.beam(0,-7,0,-24,11,C[2]);round(p,0,-29,7,8,C);
        p.line(-5,-31,-2,-34,C[4]);
      }
    }else if(kind==="sign"){
      post(p,-12,0,22,WOOD);post(p,12,0,22,WOOD);box(p,-17,-12,34,17,3,C);
      for(const [x,y] of [[-9,-21],[3,-20],[8,-25]]){p.rect(x,y,6,6,CREAM[3]);p.px(x+3,y,RED[3]);}
      if(id==="quest-board")twinkle(p,0,-34,2,GOLD[3],GOLD[4]);
    }else if(kind==="cart"){
      for(const x of [-12,12]){p.ring(x,-2,7,3,STEEL[1]);p.line(x,-6,x,2,C[4]);}
      p.poly([[-20,-20],[20,-20],[15,-8],[-14,-8]],C[2]);p.line(-19,-20,19,-20,C[4]);
      if(id==="market-cart"){post(p,-17,-10,22,WOOD);post(p,17,-10,22,WOOD);p.rect(-20,-33,41,5,RED[2]);}
      if(id==="wheelbarrow")p.beam(12,-9,24,-5,3,WOOD[3]);
    }else if(kind==="rail"){
      for(let y=-24;y<3;y+=5)p.line(-16,y,16,y,WOOD[2]);
      for(const x of [-9,9]){p.line(x,-27,x,3,STEEL[3]);p.line(x-1,-27,x-1,3,STEEL[1]);}
    }else if(kind==="tank"){
      tank(p,0,0,15,25,C);p.ellipse(0,-25,11,2.3,WATER[2]);p.line(-7+wiggle,-25,7+wiggle,-25,WATER[4]);
      if(id==="water-pump"){p.beam(13,-20,22,-12,4,STEEL[2]);p.px(22,-9+t*5,WATER[4]);}
    }else if(kind==="pile"){
      for(let i=0;i<5;i++){
        const x=(i%3-1)*10,y=-4-Math.floor(i/3)*9,r=5+rand(i,7,o.seed)*2;
        if(id==="wooden-pallet"){p.rect(x-6,y-3,12,5,C[1]);p.line(x-5,y-3,x+5,y-3,C[4]);}
        else if(id==="stone-pile")round(p,x,y,r,r*.75,C);
        else {p.beam(x-r,y+1,x+r,y-3,6,C[2]);p.ellipse(x-r,y+1,3.3,3.2,C[3]);p.px(x-r,y+1,C[1]);}
      }
    }else{
      const w=id==="large-storage-chest"?40:id==="trash-bin"?20:31;
      box(p,-w/2,0,w,14,6,C);
      p.poly([[-w/2,-14],[w/2,-14],[w/2+5,-21],[-w/2+5,-21]],C[0]);
      p.poly([[-w/2,-14],[w/2,-14],[w/2+4,o.open?-27:-19],[-w/2+4,o.open?-27:-19]],C[2]);
      p.line(-w/2+4,o.open?-27:-19,w/2+3,o.open?-27:-19,C[4]);
      p.rect(-3,-15,7,6,GOLD[2]);p.px(0,-12,C[0]);
      if(id==="golden-chest")p.line(-9,-6,9,-6,GOLD[4]);
      if(id==="locked-chest"){p.rect(-5,-14,11,9,STEEL[1]);p.px(0,-9,GOLD[4]);}
      if(id==="donation-box")p.line(-6,-18,6,-18,C[0]);
    }
  });
  return {...fx,meta:{...fx.meta,collision:{width:kind==="fabric"?0:28,height:kind==="fabric"?0:12}}};
}

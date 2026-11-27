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
// ---- chests, boxes and bins: each its own build, drawn 3/4 top-down (top face straight above the front face)
/** A front face: dark rim, lit left edge, shaded right edge, a darker foot. */
function front(p,x,y,w,h,C,tone=2){
  p.rect(x,y-h,w,h,C[0]);p.rect(x+1,y-h+1,w-2,h-2,C[tone]);
  p.line(x+1,y-h+1,x+1,y-2,C[Math.min(4,tone+1)]);p.line(x+w-2,y-h+1,x+w-2,y-2,C[Math.max(1,tone-1)]);
  p.line(x+1,y-2,x+w-2,y-2,C[Math.max(1,tone-1)]);
}
/** A top face seen from above: lighter, a highlight along its far edge. */
function topFace(p,x,y,w,d,C,tone=3){
  p.rect(x,y-d,w,d+1,C[0]);p.rect(x+1,y-d+1,w-2,d-1,C[tone]);p.line(x+1,y-d+1,x+w-2,y-d+1,C[Math.min(4,tone+1)]);
}
function rivet(p,x,y,M){p.px(x,y,M[4]);p.px(x+1,y+1,M[1]);}
function band(p,x,y0,y1,M){p.rect(x,y0,2,y1-y0,M[1]);p.line(x,y0,x,y1-1,M[3]);}
/** A domed lid: a half cylinder lying along x, shaded round its curve, bands across it. */
function dome(p,w,y,r,C,M){
  p.ellipse(0,y,w/2+1,r+1,(d,a)=>a>0?0:C[0]);
  p.ellipse(0,y,w/2,r,(d,a)=>{if(a>0)return 0;const up=-Math.sin(a);return up>0.85?C[4]:up>0.55?C[3]:up>0.25?C[2]:C[1];});
  for(const x of [-w/2+4,w/2-6])p.rect(x,y-r,2,r,M[2]),p.line(x,y-r+1,x,y-1,M[4]);
  p.line(-w/2,y,w/2,y,C[0]);
}
function lock(p,y,M,dark){p.rect(-3,y-1,6,7,M[1]);p.rect(-2,y,4,5,M[3]);p.px(-2,y,M[4]);p.rect(-0.5,y+2,1,2,dark);}
function chest(p,id,C,t,o){
  const dark=STEEL[0],glint=(x,y,phase=0)=>{const k=(t+phase)%1;if(k<0.18)twinkle(p,x,y,2*Math.sin(k/0.18*Math.PI),GOLD[4],GOLD[3]);};
  if(id==="treasure-chest"){
    const w=28,h=11;
    front(p,-w/2,0,w,h,WOOD);for(const y of [-4,-8])p.line(-w/2+2,y,w/2-3,y,WOOD[1]);
    for(const x of [-w/2+4,w/2-6])band(p,x,-h,0,GOLD);
    if(o.open){p.rect(-w/2+1,-h-4,w-2,4,GOLD[1]);for(let i=0;i<7;i++)p.ellipse(-10+i*3.4,-h-2-(i%2),2,1.3,GOLD[3+(i%2)]);p.glow(0,-h-4,16,GOLD[4],0.5);
      p.poly([[-w/2,-h-3],[w/2,-h-3],[w/2,-h-15],[-w/2,-h-15]],WOOD[1]);p.line(-w/2,-h-15,w/2,-h-15,WOOD[3]);}
    else{dome(p,w,-h,8,WOOD,GOLD);lock(p,-h-2,GOLD,dark);glint(-6,-h-6);}
    for(const x of [-w/2+1,w/2-2])rivet(p,x,-h+1,GOLD);
  }else if(id==="golden-chest"){
    const w=28,h=12,G=GOLD;
    front(p,-w/2,0,w,h,G);
    for(let x=-w/2+3;x<w/2-2;x+=4)p.px(x,-3,G[4]);p.line(-w/2+2,-h+3,w/2-3,-h+3,G[1]);
    p.ellipse(0,-6,3,2.5,RED[1]);p.ellipse(-0.5,-6.5,2,1.6,RED[3]);p.px(-1,-7,RED[4]);
    dome(p,w,-h,8,G,RED);
    p.arc(0,-h,5,1,Math.PI*1.1,Math.PI*1.9,G[4]);
    glint(-5,-h-6);glint(8,-4,0.5);p.glow(0,-h-3,14,G[4],0.1);
  }else if(id==="silver-chest"){
    const w=28,h=12,S=STEEL;
    front(p,-w/2,0,w,h,S);topFace(p,-w/2,-h,w,6,S);
    for(const x of [-w/2+1,w/2-3])p.rect(x,-h-6,3,h+6,S[1]),p.line(x,-h-5,x,-1,S[4]);
    for(const [x,y] of [[-w/2+1,-h-5],[w/2-3,-h-5],[-w/2+1,-3],[w/2-3,-3]])rivet(p,x+0.5,y,S);
    p.line(-w/2+4,-h+2,w/2-5,-h+2,S[4]);lock(p,-h+1,GOLD,dark);
    for(let x=-8;x<=8;x+=4)p.px(x,-h-3,S[1]);
  }else if(id==="crystal-chest"){
    const w=28,h=11;
    front(p,-w/2,0,w,h,VIOLET);topFace(p,-w/2,-h,w,6,VIOLET);
    for(const x of [-w/2+3,w/2-5])band(p,x,-h-6,0,STEEL);
    for(const [x,s] of [[-6,8],[0,12],[6,7],[-2,6]]){
      p.poly([[x-2.5,-h-3],[x,-h-3-s],[x+2.5,-h-3]],WATER[2]);p.poly([[x-1,-h-3],[x,-h-3-s+2],[x+1.5,-h-3]],WATER[4]);p.px(x,-h-2-s,WATER[4]);
    }
    p.glow(0,-h-8,16,WATER[4],0.4);lock(p,-h+1,WATER,dark);
    const k=t%1;twinkle(p,-3+k*8,-h-9,1.8,WATER[4],WATER[3]);
  }else if(id==="locked-chest"){
    const w=28,h=12;
    front(p,-w/2,0,w,h,WOOD);topFace(p,-w/2,-h,w,6,WOOD);
    for(const y of [-4,-8])p.line(-w/2+2,y,w/2-3,y,WOOD[1]);
    // two chains crossing the lid and front, link by link, and a heavy padlock where they meet
    for(const s of [-1,1])for(let i=0;i<9;i++){
      const u=i/8,x=s*(-w/2+2+u*(w-4)),y=-h-5+u*(h+3);
      p.ellipse(x,y,1.8,1.2,(d)=>d>0.5?STEEL[i&1?1:3]:0);
    }
    p.rect(-4,-h-1,8,8,STEEL[0]);p.rect(-3,-h,6,6,GOLD[2]);p.line(-3,-h,2,-h,GOLD[4]);p.rect(-0.5,-h+2,1,2,dark);
    p.arc(0,-h-1,3,1.3,Math.PI,Math.PI*2,STEEL[3]);
  }else if(id==="large-storage-chest"){
    const w=42,h=13;
    front(p,-w/2,0,w,h,WOOD);topFace(p,-w/2,-h,w,7,WOOD);
    for(let x=-w/2+5;x<w/2-2;x+=6)p.line(x,-h-6,x,-h,WOOD[2]);
    for(const y of [-4,-8])p.line(-w/2+2,y,w/2-3,y,WOOD[1]);
    for(const x of [-w/2+5,-1,w/2-7])band(p,x,-h-7,0,STEEL);
    for(const s of [-1,1]){p.arc(s*(w/2+1),-7,2.5,1,s>0?-1.6:1.6,s>0?1.6:4.7,STEEL[2]);}
    lock(p,-h+1,STEEL,dark);
  }else if(id==="donation-box"){
    const w=20,h=16;
    front(p,-w/2,0,w,h,WOOD);topFace(p,-w/2,-h,w,6,WOOD);
    p.rect(-5,-h-4,10,2,dark);p.line(-5,-h-2,4,-h-2,WOOD[4]);
    // a painted heart on the front and a coin about to drop in
    p.poly([[0,-4],[-4,-8],[-4,-10],[-2,-11],[0,-9],[2,-11],[4,-10],[4,-8]],RED[2]);p.px(-2,-9,RED[4]);
    const k=(t+0.7)%1,cy=-h-14+Math.min(1,k*1.6)*9;
    const fade=Math.max(0,Math.min(1,k/0.2,(0.62-k)/0.12));if(k<0.62){p.ellipse(0,cy,2.2,2.2,GOLD[1],fade);p.ellipse(-0.3,cy-0.3,1.5,1.5,GOLD[3],fade);p.dot(-1,cy-1,GOLD[4],fade);}
  }else if(id==="resource-crate"){
    const w=26,h=13;
    // what's in it pokes out the top: logs, ore, a sheaf
    for(const [x,c] of [[-7,WOOD],[ -1,STEEL],[6,GOLD]])round(p,x,-h-4,4.2,3.4,c);
    p.ellipse(-7,-h-4,2,1.6,WOOD[4]);p.px(-2,-h-6,STEEL[4]);p.px(5,-h-6,GOLD[4]);
    front(p,-w/2,0,w,h,WOOD,3);
    for(const y of [-5,-9])p.line(-w/2+1,y,w/2-2,y,WOOD[1]);
    p.line(-w/2+2,-2,w/2-3,-h+2,WOOD[1]);p.line(-w/2+2,-3,w/2-3,-h+1,WOOD[4]);
    for(const [x,y] of [[-w/2+2,-h+2],[w/2-3,-h+2],[-w/2+2,-3],[w/2-3,-3]])p.px(x,y,STEEL[3]);
  }else if(id==="trash-bin"){
    const r=8,h=16,S=STEEL;
    p.rect(-r,-h,r*2,h,S[0]);
    p.shade(-r+1,-h,r-1,-1,(x)=>{const u=(x+r)/(2*r);return u<0.25?S[3]:u<0.6?S[2]:u<0.85?S[1]:S[0];});
    for(const y of [-4,-9,-13])p.line(-r+1,y,r-2,y,S[1]);
    p.ellipse(0,-h,r+1,3,S[0]);p.ellipse(0,-h-1,r,2.5,S[3]);p.ellipse(0,-h-1.5,r-2,1.5,S[2]);
    p.rect(-2,-h-4,4,2,S[1]);p.line(-2,-h-4,1,-h-4,S[4]);
    p.poly([[r-3,-h-1],[r+2,-h-4],[r+1,-h-1]],LEAF[3]);p.px(-r+2,-h-2,CREAM[4]);
  }
}
export function sceneProp(id){
  const kind=Object.keys(types).find(k=>types[k].split(" ").includes(id));
  const palette=/silver|stone|metal|refrigerator|minecart|statue|stove|trash/.test(id)?STEEL:/gold|locked|treasure/.test(id)?GOLD:
    /crystal|painting|carpet/.test(id)?VIOLET:/rug|banner|flag|double-bed/.test(id)?RED:/water|cream|fountain/.test(id)?WATER:WOOD;
  const motion=["fire","fabric","nature","tank","wall","chest"].includes(kind);
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
    }else chest(p,id,C,t,o);
  });
  return {...fx,meta:{...fx.meta,collision:{width:kind==="fabric"?0:28,height:kind==="fabric"?0:12}}};
}

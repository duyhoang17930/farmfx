import { rand } from "../../core/index.js";
import { asset, CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, box, post, round, wave } from "./art.js";
import { groundShadow, twinkle } from "./sprite.js";
import { drawProp, front, topFace, rivet, band } from "./prop-art.js";

const types={
 table:"wooden-table dining-table chair stool kitchen-counter", bed:"bed double-bed",
 cabinet:"wardrobe bookshelf cabinet refrigerator", fire:"stove fireplace torch campfire brazier street-lamp",
 fabric:"rug carpet flag banner", wall:"wall-clock painting window", door:"wooden-door stone-door metal-door",
 nature:"flower-pot fountain statue", sign:"notice-board quest-board",
 cart:"market-cart wheelbarrow minecart", rail:"minecart-track",
 tank:"water-tank water-pump", pile:"wooden-pallet stone-pile wood-pile", chest:"treasure-chest silver-chest golden-chest crystal-chest locked-chest large-storage-chest donation-box resource-crate trash-bin",
};
// ---- chests, boxes and bins: each its own build, drawn 3/4 top-down (top face straight above the front face)
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
  const motion=["fire","fabric","nature","tank","wall","chest","sign"].includes(kind)||id==="dining-table";
  const fx=asset({name:id.replaceAll("-"," "),desc:`A top-down ${id.replaceAll("-"," ")} prop with shaded surfaces.`,
    tags:["object",kind],size:[64,64],origin:[32,52],palette,bg:"field",duration:motion?2:1,fps:motion?12:1,
    options:{open:false,active:true}},(p,t,C,o)=>{
    const wiggle=wave(t);
    if(kind!=="wall"&&!/rug|carpet/.test(id))groundShadow(p,0,0,kind==="fire"&&/torch|lamp/.test(id)?6:18,kind==="fire"&&/torch|lamp/.test(id)?2:4);
    if(kind==="chest")chest(p,id,C,t,o);else drawProp(p,id,kind,C,t,o);
  });
  return {...fx,meta:{...fx.meta,collision:{width:kind==="fabric"?0:28,height:kind==="fabric"?0:12}}};
}

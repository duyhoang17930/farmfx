import { CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, round } from "./art.js";
import { inventoryItems, itemPoly as poly } from "./inventory-items.js";

function carved(desc,C,paint){return [desc,C,paint];}
function key(desc,C,teeth,rune){
  return carved(desc,C,(p,x,y,P)=>{
    p.ring(x+2,y-2,3.35,1.85,P[2]);p.arc(x+2,y-2,3.3,1.2,2.7,4.8,P[4]);
    p.beam(x-4,y+4,x,y,2.2,P[1]);p.line(x-4,y+4,x,y,P[3]);
    for(let i=0;i<teeth;i++)p.line(x-4+i*2,y+3-i*2,x-2+i*2,y+5-i*2,P[3]);
    if(rune)p.px(x+3,y-2,P[4]);
  });
}
function stone(desc,C,rune){
  return carved(desc,C,(p,x,y,P)=>{
    poly(p,x,y,[[-5,2],[-4,-3],[1,-5],[4,-3],[5,1],[2,5],[-3,4]],P[0]);
    poly(p,x,y,[[-4,1],[-3,-2],[1,-4],[3,-2],[4,1],[1,4],[-2,3]],P[2]);
    p.line(x-3,y-2,x+1,y-4,P[4]);
    p.polyline(rune.map(([a,b])=>[x+a,y+b]),P[4]);
  });
}
function orb(desc,C,points){
  return carved(desc,C,(p,x,y,P)=>{
    round(p,x,y,4.4,4.35,P);
    for(const [a,b] of points)p.px(x+a,y+b,P[4]);
    p.px(x+2,y+2,P[1]);
  });
}
function paper(desc,C,lines){
  return carved(desc,C,(p,x,y,P)=>{
    poly(p,x,y,[[-5,-4],[-2,-5],[4,-4],[5,-2],[3,1],[4,4],[-3,5],[-5,3]],CREAM[0]);
    poly(p,x,y,[[-4,-3],[-2,-4],[3,-3],[3,-1],[2,2],[3,3],[-3,4],[-4,3]],P[3]);
    p.line(x-3,y-3,x+2,y-3,P[4]);
    p.polyline(lines.map(([a,b])=>[x+a,y+b]),P[1]);p.px(x+2,y+2,RED[3]);
  });
}
const entries={
  coin:orb("A stamped round coin with a gold rim.",GOLD,[[-2,-2],[0,-2],[0,-1],[0,0],[0,1]]),
  "coin-pouch":carved("A tied leather bag with a brass coin at the front.",WOOD,(p,x,y,C)=>{
    round(p,x,y+1,4.7,3.8,C);p.rect(x-2,y-4,5,3,C[2]);p.line(x-3,y-2,x+3,y-2,C[4]);
    round(p,x+1,y+2,2,2,GOLD);
  }),
  "gold-bar":carved("A heavy gold bullion bar with an inset face.",GOLD,(p,x,y,C)=>{
    poly(p,x,y,[[-5,3],[-3,-2],[2,-4],[5,-2],[5,2],[1,5],[-4,5]],C[0]);
    poly(p,x,y,[[-4,3],[-2,-2],[2,-3],[4,-2],[1,1]],C[4]);p.line(x-3,y+3,x+3,y+1,C[2]);
  }),
  "bronze-key":key("A bronze key with one tooth.",WOOD,1,false),
  "silver-key":key("A silver key with two teeth.",STEEL,2,false),
  "gold-key":key("A gold key with three teeth.",GOLD,3,true),
  "dungeon-key":key("A dark violet dungeon key with a rune in the bow.",VIOLET,2,true),
  "boss-key":key("A red-gold boss key with a long ridged shank.",RED,3,true),
  "treasure-map":paper("A creased treasure map with a winding route and red mark.",GOLD,[[-3,1],[-1,0],[-1,-1],[1,0],[2,2]]),
  "ancient-scroll":paper("A faded scroll covered in violet glyphs.",CREAM,[[-3,-1],[2,-1],[1,1],[-2,1],[-1,3]]),
  "ancient-relic":stone("A green stone relic incised with a triangular rune.",LEAF,[[-2,2],[0,-2],[2,2],[-2,2]]),
  "ancient-tablet":stone("A slate tablet incised with three parallel marks.",STEEL,[[-2,2],[-2,-1],[0,-1],[0,2],[2,2],[2,-1]]),
  "magic-orb":orb("A violet magic orb with a crescent highlight.",VIOLET,[[-2,-2],[-2,-1],[-1,-3],[2,1]]),
  "magic-dust":carved("Scatter of violet and pale-gold magic dust.",VIOLET,(p,x,y,C)=>{
    for(const [a,b,i] of [[-3,2,2],[-4,1,3],[-2,-1,4],[0,1,3],[1,-2,4],[3,-4,4],[4,2,2],[1,4,1]])p.px(x+a,y+b,C[i]);
    p.line(x-1,y+2,x+2,y+3,GOLD[4]);
  }),
  "soul-shard":stone("A blue shard holding a pale soul rune.",WATER,[[-2,1],[0,-2],[2,1],[1,2]]),
  "spirit-essence":orb("A pale spirit pearl with a teal ring of light.",WATER,[[-2,-1],[-1,-2],[0,-2],[2,0],[1,2]]),
  "dragon-scale":stone("A red dragon scale scored along the center ridge.",RED,[[-2,2],[1,-3],[2,0],[1,2]]),
  "monster-eye":carved("A glassy fantasy creature eye with a green iris.",CREAM,(p,x,y,C)=>{
    p.ellipse(x,y,5.1,3.9,C[0]);p.ellipse(x,y,4.3,3.2,C[3]);p.circle(x+0.5,y,2.6,LEAF[2]);
    p.line(x+1,y-2,x+1,y+2,LEAF[0]);p.px(x-1,y-1,C[4]);
  }),
  "slime-gel":orb("A soft green glob of gel.",LEAF,[[-2,-1],[-1,-2],[1,2]]),
  "monster-fang":carved("A curved ivory fang with a warm root.",CREAM,(p,x,y,C)=>{
    poly(p,x,y,[[-4,-3],[0,-5],[4,-4],[4,0],[1,3],[-4,5],[-2,1]],C[0]);
    poly(p,x,y,[[-3,-3],[0,-4],[3,-3],[3,0],[0,3],[-2,4],[-1,0]],C[3]);
    p.line(x-2,y-3,x-1,y+1,C[4]);
  }),
  fossil:stone("A warm stone fossil with a spiral impression.",WOOD,[[2,2],[-1,3],[-3,1],[-2,-1],[1,-2],[2,0],[0,1],[-1,0]]),
  artifact:stone("A red-gold artifact bearing a branching glyph.",GOLD,[[-2,2],[0,0],[0,-2],[2,-2],[0,0],[2,2]]),
  "mystery-box":carved("A small purple crate with a gold question mark.",VIOLET,(p,x,y,C)=>{
    p.rect(x-5,y-3,11,8,C[0]);p.rect(x-4,y-2,9,6,C[2]);p.line(x-4,y-3,x+4,y-3,C[4]);
    p.polyline([[x-1,y-1],[x+1,y-1],[x+1,y],[x,y+1]],GOLD[4]);p.px(x,y+3,GOLD[4]);
  }),
  "skill-point":carved("A bright four-point skill star.",GOLD,(p,x,y,C)=>{
    poly(p,x,y,[[0,-5],[2,-2],[5,0],[2,2],[0,5],[-2,2],[-5,0],[-2,-2]],C[1]);
    poly(p,x,y,[[0,-4],[1,-1],[4,0],[1,1],[0,4],[-1,1],[-4,0],[-1,-1]],C[3]);p.px(x,y,C[4]);
  }),
  "experience-orb":orb("A bright gold-green mote of experience.",LEAF,[[-2,-2],[0,-2],[0,-1],[1,0],[0,1]]),
};
export const {item:specialItem,drawIcon:drawSpecialIcon}=inventoryItems("special",entries);

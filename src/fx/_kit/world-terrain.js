import { fit, mix, noise2, rand } from "../../core/index.js";
import { asset, LEAF, STEEL, WATER, WOOD, wave } from "./art.js";

export const terrainPalettes={
  grassland:["#29423a","#48613c","#647d49","#87a65b","#b8ca77"],
  desert:["#5c473b","#9b744f","#c99965","#e9bd80","#f9daa0"],
  snowland:["#536a82","#7f99ae","#a9c3d0","#c8e2e2","#f5f5e9"],
  graveyard:["#292a3d","#4b424f","#665461","#85737c","#aa9699"],
  volcanic:["#20212b","#34323e","#45434e","#635761","#8b7371"],
  brick:["#3e2b32","#6c4242","#9d593f","#c47754","#e99b68"],
  "dungeon-floor":["#2e2837","#514655","#685e6d","#827787","#b2a3b1"],
  swamp:["#263d3c","#3d5241","#566d4a","#7a8b55","#acaf66"],
  "swamp-water":["#233833","#344a3f","#425d50","#607969","#91a585"],
  crystal:["#33324e","#4d5178","#6381a1","#8badd0","#c4dce3"],
  tropical:["#254f49","#386850","#57936a","#83b577","#d0d283"],
  rock:STEEL, wood:WOOD, water:WATER,
  metal:["#263641","#435e65","#6f8b91","#a1babb","#d5e3d9"],
  rope:["#4e3c3a","#735746","#a17d5b","#c7a578","#e8d4aa"],
  dirt:["#513b36","#704d40","#96684c","#ad805c","#d1a171"],
  sand:["#5a5246","#8c7758","#c8a574","#e8c193","#ffe0a7"],
  lava:["#532b41","#902f43","#ca4b47","#f47e4c","#ffc16b"],
  ice:["#354e69","#577e99","#8eb7cc","#b0dbe2","#e1f3e9"],
};
const sides="NESW", diagonals=["NE","SE","SW","NW"];
const neighbors=[[0,-1],[1,0],[0,1],[-1,0]];

/** Outside faces and missing diagonals of a tile in a connected material. */
export function terrainRim(inside,x,y){
  const edges=neighbors.map(([dx,dy],i)=>inside(x+dx,y+dy)?"":sides[i]).join("");
  const corners=neighbors.flatMap(([dx,dy],i)=>{
    const [ax,ay]=neighbors[(i+1)%4], corner=diagonals[i];
    return !edges.includes(corner[0])&&!edges.includes(corner[1])&&!inside(x+dx+ax,y+dy+ay)?[corner]:[];
  });
  return {edges,corners};
}
const surfaces={
  grassland:(x,y,s)=>noise2(x/9,y/7,s),
  tropical:(x,y,s)=>noise2((x+y*.4)/12,y/5,s),
  snowland:(x,y,s)=>noise2((x-y*.3)/22,y/8,s),
  ice:(x,y,s)=>noise2((x+y*.5)/24,y/5,s),
  desert:(x,y,s)=>noise2(x/21,(y+x*.17)/3.5,s),
  sand:(x,y,s)=>noise2(x/18,(y+x*.13)/4,s),
  dirt:(x,y,s)=>noise2(x/7,y/6,s),
  swamp:(x,y,s)=>noise2(x/16,(y+noise2(x/20,y/16,s)*5)/6,s),
  graveyard:(x,y,s)=>noise2(x/9,y/11,s),
  crystal:(x,y,s)=>noise2((x+y)/10,(y-x)/6,s),
  volcanic:(x,y,s)=>noise2((x-y*.7)/7,(y+x*.25)/9,s),
};

export function groundTones(C, base=C[2]){
  return [mix(base,C[1],.27),base,mix(base,C[3],.27)];
}

// Dark biomes are where fights happen: their floors step back (closer tones, less color, a little darker) so
// creatures, chests and traps stand off them, instead of a busy floor as contrasty as what stands on it.
// Each steps back the way its cast needs: the dungeon and the swamp darker (their props are light stone and
// green), the graveyard into a pale fog and the volcano into grey ash (their cast is bats, iron, obsidian,
// charred wood and dark-red demons, which a darker floor would swallow).
const CALM={graveyard:[.5,4,1.4],volcanic:[.45,4,1.6],"dungeon-floor":[.55,0,.5],crystal:[.4,0,.45],swamp:[.35,0,.5]};
const greyOf=(c)=>{const v=Math.round((c&255)*.3+((c>>>8)&255)*.59+((c>>>16)&255)*.11);return (c&0xff000000)|(v<<16)|(v<<8)|v;};
function calm(tones,[k,toward,amount],C){
  const mid=tones[1];
  return tones.map((t,i)=>{
    const near=i===1?t:mix(t,mid,k);
    return mix(mix(near,greyOf(near),k*.45),C[toward],k*amount);
  });
}
function surfaceTones(style,C,id){
  const tones=rawTones(style,C,id);
  return CALM[style]&&!/cliff|wall|stairs|shore/.test(id??"")?calm(tones,CALM[style],C):tones;
}
function rawTones(style,C,id){
  const snow=style==="snowland";
  const base=id==="deep-snow"?mix(C[3],C[4],.27):id==="burnt-ground"?mix(C[1],C[2],.35):
    snow?mix(C[2],C[3],.63):style==="desert"||style==="sand"?mix(C[2],C[3],.82):C[2];
  if(snow)return [mix(base,C[2],.36),base,mix(base,C[4],.15)];
  const tones=groundTones(C,base);
  if(base!==C[2])tones[2]=mix(base,C[4],.13);
  return tones;
}

function groundColor(texture,tones,x,y,seed){
  // large slow patches (a few tiles across) tip the balance between the darker and lighter tones, so a wide
  // field has drifts and worn areas instead of one even texture repeated tile after tile
  const macro=noise2(x/72,y/58,seed+77)*.55+noise2(x/31,y/37,seed+91)*.2;
  const n=texture(x,y,seed)+macro;
  return tones[n<-.57?0:n>.57?2:1];
}
/**
 * Scattered ground detail for one pixel of an open floor, or 0: a pebble with its shadow, a short crack, a tuft or
 * a small hollow, placed by a hash per 12 x 12 px cell, so the floor gets 3-5 kinds of variation that don't line up
 * with the tile grid.
 */
export function groundDecal(style,tones,C,gx,gy,seed){
  const cx=Math.floor(gx/12),cy=Math.floor(gy/12),h=rand(cx,cy,seed+401);
  if(h>.42)return 0;
  const ox=cx*12+2+Math.floor(rand(cx,cy,seed+402)*8),oy=cy*12+2+Math.floor(rand(cx,cy,seed+403)*8),u=gx-ox,v=gy-oy;
  const kind=Math.floor(rand(cx,cy,seed+404)*4);
  const light=mix(tones[2],C[4],.35),dark=mix(tones[0],C[0],.35);
  if(kind===0){ // pebbles
    if(u===0&&v===0||u===2&&v===1)return light;
    if(u===0&&v===1||u===2&&v===2||u===1&&v===1)return dark;
  }else if(kind===1){ // a short crack
    if(v===0&&u>=0&&u<3||v===1&&u>=2&&u<4||v===2&&u===4)return dark;
  }else if(kind===2){ // a tuft or a ridge, by biome
    const tuft=/grassland|tropical|swamp/.test(style);
    if(tuft?(u===0&&v>=0&&v<2||u===2&&v>=-1&&v<2||u===1&&v===1):v===0&&u>=-1&&u<4)return tuft?mix(tones[2],C[3],.5):light;
    if(!tuft&&v===1&&u>=0&&u<4)return dark;
  }else{ // a hollow: a dark rim over a lit lip
    const r=(u-1.5)**2/4+(v-.5)**2;
    if(r<1.1)return v<=0?dark:mix(tones[1],tones[0],.5);
  }
  return 0;
}

// Short, broken crests leave room for sprites and connect in world coordinates.
export function waterGlint(x,y,phase,seed){
  const n=noise2(x/12,y/6,seed);
  return n>.08&&wave(phase,1,x*.028+y*.16+n*.2)>.84;
}
export const connectedTiles=new Set(["blend","shore","cliff","river","wall","fence","floor"]);
const descriptions={blend:"Connects two ground materials with configurable edges and inside corners.",
  shore:"A connected bank with configurable shoreline edges and inside corners.", cliff:"A raised connected cliff edge with a fractured face.",
  river:"Flowing water with selectable branches and inner bends.", wall:"A tiled wall segment with selectable joins.",
  fence:"A rail panel with posts and selectable joins.", ground:"A seamless ground tile with seeded texture.",
  crack:"A seamless ground tile crossed by branching seams.", floor:"A repeatable patterned floor with matching side edges.",
  bridge:"A raised bridge deck with matching plank and rail edges.", gate:"A hinged gate with a configurable opening.",
  stairs:"Broad stairs with lit step edges.", water:"A flowing 16 pixel water tile.", wave:"A looping foam crest on water.",
  shadow:"A soft island-edge shadow for the water layer."};
function distance(x,y,edges,corners){
  const d=[y,15-x,15-y,x];
  let near=16;
  for(let i=0;i<4;i++){
    if(edges.includes(sides[i]))near=Math.min(near,d[i]);
    const corner=diagonals[i], next=d[(i+1)%4];
    if(corners.includes(corner))near=Math.min(near,d[i]+next);
    if(edges.includes(corner[0])&&edges.includes(corner[1]))near=Math.min(near,d[i]+next-2);
  }
  return near;
}

function roundedDistance(x,y,edges,corners){
  const d=[y,15-x,15-y,x];
  let near=16;
  for(let i=0;i<4;i++){
    const corner=diagonals[i], a=d[i], b=d[(i+1)%4];
    if(edges.includes(sides[i]))near=Math.min(near,a);
    if(corners.includes(corner))near=Math.min(near,Math.hypot(a+.5,b+.5));
    if(edges.includes(corner[0])&&edges.includes(corner[1])){
      near=Math.min(near,11-Math.hypot(Math.max(0,11-a),Math.max(0,11-b)));
    }
  }
  return near;
}

const transitionWidths={"snow-to-ice":6,"ice-ground":4,"frozen-pond":4,"grass-to-sand":7,"beach-sand":6,"lava-tile":4,"swamp-water":5};

export function terrain(id,kind,style,under,pattern=0){
  const palette=terrainPalettes[style]??terrainPalettes.grassland;
  const other=terrainPalettes[under]??WATER;
  const water=["shore","river","water","wave"].includes(kind);
  const transition=transitionWidths[id];
  const connected=connectedTiles.has(kind)||Boolean(transition);
  const inner=id.includes("inner-corner");
  const edges=kind==="river"?id.includes("junction")?"NEW":id.includes("corner")?"NE":"NS":
    inner||transition&&(kind==="ground"||kind==="water")?"":id.includes("outer-corner")?"NE":
    id==="island-edge"||id==="farmland-edge"?"S":id.includes("wall-corner")?"EW":"ES";
  const corners=inner||id==="farmland-corner"?["NE"]:[];
  const texture=surfaces[style]??surfaces.graveyard;
  const backgroundTexture=surfaces[under]??surfaces.graveyard;
  const metaOptions={tileX:0,tileY:0,...(connected?{edges,corners}:{}),
    ...(kind==="gate"?{open:false}:{}),...(kind==="bridge"?{facing:"east-west"}:{}),background:other};
  const result=asset({name:id.replaceAll("-"," "),desc:descriptions[kind],tags:["terrain",kind,style],size:[16,16],origin:[8,12],
    duration:water?2.5:1,fps:water?12:1,palette,options:metaOptions},(p,phase,C,o)=>{
    const B=fit(o.background,5), edges=o.edges??"",corners=o.corners??[];
    const tones=surfaceTones(style,C,id), background=surfaceTones(under,B);
    const hasRim=transition&&(edges.length||corners.length);
    const middle=mix(tones[1],background[1],.5);
    const border=style==="lava"?mix(B[0],C[1],.5):style==="swamp-water"?mix(B[1],C[1],.5):mix(tones[0],background[1],.26);
    const floorMortar=mix(C[2],C[1],.38), floorLip=mix(C[2],C[3],.23);
    const lightWater=mix(C[2],C[3],.42), lava=style==="lava";
    for(let y=0;y<16;y++)for(let x=0;x<16;x++){
      const gx=x+o.tileX*16,gy=y+o.tileY*16;
      const n=rand(gx,gy,o.seed), d=distance(x,y,edges,corners);
      const fleck=noise2(gx*0.17,gy*0.18,o.seed);
      const value=n>0.988?3:n<0.012?1:fleck>0.13?3:2;
      let color=groundColor(texture,tones,gx,gy,o.seed);
      if((kind==="ground"||kind==="crack")&&!water&&style!=="lava"){const dec=groundDecal(style,tones,C,gx,gy,o.seed);if(dec)color=dec;}
      if(id==="flower-ground"&&n>.987)color=n>.997?C[4]:C[3];
      if(transition){
        if(kind==="water"){
          const crest=waterGlint(gx,gy,phase,o.seed);
          color=lava?(crest?C[4]:fleck>.28?C[1]:C[2]):crest?lightWater:C[2];
        }
        if(hasRim){
          const contour=noise2(gx/15,gy/15,o.seed+31);
          const depth=roundedDistance(x,y,edges,corners)-transition-contour*3;
          if(depth<0)color=groundColor(backgroundTexture,background,gx,gy,o.seed);
          else if(depth<1.4)color=style==="lava"||style==="swamp-water"?border:middle;
          else if(depth<3.1)color=style==="lava"?C[1]:style==="swamp-water"?mix(C[2],B[2],.22):border;
        }
      }else if(kind==="blend"){
        const boundary=5+Math.round(fleck*2);
        if(d<boundary)color=groundColor(backgroundTexture,background,gx,gy,o.seed);
        else if(d===boundary)color=mix(tones[1],background[1],.48);
      }
      else if(kind==="shore"){
        // an organic coast: the waterline wanders with a world-space contour and rounds the outer corners, so
        // neighbouring tiles join into one shore instead of stepping tile by tile; a 1 px foam line rides it, and
        // a coast facing the camera (south) shows a short earth face under its lip
        const contour=noise2(gx/11,gy/11,o.seed+17)*2.4+noise2(gx/4,gy/4,o.seed+3)*.7;
        const dd=roundedDistance(x,y,edges,corners)-contour, south=edges.includes("S")&&15-y<=d+.5;
        const sea=B[under==="lava"?3:2], foam=under==="lava"?B[4]:mix(B[4],0xffffffff,.35);
        // the water side is left clear: a coast tile lies over the water layer, which shows through its curve
        if(dd<1.6)color=under==="lava"?sea:0;
        else if(dd<2.6)color=under==="lava"||(gx+gy*3+Math.floor(phase*6))%5?foam:sea;
        else if(south&&dd<5.6)color=dd<3.6?mix(tones[0],C[0],.5):(x+Math.round(contour))%3?tones[0]:mix(tones[0],C[0],.35);
        else if(dd<3.6+fleck)color=tones[0];
        else if(dd<4.6+fleck&&!south)color=mix(tones[0],color,.5);
      }
      else if(kind==="cliff")color=d<1?C[0]:d<4?C[x%5===0?1:2]:d===4?C[4]:color;
      else if(kind==="river"){
        const bend=lava&&edges==="NS"?Math.round(2*noise2(gy/19,0,o.seed+5)):0;
        const cx=Math.abs(x-7.5-bend),cy=Math.abs(y-7.5);
        const route=cx<4.6&&cy<4.6||edges.includes("N")&&cx<4.6&&y<8||edges.includes("S")&&cx<4.6&&y>7||
          edges.includes("W")&&cy<4.6&&x<8||edges.includes("E")&&cy<4.6&&x>7||d<2&&corners.length>0;
        color=route?(waterGlint(gx,gy,phase,o.seed)?lightWater:C[2]):groundColor(backgroundTexture,background,gx,gy,o.seed);
        if(route&&lava){
          const bank=cx>3.5&&cy>3.5||cx>3.5&&!/[EW]/.test(edges)||cy>3.5&&!/[NS]/.test(edges);
          color=bank?C[1]:waterGlint(gx,gy,phase,o.seed)?C[4]:C[2];
        }
      }else if(kind==="water"||kind==="wave"){
        const crest=waterGlint(gx,gy,phase,o.seed);
        color=lava?(crest?C[4]:fleck>.28?C[1]:C[2]):crest?(kind==="wave"?C[3]:lightWater):C[2];
      }else if(kind==="crack"&&id!=="cracked-floor"){
        const seam=noise2((gx+gy*.38)/14,gy/11,o.seed);
        if(Math.abs(seam)<.038&&fleck>-.18)color=mix(tones[1],C[0],.32);
      }
      else if(kind==="floor"||kind==="wall"||id==="cracked-floor"){
        const height=pattern===0?4:8, width=pattern===0?32:16;
        const row=Math.floor(gy/height), offset=gx+(row&1)*width/2;
        const seam=gy%height===0||offset%width===0;
        const tint=rand(Math.floor(offset/width),row,o.seed);
        if(kind!=="wall"){
          // slabs drift in tone over wide areas (worn lanes, darker corners), and some carry a chip or a crack
          const wear=tint+noise2(gx/80,gy/64,o.seed+77)*.4;
          color=d===0?C[1]:d===1||seam?floorMortar:gy%height===1?floorLip:tones[wear<.2?0:wear>.8?2:1];
          if(d>1&&!seam&&gy%height!==1){const dec=groundDecal("floor",tones,C,gx,gy,o.seed+5);if(dec&&rand(Math.floor(gx/12),Math.floor(gy/12),o.seed+9)<.55)color=dec;}
          if(id==="cracked-floor"&&tint<.56&&Math.abs(noise2(gx/10,gy/8,o.seed+11))<.045)color=C[1];
        }
        else color=d===0||y>13&&!edges.includes("S")?C[0]:d===1||gy%height===1?C[3]:seam?C[1]:C[2];
      }else if(kind==="shadow"){
        const a=Math.max(0,1-y/12)*0.42;
        p.dot(x-8,y-12,C[0],a);continue;
      }else if(kind==="bridge"||kind==="stairs"||kind==="fence"||kind==="gate"){
        const across=o.facing==="north-south"?x:y, along=o.facing==="north-south"?y:x;
        if(kind==="stairs")color=C[across%4===0?1:across%4===1?4:value];
        else if(kind==="bridge"){
          if(across<1||across>14)continue;
          if(id.includes("rope")&&(across>2&&across<13)&&along%5===0)continue;
          color=C[across<3||across>12?4:along%(id.includes("dock")?3:4)===0?1:value];
        }
        else {
          if(kind==="fence"&&/N|S/.test(edges)&&!/[EW]/.test(edges)){
            if(x<6||x>9)continue;
            p.px(x-8,y-12,C[x===6?4:x===9?1:2]);continue;
          }
          if(kind==="gate"&&!o.open&&x>=6&&x<=9&&y>=7&&y<=10){
            p.px(x-8,y-12,C[y===7?4:0]);continue;
          }
          if(y<4||y>12||(y>6&&y<10&&x>2&&x<13)||kind==="gate"&&o.open&&x>4&&x<12)continue;
          color=C[style==="metal"&&x%4===3?4:x<3||x>12?3:y===4||y===10?4:2];
        }
      }
      p.px(x-8,y-12,color);
    }
  });
  const collision=["wall","fence","cliff","gate"].includes(kind)?{width:16,height:kind==="cliff"?4:6}:undefined;
  return {...result,meta:{...result.meta,...(connected?{autotile:connectedTiles.has(kind)?kind:"blend"}:{}),...(collision?{collision}:{})}};
}

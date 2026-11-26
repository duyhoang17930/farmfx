import { fit, noise2, rand } from "../../core/index.js";
import { asset, LEAF, STEEL, WATER, WOOD, wave } from "./art.js";

export const terrainPalettes={
  grassland:["#29423a","#48613c","#647d49","#87a65b","#b8ca77"],
  desert:["#5c473b","#9b744f","#c99965","#e9bd80","#f9daa0"],
  snowland:["#536a82","#7f99ae","#a9c3d0","#c8e2e2","#f5f5e9"],
  graveyard:["#292a3d","#4b424f","#665461","#85737c","#aa9699"],
  volcanic:["#352b3b","#553947","#85504e","#c96e49","#f8ac66"],
  swamp:["#263d3c","#3d5241","#566d4a","#7a8b55","#acaf66"],
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
export function terrain(id,kind,style,under,pattern=0){
  const palette=terrainPalettes[style]??terrainPalettes.grassland;
  const other=terrainPalettes[under]??WATER;
  const water=["shore","river","water","wave"].includes(kind);
  const connected=connectedTiles.has(kind);
  const inner=id.includes("inner-corner");
  const edges=kind==="river"?id.includes("junction")?"NEW":id.includes("corner")?"NE":"NS":
    inner?"":id.includes("outer-corner")?"NE":id==="island-edge"||id==="farmland-edge"?"S":id.includes("wall-corner")?"EW":"ES";
  const corners=inner||id==="farmland-corner"?["NE"]:[];
  const metaOptions={tileX:0,tileY:0,...(connected?{edges,corners}:{}),
    ...(kind==="gate"?{open:false}:{}),...(kind==="bridge"?{facing:"east-west"}:{}),background:other};
  const result=asset({name:id.replaceAll("-"," "),desc:descriptions[kind],tags:["terrain",kind,style],size:[16,16],origin:[8,12],
    duration:water?2.5:1,fps:water?12:1,palette,options:metaOptions},(p,phase,C,o)=>{
    const B=fit(o.background,5), edges=o.edges??"",corners=o.corners??[];
    for(let y=0;y<16;y++)for(let x=0;x<16;x++){
      const gx=x+o.tileX*16,gy=y+o.tileY*16;
      const n=rand(gx,gy,o.seed), d=distance(x,y,edges,corners);
      const fleck=noise2(gx*0.17,gy*0.18,o.seed);
      // broad two-tone patches with a rare fleck: the ground sits behind the props instead of competing with them
      const value=n>0.988?3:n<0.012?1:fleck>0.13?3:2;
      const ripple=wave(phase,1,gx*.059+gy*.13+fleck*.26)+(n-.5)*.4;
      let color=C[value];
      if(id==="flower-ground"&&n>0.9)color=n>.975?C[4]:B[4];
      if(id==="deep-snow")color=C[fleck>-.1?4:3];
      if(id==="burnt-ground")color=C[value>1?value-1:value];
      if(kind==="blend")color=d<2?B[value]:d<4?B[n>0.52?3:2]:d===4&&n>0.7?C[1]:C[value];
      else if(kind==="shore")color=d<2?B[ripple>0.75?3:1]:d<4?n>0.78?C[4]:C[1]:C[value];
      else if(kind==="cliff")color=d<1?C[0]:d<4?C[x%5===0?1:2]:d===4?C[4]:C[value];
      else if(kind==="river"){
        const cx=Math.abs(x-7.5),cy=Math.abs(y-7.5);
        const route=cx<4.6&&cy<4.6||edges.includes("N")&&cx<4.6&&y<8||edges.includes("S")&&cx<4.6&&y>7||
          edges.includes("W")&&cy<4.6&&x<8||edges.includes("E")&&cy<4.6&&x>7||d<2&&corners.length>0;
        color=route?C[ripple>0.74?3:1]:B[value];
      }else if(kind==="water"||kind==="wave")color=C[ripple>(kind==="wave"?.67:.86)?4:ripple>0.5?3:n>0.27?2:1];
      else if(kind==="crack")color=(Math.abs((gx+Math.floor(fleck*4))%9)<=0.8 || gy%7===1&&n>0.25)?C[0]:C[value];
      else if(kind==="floor"||kind==="wall"){
        const step=pattern===0?4:pattern===2?5:6;
        const seam=gy%step===0 || (gx+Math.floor(gy/step)*3)%8===0;
        color=d===0?C[0]:d===1?C[3]:seam?C[1]:gy%step===1&&n>0.5?C[3]:C[value];
        if(kind==="wall"&&y>12&&!edges.includes("S"))color=C[y===13?1:0];
        if(kind==="wall"&&d>10)color=C[value];
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
  return {...result,meta:{...result.meta,...(connected?{autotile:kind}:{}),...(collision?{collision}:{})}};
}

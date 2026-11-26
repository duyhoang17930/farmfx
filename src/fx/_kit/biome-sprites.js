import { fit, rand } from "../../core/index.js";
import { asset, GOLD, LEAF, VIOLET, WATER, WOOD, round, wave } from "./art.js";
import { shard } from "./resource-stone.js";
import { groundShadow } from "./sprite.js";
import { terrain, terrainPalettes } from "./world-terrain.js";

const vegetation=/grass|flower|bush|vine|lily/;
export function biomeSprite(path){
  const [biome,id]=path.split("/");
  if(id.includes("cliff"))return terrain(id,"cliff",biome);
  if(id.includes("shore"))return terrain(id,"shore",biome,biome==="volcanic"?"lava":biome==="snowland"?"ice":"water");
  if(id.includes("ground")||id==="cracked-sand"||id==="deep-snow"||id==="beach-sand"){
    const style=id==="ice-ground"?"ice":id==="beach-sand"?"sand":id==="dirt-ground"?"dirt":biome;
    return terrain(id,id.includes("cracked")?"crack":"ground",style);
  }
  if(/water|pond|river|lava-tile/.test(id)&&id!=="lava-waterfall"){
    const style=biome==="volcanic"?"lava":biome==="snowland"?"ice":biome==="crystal"?"crystal":biome==="swamp"?"swamp-water":"water";
    return terrain(id,id.includes("river")?"river":id.includes("pond")?"shore":"water",style,biome);
  }
  const tall=/tombstone|gate|waterfall|icicle|cluster/.test(id);
  return asset({name:id.replaceAll("-"," "),desc:`A ${id.replaceAll("-"," ")} sprite for the ${biome} biome.`,tags:["biome",biome,id],
    size:[48,48],origin:[24,38],palette:terrainPalettes[biome],duration:tall||vegetation.test(id)?2.5:1,
    fps:tall||vegetation.test(id)?12:1,bg:"field"},(p,t,C,o)=>{
    groundShadow(p,0,0,15,4);
    if(id==="lava-waterfall"){
      const L=fit(terrainPalettes.lava,5);
      p.rect(-14,-31,28,29,C[1]);p.rect(-10,-31,20,30,L[2]);
      for(let i=0;i<5;i++){const x=i*4-8,y=-30+(t+i/5)%1*25;p.line(x,y,x,y+4,L[i%2?3:1]);}
      p.ellipse(0,-1,13,4,L[3]);p.line(-5,-1,3,-1,L[4]);
    }else if(id==="icicle"||id==="crystal-cluster"||id==="coral"){
      const P=id==="coral"?fit(["#6b4058","#9a4e64","#c86d78","#e08d89","#ffb5a2"],5):C;
      for(const [x,y,w,h,k] of [[-8,-3,4,11,-2],[7,-1,5,15,4],[1,0,6,23,-1]])shard(p,x,y,w,h,k,P);
    }else if(id==="oasis"){
      p.ellipse(0,-5,16,7,C[2]);p.ellipse(0,-6,12,4.3,WATER[2]);p.line(-8,-6,3+wave(t)*5,-6,WATER[4]);
      p.beam(-10,-7,-8,-23,4,WOOD[3]);for(const a of [-1,1])p.arc(-8+a*5,-21,7,2,Math.PI,Math.PI*2,LEAF[3]);
    }else if(id==="sand-dune"){
      p.ellipse(0,-3,17,7,C[2]);p.arc(0,2,15,3,3.36,5.93,C[4]);p.line(-11,-1,12,-1,C[1]);
    }else if(id==="grave"){
      p.ellipse(0,-2,17,6,C[0]);p.ellipse(0,-3,13,4,C[1]);p.rect(-7,-16,14,10,C[0]);
      p.rect(-6,-15,11,8,C[3]);p.line(-6,-15,3,-15,C[4]);p.polyline([[4,-13],[1,-12],[2,-10]],C[1]);
    }else if(vegetation.test(id)){
      for(let i=0;i<7;i++){
        const x=i*4-12, h=6+rand(i,3,o.seed)*13, u=wave(t,1,i/7)*3;
        p.tri(x-2,-1,x+2,-1,x+u,-h,C[2+i%2]);p.line(x,-1,x+u,-h,C[3]);
        if(id.includes("flower"))round(p,x+u,-h,2.3,2.2,i%2?GOLD:VIOLET);
      }
      if(id==="lily-pad"){p.ellipse(0,-1,12,4,LEAF[2]);round(p,3,-4,4,3,VIOLET);}
      if(id==="swamp-vines")p.polyline([[-19,-25],[-12,-15],[0,-12],[8,-18],[19,-8]],LEAF[2]);
    }else if(/grave|tomb|fence/.test(id)){
      const wide=id.includes("fence")||id.includes("gate");
      if(wide)for(let i=-14;i<=14;i+=4){p.line(i,-16,i,0,C[1]);p.px(i,-17,C[4]);}
      else {
        p.poly([[-10,0],[-10,-15],[-6,-22],[6,-22],[10,-15],[10,0]],C[0]);
        p.poly([[-8,-2],[-8,-15],[-5,-20],[4,-20],[7,-15],[7,-2]],C[3]);
        p.line(-7,-15,-4,-20,C[4]);p.polyline([[5,-18],[3,-16],[5,-14]],C[1]);p.line(-7,-2,-3,-3,LEAF[1]);
      }
      p.line(-10,-6,10,-6,C[3]);p.line(0,-13,0,-3,C[4]);
      if(id==="graveyard-gate"){p.arc(0,-12,14,2,Math.PI,Math.PI*2,C[4]);p.line(-1,-12,-1,0,C[3]);}
    }else{
      const stone=id==="snow-rock"?fit(["#485e77","#698397","#8faebf","#bbd4db","#e5f0eb"],5):C;
      for(const [x,y,rx,ry] of [[-7,-2,8,6],[7,-3,8,7],[0,-8,10,9]])round(p,x,y,rx,ry,stone);
      p.polyline([[-9,-8],[-4,-12],[3,-13],[7,-10]],stone[4]);
      if(id==="volcanic-rock")p.polyline([[-5,-8],[-1,-5],[-3,-2],[1,0]],fit(terrainPalettes.lava,5)[2]);
    }
  });
}

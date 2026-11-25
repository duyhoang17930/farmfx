import { CREAM, GOLD, LEAF, RED, VIOLET, WATER, WOOD } from "./art.js";
import { inventoryItems, itemPoly as poly } from "./inventory-items.js";
import { drawProduceIcon } from "./produce-items.js";
import { Layer } from "./sprite.js";

const crops = {
  apple:RED, banana:GOLD, barley:WOOD, cabbage:LEAF, carrot:GOLD,
  cassava:WOOD, coconut:WOOD, corn:GOLD, cotton:CREAM, cucumber:LEAF,
  grape:VIOLET, palm:RED, onion:GOLD, orange:GOLD, potato:WOOD,
  rape:LEAF, rice:WATER, sorghum:RED, soybean:LEAF, "sugar-beet":CREAM,
  sugarcane:LEAF, "sweet-potato":VIOLET, tomato:RED, watermelon:RED,
  wheat:GOLD, yam:WOOD, cherry:RED, flower:VIOLET, mixed:WATER, magic:VIOLET,
};

function makeStamp(id) {
  const layer=new Layer(16,16);
  const painter=layer.begin(-8,-8);
  if(drawProduceIcon(painter,id,0,0)){
    const pixels=[];
    for(let y=-3;y<3;y++)for(let x=-3;x<3;x++){
      const c=layer.get(x*2,y*2) || layer.get(x*2+1,y*2+1);
      if(c)pixels.push([x,y,c]);
    }
    return pixels;
  }
  return [];
}

const entries=Object.fromEntries(Object.entries(crops).map(([key, palette])=>{
  const id=key==="rape"?"rapeseed":key==="mixed"?"mixed-seeds":key+"-seed";
  const crop={rape:"rapeseed",palm:"palm-fruit",cotton:"items/produce/cotton"}[key] ?? key;
  const stamp=makeStamp(crop);
  return [id,[`A seed packet with a ${crop.split("/").at(-1).replaceAll("-"," ")} label.`,palette,(p,x,y,C)=>{
    poly(p,x,y,[[-4,-5],[3,-5],[5,-3],[4,5],[-5,5],[-5,-3]],CREAM[0]);
    p.rect(x-4,y-4,8,9,CREAM[3]);p.line(x-4,y-4,x+3,y-4,C[3]);p.line(x-4,y+4,x+3,y+4,C[2]);
    p.line(x+3,y-4,x+4,y-3,CREAM[4]);
    for(const [a,b,c] of stamp)p.px(x+a,y+b+1,c);
    if(!stamp.length){
      p.line(x-2,y+2,x+2,y-2,C[1]);p.px(x-2,y+1,C[2]);p.px(x,y,C[3]);p.px(x+1,y-2,C[4]);
      if(key==="magic")p.line(x,y-3,x,y+2,C[4]);
      if(key==="flower")p.line(x-2,y-1,x+2,y-1,C[4]);
    }
  }]];
}));

export const {item:seedItem,drawIcon:drawSeedIcon}=inventoryItems("seeds",entries);

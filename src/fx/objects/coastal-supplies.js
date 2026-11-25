import { ramp } from "../../core/index.js";
import { asset, GOLD, LEAF, STEEL, WOOD, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

const clay=ramp(["#654954","#996b64","#bf8370","#dea78c","#f0c6a0"]);
export const { meta, draw } = asset({
  name:"Coastal supplies",desc:"Coastal carts, crates, log stacks and pots with distinct top, front and side lighting.",
  tags:["object","wood","coast"],size:[64,48],origin:[32,35],duration:2.5,fps:16,
  palette:WOOD,options:{ object:"cart" },
},(p,t,C,o)=>{
  const type=o.object;
  const width=type==="cart"?20:type==="pot"?10:16;
  groundShadow(p,1,1,width,3.6,.75);
  if(type==="logs"){
    for(const [x,y] of [[-7,-3],[2,-2],[-3,-9],[4,-8],[0,-14]]){
      p.beam(x-4,y+2,x+9,y-4,7,C[0]);
      p.beam(x-3,y+1,x+8,y-4,5,C[2]);
      p.line(x-3,y-1,x+8,y-6,C[4]);
      p.line(x-1,y+2,x+8,y-2,C[1]);
      p.ellipse(x-3,y+1,3,3,C[0]);
      p.ellipse(x-3,y,2,2,C[4]);
      p.px(x-3,y,C[2]);
    }
    return;
  }
  if(type==="pot"){
    p.ellipse(0,-8,8,4,clay[0]);
    p.poly([[-8,-8],[-6,-2],[-3,1],[4,1],[7,-4],[8,-8]],clay[1]);
    p.poly([[-7,-7],[-5,-1],[-1,1],[2,-6]],clay[2]);
    p.ellipse(0,-8,7,3,clay[3]);p.ellipse(0,-8,5,2,clay[0]);
    p.line(-7,-8,-3,-6,clay[4]);
    for(const [x,h] of [[-4,18],[0,21],[4,16]]){
      const sx=x+Math.round(wave(t,1,x*.05));
      p.line(0,-8,sx,-h,LEAF[2]);
      p.poly([[sx,-h],[sx+3,-h-2],[sx+3,-h+1],[sx,-h+3]],LEAF[3]);
      p.ellipse(sx,-h,2.2,2,clay[1]);p.px(sx-1,-h-1,clay[4]);
    }
    return;
  }
  if(type==="clay"||type==="salt"){
    const S=type==="salt"?STEEL:clay;
    p.poly([[-11,-2],[-8,-8],[-2,-12],[5,-11],[9,-8],[12,-2],[8,1],[-8,1]],S[0]);
    p.poly([[-9,-3],[-6,-8],[-2,-11],[4,-10],[8,-7],[6,-4],[-3,-2]],S[3]);
    p.poly([[6,-4],[8,-7],[11,-3],[7,0],[-5,0]],S[2]);
    p.line(-7,-6,-3,-9,S[4]);p.line(1,-9,4,-8,S[4]);
    p.line(-8,-1,-6,-2,S[2]);p.px(11,0,S[3]);
    return;
  }
  const cart=type==="cart", bin=type==="bin", x=cart?-12:-13, y=cart?-15:-17, lift=cart?5:0;
  if(cart){
    for(const q of [-11,9]){
      p.ellipse(q,-2,5,5,STEEL[0]);p.ellipse(q,-2,3.5,3.5,C[2]);
      p.line(q-2,-2,q+2,-2,STEEL[1]);p.line(q,-5,q,1,STEEL[1]);
      p.px(q,-2,GOLD[4]);p.line(q-2,-5,q,-5,STEEL[3]);
    }
    p.beam(10,-7,22,-13,3,C[0]);p.line(12,-8,22,-14,C[4]);
  }
  p.poly([[x,y],[x+7,y-6],[14,y-6],[17,y-2],[14,-4-lift],[9,1-lift],[x,1-lift]],C[0]);
  p.poly([[x+1,y+1],[x+7,y-5],[13,y-5],[16,y-2],[9,y+1]],C[3]);
  p.poly([[x+4,y],[x+8,y-4],[11,y-4],[8,y]],C[1]);
  p.poly([[x+1,y+2],[9,y+2],[8,-lift],[x+1,-lift]],C[2]);
  p.poly([[9,y+2],[15,y-1],[13,-5-lift],[9,0-lift]],C[1]);
  p.line(x+7,y-5,13,y-5,C[4]);p.line(x+1,y+1,9,y+1,C[4]);
  for(let z=y+5;z< -lift;z+=4)p.line(x+2,z,8,z,C[1]);
  if(bin){
    p.rect(-6,-11,6,5,C[0]);p.rect(-5,-10,4,3,GOLD[2]);p.px(-3,-9,C[0]);
  } else if(!cart){
    p.line(x+3,-3,5,-14,C[3]);p.px(6,-5,GOLD[3]);p.px(x+3,-14,GOLD[3]);
  }
});

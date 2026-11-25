import { clamp, ramp, seg } from "../../core/index.js";
import { asset, GOLD, wave, WOOD } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

const greens=["#354e38","#547546","#71964f","#91b45f","#cccf7e"];
const fruitColors = Object.fromEntries(Object.entries({
  carrot:["#814b39","#cd773d","#f1ac52"],
  tomato:["#7e4548","#c36150","#e9946b"],
  melon:["#42694e","#6e9560","#a3bb70"],
  grape:["#564665","#8a6091","#bc8ead"],
  pepper:["#7e5142","#d98552","#f2b66b"],
  turnip:["#80627d","#b190a7","#edd6bd"],
  bean:["#426349","#7ba05c","#b1c373"],
}).map(([id,colors])=>[id,ramp(colors)]));

export const { meta, draw } = asset({
  name:"Coastal crop",desc:"Readable plant silhouettes and fruit on transparent ground at five growth stages.",
  tags:["crop","plant","farm"],size:[32,48],origin:[16,38],duration:4.8,fps:16,palette:greens,
  options:{ crop:"carrot", stage:-1 },
},(p,t,C,o)=>{
  const stage=o.stage>=0?clamp(Math.round(o.stage),0,4):
    t<.11?0:t<.22?1:t<.36?2:t<.51?3:4;
  const harvest=o.stage<0?seg(t,.89,.99):0;
  if(harvest>=1)return;
  const stem = o.stage>=0?[0,.32,.58,.84,1][stage]:stage===0?0:.28+.72*seg(t,.11,.65);
  const ripe=stage===4;
  const wind=Math.round(wave(t,1,o.seed*.03)*stem);
  p.fade*=1-harvest;
  groundShadow(p,0,0,5*stem+2,2,.48);
  if(stage===0){
    p.line(-1,-1,1,-1,GOLD[3]);p.px(0,-2,GOLD[4]);return;
  }
  const y= -Math.round(harvest*7);
  const at=([x,z])=>[Math.round(x*stem),Math.round(z*stem)+y];
  const polygon=(points,c)=>p.poly(points.map(at),c);
  const line=(a,b,c)=>p.line(...at(a),...at(b),c);
  const leaf=(x,z,sx,sy,side)=>{
    const pts=[[x,z],[x+side*2,z+sy+1],[x+side*sx,z+sy],[x+side*(sx+1),z+sy-3],[x+side*3,z+sy-3]];
    polygon(pts,C[0]);
    polygon([[x+side,z-1],[x+side*2,z+sy],[x+side*sx,z+sy-1],[x+side*3,z+sy-2]],C[2]);
    line([x+side*2,z+sy],[x+side*sx,z+sy-1],C[3]);
  };
  const fruit=(type,x,z,rx,ry)=>{
    const F=fruitColors[type], [xx,yy]=at([x,z]);
    p.ellipse(xx,yy,rx,ry,F[0]);p.ellipse(xx-.4,yy-.7,Math.max(.7,rx-1),Math.max(.6,ry-1),F[1]);
    p.px(xx-1,yy-1,F[2]);
  };
  const type=o.crop;
  if(type==="wheat"||type==="rice"||type==="corn"){
    const corn=type==="corn", rice=type==="rice";
    for(const [x,h] of corn?[[0,23]]:[[-4,15],[0,20],[4,16]]) {
      const tip=x+wind+(rice?2:0);
      line([x,1],[tip,-h],C[0]);
      line([x+1,0],[tip+1,-h+2],C[2]);
      leaf(x,-5,corn?7:4,-4,x>0?1:-1);
      if(stage>=3){
        if(rice){
          polygon([[tip-1,-h+2],[tip+1,-h-1],[tip+4,-h+1],[tip+5,-h+5],[tip+3,-h+7]],C[2]);
          line([tip+1,-h+1],[tip+4,-h+4],ripe?C[4]:C[3]);
        }else{
          polygon([[tip-2,-h+8],[tip-3,-h+3],[tip,-h-1],[tip+2,-h+1],[tip+2,-h+7]],ripe?GOLD[2]:C[3]);
          line([tip-1,-h+6],[tip,-h+1],ripe?GOLD[4]:C[4]);
        }
      }
    }
    if(corn){
      leaf(0,-9,6,-5,1);
      if(stage>=3){
        polygon([[1,-8],[2,-14],[5,-16],[6,-11],[4,-8]],C[0]);
        line([3,-10],[4,-14],ripe?GOLD[4]:C[4]);
      }
    }
  } else if(type==="melon"||type==="cabbage"){
    leaf(0,-1,7,-2,-1);leaf(0,-1,7,-3,1);leaf(0,-3,4,-4,-1);
    if(type==="melon"&&stage>=3)fruit("melon",3,-3,stage===4?5:3,3);
    else if(type==="cabbage"){
      polygon([[-6,-2],[-6,-6],[-2,-10],[3,-10],[6,-6],[5,-2],[0,0]],C[2]);
      polygon([[-4,-5],[-2,-8],[2,-9],[4,-5],[0,-3]],C[3]);
      line([-2,-4],[1,-8],C[4]);
    }
  } else {
    const vine=type==="grape"||type==="bean", tall=vine||type==="tomato"||type==="pepper";
    if(tall){
      const height=vine?19:16;
      if(vine){line([-4,1],[-3,-height-2],WOOD[2]);line([-4,-height],[4,-height],WOOD[4]);}
      line([0,0],[wind,-height],C[1]);
      leaf(0,-5,6,-4,-1);leaf(0,-8,6,-4,1);leaf(wind,-12,5,-4,-1);
      if(stage>=3){
        if(type==="grape")for(const [x,z] of [[4,-12],[6,-11],[3,-10],[5,-8]])fruit(type,x,z,2,2);
        else if(type==="bean"){leaf(1,-11,4,-3,1);line([4,-13],[5,-8],C[4]);}
        else{fruit(type,-3,-7,3,3);if(ripe)fruit(type,4,-10,3,3);}
      }
    } else {
      line([0,0],[wind,-8],C[1]);
      leaf(0,-1,5,-7,-1);leaf(wind,-2,5,-9,1);leaf(0,-3,3,-11,-1);
      if(stage>=3){
        if(type==="carrot"){
          const F=fruitColors.carrot;
          polygon([[-3,-3],[3,-3],[2,1],[0,4],[-2,1]],F[0]);
          polygon([[-2,-3],[2,-3],[0,3]],F[1]);
          line([-1,-2],[-1,0],F[2]);
        } else fruit("turnip",0,-1,4,3);
      }
    }
  }
});

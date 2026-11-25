import { ramp, rand } from "../../core/index.js";
import { asset, GOLD, STEEL, WATER, WOOD, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

const red=ramp(["#5d464d","#905a54","#bb7962","#d89976","#edbd90"]);
const plaster=ramp(["#746052","#9e8166","#c3a57e","#e2c69a","#f4dfb7"]);

function stoneStack(p,x,y,w,h,C) {
  p.poly([[x,y],[x,y-h],[x+4,y-h-3],[x+w+4,y-h-3],[x+w+4,y-3],[x+w,y]],C[0]);
  p.rect(x+1,y-h+1,w-1,h-1,C[2]);
  p.line(x+1,y-h+1,x+w-1,y-h+1,C[4]);
  for(let z=y-h+5;z<y;z+=5) {
    p.line(x+1,z,x+w-1,z,C[1]);
    p.px(x+2+(z%3+3)%3,z-1,C[3]);
  }
}

function windowPane(p,x,y,w,h,C) {
  p.rect(x-1,y-1,w+2,h+2,C[0]);p.rect(x,y,w,h,GOLD[3]);
  p.line(x,y,x+w-1,y,C[4]);p.line(x+Math.floor(w/2),y,x+Math.floor(w/2),y+h-1,C[1]);
  p.line(x,y+Math.floor(h/2),x+w-1,y+Math.floor(h/2),C[1]);
  p.line(x,y+h,x+w-1,y+h,C[3]);
}

export const { meta, draw } = asset({
  name:"Coastal trades",desc:"Four distinct coastal trade buildings with a fishing deck, open carpentry shed, stone forge or rounded bakery.",
  tags:["building","coast","workshop"],size:[112,96],origin:[54,77],duration:3,fps:14,
  palette:WOOD,options:{ style:"fishing", active:true },
},(p,t,C,o)=>{
  groundShadow(p,2,1,33,5,.75);
  if(o.style==="fishing") {
    for(const x of [-21,-11,9,22]){
      p.rect(x,-17,4,18,C[0]);p.line(x+1,-15,x+1,-1,C[3]);
    }
    p.poly([[-25,-9],[-18,-17],[18,-17],[27,-11],[25,-5],[-25,-5]],C[0]);
    p.poly([[-23,-10],[-17,-16],[18,-16],[25,-11],[23,-8],[-23,-8]],C[3]);
    for(let x=-17;x<22;x+=5)p.line(x,-15,x-5,-9,C[1]);
    p.poly([[-21,-14],[-21,-33],[-13,-43],[10,-43],[21,-35],[21,-20],[13,-15]],C[0]);
    p.rect(-20,-32,34,17,C[2]);
    p.poly([[13,-34],[20,-38],[20,-21],[13,-16]],C[1]);
    for(let y=-29;y<-16;y+=4){p.line(-20,y,13,y,C[1]);p.px(-19,y-1,C[4]);}
    p.poly([[-22,-33],[-5,-47],[18,-33]],C[1]);
    p.poly([[-24,-33],[-16,-41],[3,-56],[27,-41],[19,-33],[-5,-47]],WATER[0]);
    p.poly([[-22,-34],[-15,-41],[2,-54],[-6,-46]],WATER[3]);
    p.poly([[-4,-47],[3,-54],[25,-41],[18,-34]],WATER[2]);
    for(let i=1;i<=3;i++){
      const x=-5+i*5,y=-47+i*3;
      p.line(x,y,x+8,y-8,WATER[1]);
      p.line(x+1,y,x+9,y-8,WATER[3]);
    }
    p.line(-23,-33,-5,-47,WATER[4]);p.line(-5,-47,18,-33,WATER[0]);
    p.line(-12,-35,-5,-41,C[3]);p.line(-5,-41,3,-35,C[2]);
    windowPane(p,-15,-29,9,8,C);
    p.rect(2,-31,8,16,C[0]);p.line(3,-30,3,-17,C[3]);
    p.line(0,-4,7,-4,C[4]);p.line(-13,-6,-3,-6,C[2]);
    p.line(19,-16,19,-24,C[0]);p.line(20,-23,26,-21,GOLD[3]);
    return;
  }
  if(o.style==="lumber") {
    p.poly([[-31,-5],[-25,-12],[26,-12],[34,-6],[30,1],[-29,1]],C[0]);
    p.poly([[-29,-6],[-24,-11],[25,-11],[32,-6],[28,-2],[-28,-2]],C[3]);
    p.poly([[-26,-6],[-26,-33],[-15,-44],[28,-44],[30,-15],[23,-9]],C[0]);
    p.rect(-25,-32,48,25,C[2]);p.rect(-15,-28,28,22,C[0]);
    p.poly([[19,-33],[28,-41],[29,-16],[23,-9]],C[1]);
    for(let y=-27;y<-7;y+=5)p.line(-25,y,-17,y,C[1]);
    p.line(-15,-27,-15,-8,C[4]);p.line(13,-26,13,-8,C[3]);
    p.poly([[-30,-30],[-22,-49],[26,-49],[34,-42],[27,-30]],WATER[0]);
    p.poly([[-28,-31],[-21,-47],[25,-47],[31,-42],[26,-32]],WATER[2]);
    for(let y=-44;y<=-32;y+=4)p.line(-22+(y+44)/-2,y,29-(y+44)/3,y,WATER[3]);
    p.line(-29,-30,26,-30,WATER[4]);
    for(const [x,y] of [[-6,-8],[1,-9],[8,-8],[-3,-13],[4,-13]]){
      p.beam(x,y,x+9,y-4,4,C[1]);p.line(x,y-1,x+8,y-5,C[3]);
      p.ellipse(x,y,2.2,2,C[4]);p.px(x,y,C[2]);
    }
    return;
  }
  if(o.style==="forge"){
    stoneStack(p,10,-23,12,39,STEEL);
    p.poly([[-28,-1],[-28,-32],[-12,-48],[11,-48],[27,-33],[27,-10],[17,-2]],STEEL[0]);
    p.rect(-26,-31,44,28,STEEL[2]);
    p.poly([[18,-31],[26,-35],[26,-11],[18,-3]],STEEL[1]);
    for(let y=-26;y<-3;y+=6){p.line(-26,y,17,y,STEEL[1]);p.line(-26,y-1,-20,y-1,STEEL[4]);}
    p.poly([[-31,-32],[-16,-48],[-2,-55],[12,-55],[27,-40],[29,-34],[17,-31],[7,-44],[-12,-44],[-25,-29]],red[0]);
    p.poly([[-29,-33],[-15,-47],[-2,-53],[11,-53],[26,-37],[17,-32],[7,-45],[-12,-45]],red[2]);
    p.line(-15,-47,-2,-53,red[4]);p.line(-23,-38,-12,-46,red[3]);p.line(3,-51,15,-44,red[3]);
    p.poly([[-16,-3],[-16,-19],[-8,-27],[7,-27],[14,-20],[14,-3]],STEEL[0]);
    p.line(-16,-19,-8,-27,STEEL[4]);
    if(o.active){
      p.ellipse(0,-9,8,4,red[1]);p.line(-6,-9,6,-9,GOLD[3]);p.px(-1,-10+Math.round(wave(t,3)),GOLD[4]);
      for(let i=0;i<4;i++){
        const a=(t+i/4)%1;
        p.blend(19+wave(a)*2,-64-a*8,STEEL[3],Math.sin(a*Math.PI)*.6);
      }
    }
    p.poly([[10,-4],[21,-9],[30,-8],[28,-2],[22,2],[10,2]],C[1]);
    p.line(12,-4,22,-8,C[4]);p.px(23,-6,STEEL[4]);
    return;
  }
  stoneStack(p,-25,-15,9,28,plaster);
  p.poly([[-23,-2],[-23,-27],[-17,-41],[-8,-48],[14,-48],[27,-34],[29,-12],[19,-3]],plaster[0]);
  p.poly([[-21,-4],[-21,-27],[-16,-38],[-8,-45],[13,-44],[22,-32],[22,-6]],plaster[2]);
  p.poly([[20,-31],[27,-32],[28,-13],[20,-5]],plaster[1]);
  p.poly([[-27,-29],[-23,-43],[-15,-52],[-3,-55],[16,-52],[25,-44],[31,-32],[22,-28],[13,-39],[-13,-39],[-21,-27]],red[0]);
  p.poly([[-26,-30],[-22,-42],[-14,-51],[-3,-54],[16,-51],[24,-44],[29,-33],[22,-29],[13,-40],[-13,-40]],red[2]);
  for(const [x,y] of [[-17,-46],[-19,-42],[-22,-37],[-16,-50]])p.line(x,y,-x+5,y+1,red[3]);
  p.line(-25,-28,-13,-39,red[4]);p.line(-12,-39,13,-39,red[3]);
  p.poly([[-9,-4],[-9,-19],[-5,-24],[4,-24],[8,-19],[8,-4]],plaster[0]);
  p.line(-8,-19,-4,-23,plaster[4]);p.rect(-6,-19,11,14,C[2]);p.px(3,-12,GOLD[4]);
  windowPane(p,11,-24,10,10,C);
  p.poly([[8,-12],[22,-12],[25,-9],[21,-6],[8,-6]],C[0]);
  p.line(9,-11,21,-11,C[4]);
  for(let i=0;i<4;i++)p.ellipse(10+i*3,-10+(i%2),1.6,1.1,GOLD[2]);
  if(o.active){
    const a=(t+rand(1,2,o.seed))%1;
    p.blend(-19+wave(a),-44-a*9,plaster[4],Math.sin(a*Math.PI)*.5);
  }
});

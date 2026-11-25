import { asset, CREAM, GOLD, RED, STEEL, VIOLET, WATER, wave } from "./art.js";
import { twinkle } from "./sprite.js";

const expressions={
 happy:"grin",sad:"frown",angry:"brow",surprised:"open",confused:"?",scared:"open",tired:"sleep",
 sleeping:"Z",hungry:"food",thirsty:"drop",love:"heart","broken-heart":"split",question:"?",exclamation:"!",
 thinking:"dots",idea:"bulb","music-note":"note",laughing:"grin",crying:"tear",sweat:"drop",dizzy:"spin",
 annoyed:"brow",greeting:"hand",goodbye:"hand",celebration:"party",
};
function glyph(p,kind,id,y,C,t){
  if(kind==="?"||kind==="!"||kind==="Z"){p.text(kind,0,y-6,C[2],{font:"big",scale:2,align:"center"});return;}
  if(kind==="heart"||kind==="split"){
    p.poly([[-6,y-3],[-3,y-6],[0,y-4],[3,y-6],[6,y-3],[5,y+1],[0,y+5],[-5,y+1]],RED[2]);
    p.px(-3,y-4,RED[4]);if(kind==="split")p.polyline([[1,y-4],[-1,y-1],[1,y],[0,y+4]],CREAM[4]);return;
  }
  if(kind==="drop"||kind==="tear"){
    p.poly([[0,y-6],[4,y],[3,y+4],[-3,y+4],[-4,y]],WATER[2]);p.line(-2,y,-2,y+2,WATER[4]);return;
  }
  if(kind==="food"){p.ellipse(0,y+2,7,3,CREAM[2]);p.ellipse(0,y-1,4,2.5,GOLD[3]);return;}
  if(kind==="dots"){for(const x of [-5,0,5])p.circle(x,y,1.25,C[2]);return;}
  if(kind==="note"){p.line(3,y-6,3,y+2,VIOLET[2]);p.line(3,y-6,7,y-3,VIOLET[2]);p.ellipse(0,y+2,3.5,2,VIOLET[3]);return;}
  if(kind==="bulb"){p.circle(0,y-2,4.2,GOLD[3]);p.rect(-2,y+2,5,4,GOLD[1]);p.px(-1,y-3,GOLD[4]);return;}
  if(kind==="spin"||kind==="party"){for(let k=0;k<3;k++)twinkle(p,k*5-5,y+wave(t,1,k/3)*4,2.3,C[3],GOLD[3]);return;}
  if(kind==="hand"){p.ellipse(wave(t)*2,y+1,3.8,4,GOLD[3]);for(let k=-3;k<4;k+=2)p.line(k+wave(t)*2,y,k+wave(t)*2,y-6+Math.abs(k)/2,GOLD[2]);return;}
  p.circle(0,y,8.2,kind==="brow"?RED[3]:GOLD[3]);p.line(-4,y-4,-2,y-5,GOLD[4]);
  p.rect(-4,y-2,2,2,C[0]);p.rect(3,y-2,2,2,C[0]);
  if(kind==="open")p.ellipse(0,y+3,id==="scared"?2.6:1.8,2,C[0]);
  else if(kind==="grin")p.polyline([[-4,y+1],[0,y+4],[4,y+1]],C[0]);
  else if(kind==="frown"||kind==="brow"){p.polyline([[-3,y+4],[0,y+2],[3,y+4]],C[0]);if(kind==="brow")p.line(-5,y-4,-2,y-2,C[0]);}
  else p.line(-3,y+3,3,y+3,C[0]);
}
export function emoteBubble(id){
  const kind=expressions[id];
  return asset({name:id.replaceAll("-"," "),desc:`A floating ${id.replaceAll("-"," ")} emote with a transparent background.`,tags:["emote",kind],
    size:[48,48],origin:[24,35],duration:2.4,fps:12,palette:id==="angry"||id==="annoyed"?RED:STEEL,bg:"field"},(p,t,C)=>{
    const y=-16+Math.round(2*wave(t));
    p.ellipse(0,y,15,12,C[0]);p.ellipse(0,y-0.5,13.8,10.9,CREAM[4]);
    p.tri(-5,y+8,-8,y+15,3,y+9,C[0]);p.tri(-4,y+8,-6,y+12,1,y+9,CREAM[4]);
    glyph(p,kind,id,y-1,C,t);
    if(id==="laughing")p.line(9,y-3,11,y-6,GOLD[4]);
  });
}

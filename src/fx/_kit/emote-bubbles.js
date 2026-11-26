import { asset, CREAM, GOLD, RED, STEEL, VIOLET, WATER, wave } from "./art.js";
import { twinkle } from "./sprite.js";

const expressions={
 happy:"grin",sad:"frown",angry:"brow",surprised:"open",confused:"?",scared:"open",tired:"sleep",
 sleeping:"Z",hungry:"food",thirsty:"drop",love:"heart","broken-heart":"split",question:"?",exclamation:"!",
 thinking:"dots",idea:"bulb","music-note":"note",laughing:"grin",crying:"tear",sweat:"drop",dizzy:"spin",
 annoyed:"brow",greeting:"hand",goodbye:"hand",celebration:"party",
};
function glyph(p,kind,id,y,C,t){
  if(kind==="?"||kind==="!"||kind==="Z"){p.text(kind,0,y-3,C[2],{font:"big",align:"center"});return;}
  if(kind==="heart"||kind==="split"){
    p.poly([[-4,y-2],[-2,y-4],[0,y-2],[2,y-4],[4,y-2],[3,y+1],[0,y+4],[-3,y+1]],RED[2]);
    p.px(-2,y-3,RED[4]);if(kind==="split")p.polyline([[1,y-2],[-1,y],[1,y+1],[0,y+3]],CREAM[4]);return;
  }
  if(kind==="drop"||kind==="tear"){
    p.poly([[0,y-4],[3,y],[2,y+3],[-2,y+3],[-3,y]],WATER[2]);p.line(-1,y,-1,y+1,WATER[4]);return;
  }
  if(kind==="food"){p.ellipse(0,y+2,4.5,1.5,CREAM[2]);p.ellipse(0,y,3,2,GOLD[3]);return;}
  if(kind==="dots"){for(const x of [-3,0,3])p.px(x,y,C[2]);return;}
  if(kind==="note"){p.line(2,y-4,2,y+2,VIOLET[2]);p.line(2,y-4,5,y-2,VIOLET[2]);p.ellipse(0,y+2,2.5,1.5,VIOLET[3]);return;}
  if(kind==="bulb"){p.circle(0,y-1,3,GOLD[3]);p.rect(-1,y+2,3,2,GOLD[1]);p.px(-1,y-2,GOLD[4]);return;}
  if(kind==="spin"||kind==="party"){for(let k=0;k<3;k++)twinkle(p,k*4-4,y+wave(t,1,k/3)*2,1.6,C[3],GOLD[3]);return;}
  if(kind==="hand"){const x=Math.round(wave(t));p.ellipse(x,y+1,2.8,2.5,GOLD[3]);for(let k=-2;k<3;k+=2)p.line(x+k,y,x+k,y-4+Math.abs(k)/2,GOLD[2]);return;}
  p.circle(0,y,5.4,kind==="brow"?RED[3]:GOLD[3]);p.line(-3,y-2,-1,y-3,GOLD[4]);
  p.px(-2,y-1,C[0]);p.px(2,y-1,C[0]);
  if(kind==="open")p.ellipse(0,y+2,id==="scared"?1.8:1.2,1.2,C[0]);
  else if(kind==="grin")p.polyline([[-2,y+1],[0,y+3],[2,y+1]],C[0]);
  else if(kind==="frown"||kind==="brow"){p.polyline([[-2,y+3],[0,y+1],[2,y+3]],C[0]);if(kind==="brow")p.line(-3,y-3,-1,y-1,C[0]);}
  else p.line(-2,y+2,2,y+2,C[0]);
}
export function emoteBubble(id){
  const kind=expressions[id];
  return asset({name:id.replaceAll("-"," "),desc:`A floating ${id.replaceAll("-"," ")} emote with a transparent background.`,tags:["emote",kind],
    size:[48,48],origin:[24,35],duration:2.4,fps:12,palette:id==="angry"||id==="annoyed"?RED:STEEL,bg:"field"},(p,t,C)=>{
    const y=-12+Math.round(wave(t));
    p.ellipse(0,y,10,8,C[0]);p.ellipse(0,y-0.5,9,7,CREAM[4]);
    p.tri(-4,y+5,-6,y+11,2,y+6,C[0]);p.tri(-3,y+5,-4,y+8,0,y+6,CREAM[4]);
    glyph(p,kind,id,y-1,C,id==="goodbye"?1-t:t);
    if(id==="laughing")p.line(6,y-2,7,y-4,GOLD[4]);
    if(id==="angry")p.polyline([[-7,y-1],[-6,y-4],[-4,y-5]],RED[3]);
    if(id==="confused")p.px(5,y-4,VIOLET[3]);
    if(id==="crying"){p.line(-4,y,-5,y+3,WATER[2]);p.line(4,y,5,y+3,WATER[3]);}
    if(id==="sweat")p.line(4,y-4,6,y-5,WATER[3]);
    if(id==="celebration")p.tri(-5,y+4,-4,y,-1,y+2,GOLD[3]);
    if(id==="goodbye")p.polyline([[4,y-3],[6,y-3],[5,y-5]],GOLD[2]);
  });
}

import { frame, label, ui } from "../_kit/farm-ui.js";
import { CREAM, GOLD, wave } from "../_kit/art.js";
export const { meta, draw } = ui("Dialogue box","A two-line dialogue panel with a speaker name, type-in demo and continue marker.",160,48,
  {speaker:"MIRA",lines:["THE RAIN WILL PASS.","TRY THE POND AFTER."],reveal:-1},(p,ph,C,o)=>{
  frame(p,-77,-19,154,38,C);p.rect(-73,-15,146,28,CREAM[3]);
  const lines=Array.isArray(o.lines)?o.lines:[];
  label(p,o.speaker,-69,-13,30,C[0]);p.line(-69,-5,65,-5,C[2]);
  const length=lines.slice(0,2).reduce((n,line)=>n+String(line??"").slice(0,33).length,0);
  const type=Math.min(1,ph*2.45,(1-ph)*4.4);
  let remaining=o.reveal<0?Math.floor(type*length):Math.max(0,Math.floor(o.reveal));
  for(let i=0;i<2;i++){
    const line=String(lines[i]??"").slice(0,33);label(p,line,-69,0+i*6,remaining,C[0]);remaining=Math.max(0,remaining-line.length);
  }
  const y=12+Math.round(wave(ph,3));p.tri(65,y,71,y,68,y+3,GOLD[4]);
});

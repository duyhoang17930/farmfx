import { frame, label, ui } from "../_kit/farm-ui.js";
import { CREAM, GOLD, wave } from "../_kit/art.js";
export const { meta, draw } = ui("Dialogue box","A two-line dialogue panel with a speaker name, type-in demo and continue marker.",160,48,
  {speaker:"MIRA",lines:["THE RAIN WILL PASS.","TRY THE POND AFTER."],reveal:-1},(p,ph,C,o)=>{
  frame(p,-77,-19,154,38,C);p.rect(-73,-15,146,29,CREAM[3]);
  const lines=(Array.isArray(o.lines)?o.lines.slice(0,2):[]).map((line)=>[...String(line??"").normalize("NFC")].slice(0,33));
  label(p,o.speaker,-69,-12,30,C[0]);p.line(-69,-5,65,-5,C[2]);
  const length=lines.reduce((n,line)=>n+line.length,0);
  const type=Math.min(1,ph*2.45,(1-ph)*4.4);
  let remaining=o.reveal<0?Math.floor(type*length):Math.max(0,Math.floor(o.reveal));
  for(const [i,line] of lines.entries()){
    label(p,line.join(""),-69,-1+i*9,remaining,C[0]);remaining=Math.max(0,remaining-line.length);
  }
  const y=12+Math.round(wave(ph,3));p.tri(65,y,71,y,68,y+3,GOLD[4]);
});

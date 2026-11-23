import { ui } from "../_kit/farm-ui.js";
import { GOLD, LEAF, RED, wave } from "../_kit/art.js";
export const { meta, draw } = ui("Tile cursor","Pulsing corner brackets for a 16 px tile, with valid and blocked placement colors.",32,32,{state:"valid"},(p,ph,C,o)=>{
  const P=o.state==="blocked"?RED:o.state==="valid"?LEAF:GOLD;
  const d=8+Number(wave(ph)>0.7),k=0.65+.35*wave(ph,1,.25);
  for(const x of [-1,1])for(const y of [-1,1]){
    p.line(x*d,y*d,x*(d-4),y*d,P[4],k);p.line(x*d,y*d,x*d,y*(d-4),P[3],k);
    p.px(x*(d+1),y*(d+1),P[1]);
  }
});

import { rand, seg } from "../../core/index.js";
import { GOLD, LEAF } from "../_kit/art.js";
import { burst } from "../_kit/farm-feedback.js";

export const { meta, draw } = burst("Wildflower pick",
  "Loose petals and seeds lift from the stems then flutter quietly back toward the ground.",
  "flowers", ["#805d68","#bd8791","#e7aeb0","#ffe8ba","#fff4d2"], 0.55, (p,t,C,o) => {
    const fade = 1 - seg(t,0.53,0.95);
    for (let i = 0; i < 7; i++) {
      const x = (i-3)*1.8 + (i%2 ? 1 : -1)*t*(4+10*rand(i,1,o.seed));
      const y = -7-Math.sin(Math.PI*t)*(4+7*rand(i,2,o.seed))+t*3;
      p.line(x,y,x+1,y+(i%2),i===0?LEAF[3]:C[2+i%3],fade);
      if (i<2) p.dot(x-1,y-1,GOLD[4],fade);
    }
  });

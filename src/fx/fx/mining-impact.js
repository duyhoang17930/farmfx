import { burst, chips, puff } from "../_kit/farm-feedback.js";
import { STEEL, GOLD } from "../_kit/art.js";
import { twinkle } from "../_kit/sprite.js";
export const { meta, draw } = burst("Mining impact","Sharp fragments, a pale strike flash and dust mark a pick hitting stone.","mine",STEEL,.86,(p,u,C,o)=>{
  chips(p,u,C,o,13,"stone");puff(p,u,C,o,5);
  if(u<.18)twinkle(p,0,-5,4*(1-u/.18),GOLD[3],GOLD[4]);
});

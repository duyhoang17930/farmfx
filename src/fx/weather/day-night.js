import { weather } from "../_kit/farm-feedback.js";
import { GOLD, VIOLET, wave } from "../_kit/art.js";
import { clamp, mix } from "../../core/index.js";
export const { meta, draw } = weather("Day and night","A configurable global tint that cycles from clear noon to golden dusk and violet night.",VIOLET,(p,ph,C,o,w,h)=>{
  const phase=o.phase<0?ph:clamp(o.phase);
  const night=(1-wave(phase,1,.25))*.5;
  const twilight=Math.max(0,1-Math.abs(night-.53)*4.4);
  if(night<.015)return;
  const c=mix(C[0],GOLD[3],twilight);
  const alpha=night*.58+twilight*.12;
  for(let y=-h;y<h;y++)for(let x=-w;x<w;x++)p.blend(x,y,c,alpha);
},{size:[80,48],duration:8,options:{phase:-1}});

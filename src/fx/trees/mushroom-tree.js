import { CREAM, wave } from "../_kit/art.js";
import { branch, tree, trunk } from "../_kit/tree-crowns.js";

function cap(p,x,y,w,h,C) {
  p.ellipse(x,y,w,6,C[0]);
  p.ellipse(x,y,w-2,5,CREAM[1]);
  for (const dx of [-12,-8,-4,0,4,8,12].filter((d) => Math.abs(d) < w-3)) {
    p.line(x+dx,y+1,x+dx*0.48,y+4,CREAM[3]);
  }
  p.poly([[x-w,y],[x-w+3,y-8],[x-w/2,y-h+4],[x-3,y-h],
    [x+w/2,y-h+3],[x+w-3,y-7],[x+w,y],[x+w-5,y+2],[x,y],[x-w+5,y+1]],C[0]);
  p.poly([[x-w+2,y-1],[x-w+5,y-8],[x-w/2,y-h+5],[x-3,y-h+1],
    [x+w/2,y-h+4],[x+w-4,y-7],[x+w-2,y-1],[x,y-2]],C[2]);
  p.poly([[x-w+4,y-4],[x-w/2,y-h+5],[x-3,y-h+2],[x+w/3,y-h+4],
    [x+1,y-h/2],[x-w/2,y-4]],C[3]);
  for (const [dx,dy,r] of [[-0.53,-0.36,1.7],[-0.19,-0.67,2.4],[0.12,-0.34,1.8],[0.46,-0.47,1.5]]) {
    p.ellipse(x+w*dx,y+h*dy,r,r*0.68,C[4]);
  }
}

export const { meta, draw } = tree("Mushroom tree", "A giant speckled mushroom cap with a branching smaller shelf cap.",
  ["#442d43","#814457","#b95763","#dc7c77","#ffd2a3"], (p, phase, C, bark) => {
    const sway = Math.round(wave(phase));
    branch(p, [[2,-9],[10,-20],[16+sway,-25]], 7, bark);
    trunk(p,bark,{ top:-40,bend:-2,width:6 });
    cap(p,16+sway,-23,12,12,C);
    cap(p,-4+sway,-32,23,19,C);
  }, { bark: ["#574451","#8d6668","#b98c7e","#d4aa8a","#eacfb2"] });

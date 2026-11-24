import { LEAF, wave } from "../_kit/art.js";
import { tree, trunk } from "../_kit/tree-crowns.js";

export const { meta, draw } = tree("Snow-covered tree", "A layered evergreen with broad snow caps and exposed needle tips.",
  ["#456075","#6e8c9b","#9ebac5","#ccdedc","#f5f4e5"], (p, phase, C, bark) => {
    trunk(p,bark,{ top:-36,width:4 });
    const sway = Math.round(wave(phase));
    for (const [top,w] of [[-36,23],[-43,19],[-50,14],[-55,9]]) {
      const y = top + 23;
      p.poly([[sway,top],[w-4,y-10],[w,y-4],[w-5,y-5],[w-8,y],
        [2,y-3],[-4,y+1],[-9,y-2],[-w,y-1],[-w+5,y-8]],LEAF[0]);
      p.poly([[sway,top+1],[w-3,y-6],[w-8,y-4],[2,y-7],[-4,y-4],
        [-8,y-5],[-w+2,y-4],[-w+7,y-12]],C[2]);
      p.poly([[sway,top+1],[w/2,y-10],[3,y-11],[-4,y-7],[-9,y-8],[-w+4,y-6],[-w/2,y-14]],C[3]);
      p.polyline([[sway-1,top+2],[-w/2,y-13],[-w+5,y-7]],C[4]);
      p.line(1,y-4,w-7,y-2,LEAF[2]);
    }
  });

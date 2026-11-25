import { asset, GOLD, WOOD } from "../_kit/art.js";

export const { meta, draw } = asset({
  name: "Coastal boardwalk",
  desc: "A modular plank deck with grade-aligned end posts and a shaded front fascia.",
  tags: ["bridge", "deck", "coast"], size: [32, 32], origin: [16, 22], duration: 1, fps: 1,
  palette: WOOD, options: { facing: "east-west", ends: "both" },
}, (p, _t, C, o) => {
  const alongY = o.facing === "north-south";
  const x = alongY ? -6 : -8, y = alongY ? -12 : -9;
  const w = alongY ? 13 : 16, h = alongY ? 16 : 10;
  p.rect(x, y + 2, w + (alongY ? 2 : 0), h + (alongY ? 0 : 2), C[0]);
  p.rect(x, y, w, h, C[2]);
  for (let i = 0; i < 4; i++) {
    const step = i * 4;
    if (alongY) {
      p.line(x, y+step,x+w-1,y+step,C[1]);
      p.line(x+1,y+step+1,x+w-2,y+step+1,C[4]);
      p.line(x+3,y+step+2,x+5+(i%2),y+step+2,C[3]);
    } else {
      p.line(x+step,y,x+step,y+h+1,C[1]);
      p.line(x+step+1,y+1,x+step+1,y+h-2,C[3]);
      p.line(x+step+2,y+3+(i%2),x+step+2,y+5+(i%2),C[4]);
    }
  }
  if (alongY) {
    p.line(x,y,x,y+h-1,C[4]);
    p.line(x+w-1,y,x+w-1,y+h-1,C[1]);
  } else {
    p.line(x,y,x+w-1,y,C[4]);
    p.line(x,y+h,x+w-1,y+h,C[1]);
  }
  for (const [end, delta] of [["start",1],["end",14]]) {
    if (o.ends !== "both" && o.ends !== end) continue;
    for (const edge of [0,1]) {
      const px = alongY ? x-1+edge*(w+1) : x+delta;
      const py = alongY ? y+delta : y+edge*(h-1);
      p.rect(px-1,py-4,3,6,C[0]);
      p.rect(px,py-4,1,5,C[2]);
      p.px(px,py-4,GOLD[3]);
    }
  }
});

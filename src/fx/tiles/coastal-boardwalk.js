import { asset, WOOD } from "../_kit/art.js";

export const { meta, draw } = asset({
  name: "Coastal boardwalk",
  desc: "A top-down three-quarter plank deck with wide treads, recessed end posts and shallow timber fascia.",
  tags: ["bridge", "deck", "coast"], size: [32, 32], origin: [16, 22], duration: 1, fps: 1,
  palette: WOOD, options: { facing: "east-west", ends: "both" },
}, (p, _t, C, o) => {
  const alongY = o.facing === "north-south";
  const x = alongY ? -6 : -8, y = alongY ? -12 : -11;
  const w = alongY ? 13 : 16, h = alongY ? 16 : 12;
  // The narrow shadow and front fascia anchor the platform above the water.
  if (alongY) {
    p.rect(x+w, y+1, 3, h, C[0], 0.36);
    p.rect(x+w-1, y, 2, h, C[0]);
  } else {
    p.rect(x, y+h+2, w, 2, C[0], 0.4);
    p.rect(x, y+h-1, w, 3, C[0]);
  }
  p.rect(x, y, w, h, C[2]);
  for (let i = 0; i < 4; i++) {
    const step = i * 4;
    if (alongY) {
      p.line(x, y+step,x+w-1,y+step,C[1]);
      p.line(x+1,y+step+1,x+w-2,y+step+1,C[3]);
      p.line(x+3,y+step+2,x+5+(i%2),y+step+2,C[3]);
    } else {
      p.line(x+step,y+1,x+step,y+h-1,C[1]);
      p.line(x+step+1,y+1,x+step+1,y+h-3,C[3]);
      if (i%2) p.line(x+step+2,y+4,x+step+2,y+7,C[3]);
    }
  }
  if (alongY) {
    p.line(x,y,x,y+h-1,C[4]);
    p.line(x+w-1,y,x+w-1,y+h-1,C[1]);
    p.line(x+w,y+1,x+w,y+h-1,C[2]);
  } else {
    p.line(x,y,x+w-1,y,C[4]);
    p.line(x,y+h,x+w-1,y+h,C[1]);
    p.line(x+1,y+h+1,x+w-1,y+h+1,C[2]);
  }
  // Dark vertical rail faces frame the warmer treads, with a narrow lit cap.
  for (const edge of [0,1]) {
    if (alongY) {
      const rail = x-1+edge*(w+1);
      const offset = edge ? 0 : 1;
      p.line(rail,y-3+offset,rail,y+h-4+offset,C[0]);
      p.line(rail-1,y-3+offset,rail-1,y+h-4+offset,C[3]);
    } else {
      const rail = y+edge*(h-1)-4;
      p.rect(x,rail,w,3,C[0]);
      p.line(x,rail,x+w-1,rail,edge?C[3]:C[4]);
    }
  }
  for (const [end, delta] of [["start",1],["end",14]]) {
    if (o.ends !== "both" && o.ends !== end) continue;
    for (const edge of [0,1]) {
      const px = alongY ? x-1+edge*(w+1) : x+delta;
      const py = alongY ? y+delta : y+edge*(h-1);
      const top = py - (alongY ? 4 : 5);
      if(edge) p.rect(px-1,py+1,3,3,C[0]);
      p.rect(px-1,top,3,py-top+2,C[0]);
      p.line(px-1,top+1,px-1,py,C[2]);
      p.line(px-1,top,px,top,C[4]);
    }
  }
});

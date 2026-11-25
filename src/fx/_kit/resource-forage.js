import { asset, CREAM, wave } from "./art.js";
import { groundShadow } from "./sprite.js";

export function forage(name, desc, palette, paint, { moving = false, size = [32,32], origin = [16,24] } = {}) {
  return asset({ name, desc, tags: ["resource", "forage"], palette, size, origin,
    duration: moving ? 2.5 : 1, fps: moving ? 12 : 1 }, paint);
}

export function leaf(p, x, y, tipX, tipY, C) {
  const early = [(x * 2 + tipX) / 3, (y * 2 + tipY) / 3];
  const late = [(x + tipX * 2) / 3, (y + tipY * 2) / 3];
  p.poly([[x,y],[early[0]-2,early[1]-1],[late[0]-2,late[1]-1],[tipX,tipY],
    [late[0]+2,late[1]+1],[early[0]+2,early[1]+1]], C[0]);
  p.poly([[x,y],[early[0]-1,early[1]-1],[late[0]-1,late[1]-1],[tipX,tipY],
    [late[0]+1,late[1]+1]], C[2]);
  p.line(...early, ...late, C[3]);
}

export function mushrooms(name, desc, palette, clusters, spots = false) {
  return forage(name, desc, palette, (p, phase, C) => {
    const scale = 0.83;
    groundShadow(p, 0, 1, 11*scale, 2.5*scale, 0.75);
    for (const [cx,cy,width,height] of clusters) {
      const x=Math.round(cx*scale), y=Math.round(cy*scale);
      const w=Math.round(width*scale), h=Math.round(height*scale);
      const cap = y - h;
      const lean = Math.round(wave(phase, 1, x * 0.09) * 0.65);
      p.poly([[x-2,y],[x-2+lean,cap],[x+1+lean,cap],[x+1,y]], CREAM[0]);
      p.line(x-1,y-1,x-1+lean,cap,CREAM[3]);
      p.line(x,y-1,x+lean,cap,CREAM[4]);
      p.ellipse(x+lean,cap,w,2.4,C[0]);
      p.ellipse(x+lean,cap-1,w-0.5,w*0.60,C[0]);
      p.ellipse(x+lean,cap-1,w-1.4,w*0.60-1,C[2]);
      p.line(x-w+3+lean,cap-2,x+lean,cap-3,C[3]);
      p.line(x-2+lean,cap+1,x+2+lean,cap+1,CREAM[2]);
      if (spots) {
        p.px(x+lean+1,cap-3,CREAM[4]);
        p.px(x+lean-2,cap-2,CREAM[4]);
        if (w > 6) p.rect(x+lean+3,cap-2,2,1,CREAM[3]);
      }
    }
  }, { moving: true });
}

export function bone(p, x, y, dx, dy, C) {
  p.beam(x,y,x+dx,y+dy,3,C[0]);
  p.line(x,y-1,x+dx,y+dy-1,C[3]);
  p.line(x,y,x+dx,y+dy,C[2]);
  for (const [px,py] of [[x,y],[x+dx,y+dy]]) {
    p.ellipse(px,py,2.4,2,C[0]);
    p.ellipse(px-0.4,py-0.4,1.5,1.2,C[3]);
    p.px(px,py-1,C[4]);
  }
}

import { clamp, ease, fit, seg } from "../../core/index.js";
import { groundShadow } from "../_kit/sprite.js";

export const meta = {
  name: "Fence and gate",
  desc: "A one-tile split-rail fence or hinged gate. Orient east-west or north-south and set the gate opening.",
  tags: ["fence", "gate", "wood", "tile"], size: [32, 32], origin: [16, 20],
  duration: 3, fps: 16, loop: true, bg: "field",
  options: { palette: ["#422c28", "#60402e", "#825739", "#a87646", "#cc9b61"], facing: "east-west", gate: true, open: -1 },
};

function post(p, x, y, C) {
  groundShadow(p, x + 1, y, 3.4, 1.7);
  p.rect(x - 2, y - 12, 5, 13, C[0]);
  p.rect(x - 1, y - 11, 2, 11, C[3]);
  p.rect(x + 1, y - 10, 1, 10, C[1]);
  p.rect(x - 1, y - 12, 3, 1, C[4]);
  p.px(x - 1, y - 6, C[2]);
}

function rail(p, x, y, ex, ey, C) {
  p.line(x, y, ex, ey, C[4]);
  p.line(x, y + 1, ex, ey + 1, C[2]);
  p.line(x, y + 2, ex, ey + 2, C[0]);
}

export function draw(p, t, o) {
  const C = fit(o.palette, 5);
  const vertical = o.facing === "north-south";
  const [x, y, ex, ey] = vertical ? [0, -8, 0, 8] : [-8, 0, 8, 0];
  const swing = o.gate ? (o.open < 0 ? ease.inOutSine(seg(t, 0.45, 1.1)) * (1 - ease.inOutSine(seg(t, 1.74, 2.5))) : clamp(o.open)) : 0;
  const angle = swing * Math.PI * 0.5;
  const tx = vertical ? Math.round(-14 * Math.sin(angle)) : Math.round(x + 16 * Math.cos(angle));
  const ty = vertical ? Math.round(y + 16 * Math.cos(angle)) : Math.round(-8 * Math.sin(angle));
  if (vertical) post(p, x, y, C);
  rail(p, x, y - 9, tx, ty - 9, C);
  rail(p, x, y - 4, tx, ty - 4, C);
  if (o.gate) {
    p.line(x + (vertical ? 0 : 2), y - 4, tx, ty - 8, C[3]);
    p.px(tx, ty - 9, C[0]);
  }
  if (!vertical) post(p, x, y, C);
  post(p, ex, ey, C);
  if (o.gate && !vertical) p.px(ex - 2, ey - 7, C[4]);
}

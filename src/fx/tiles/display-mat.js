// A display mat: the cool dark slate a shop lays its goods on. Neutral and low in contrast, so icons of any
// material (wood, leather, copper, soil) read on it; a thin lit frame closes it where it meets the ground.
import { asset } from "../_kit/art.js";
import { rand } from "../../core/index.js";

const SLATE = ["#1b1f2a", "#262b38", "#2c3242", "#3a4256", "#5a6582"];

const base = asset({
  name: "display mat",
  desc: "A cool dark slate mat for laying out goods: neutral, low contrast, framed where it meets the ground.",
  tags: ["tile", "floor", "shop", "display"], size: [16, 16], origin: [8, 12], duration: 1, fps: 1, bg: "field",
  palette: SLATE, options: { tileX: 0, tileY: 0, edges: "", corners: [] },
}, (p, _t, C, o) => {
  const edges = o.edges ?? "", corners = o.corners ?? [], gx = (o.tileX ?? 0) * 16, gy = (o.tileY ?? 0) * 16;
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    // a faint woven grain: a lighter thread every fourth row and column, broken up
    const n = rand(gx + x, gy + y, o.seed);
    let c = (x + gx) % 4 === 0 && n > 0.45 || (y + gy) % 4 === 0 && n < 0.3 ? C[2] : C[1];
    const N = edges.includes("N") ? y : 99, S = edges.includes("S") ? 15 - y : 99;
    const W = edges.includes("W") ? x : 99, E = edges.includes("E") ? 15 - x : 99;
    const d = Math.min(N, S, W, E);
    for (const k of corners) {
      const cx = k.includes("E") ? 15 - x : x, cy = k.includes("S") ? 15 - y : y;
      if (cx < 2 && cy < 2) c = cx === 0 || cy === 0 ? C[0] : (k.includes("N") || k.includes("W") ? C[4] : C[3]);
    }
    // frame: dark edge, then a lit line on the sides facing the light (top, left) and a soft one elsewhere
    if (d === 0) c = C[0];
    else if (d === 1) c = d === N || d === W ? C[4] : C[3];
    p.px(x - 8, y - 12, c);
  }
});

export const { meta, draw } = base;

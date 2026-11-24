import { fit, rand } from "../../core/index.js";
import { draw as grass, meta as grassMeta } from "../tiles/grass.js";

const EDGES = "NESW";
const CORNERS = ["NE", "SE", "SW", "NW"];
const BANK = ["#514638", "#765a40", "#a38254", "#c6a76e"];

export const meta = {
  name: "Island shoreline",
  desc: "A 16 px grass-to-water transition with outer edges and inside corners. The water remains transparent.",
  tags: ["island", "shore", "coast", "terrain", "tile"], size: [16, 16], origin: [8, 12],
  duration: grassMeta.duration, fps: grassMeta.fps, loop: true, bg: "field",
  options: { ...grassMeta.options, edges: "ES", corners: [], bank: BANK },
};

export function draw(p, t, o) {
  const edges = o.edges.toUpperCase();
  const bank = fit(o.bank, 4);
  const corners = new Set(o.corners);
  grass({
    px(gx, gy, color) {
      const x = gx + 8, y = gy + 12;
      const distances = [y, 15 - x, 15 - y, x];
      let d = 16;
      for (let i = 0; i < EDGES.length; i++) {
        if (edges.includes(EDGES[i])) d = Math.min(d, distances[i]);
      }
      for (let i = 0; i < CORNERS.length; i++) {
        const [a, b] = CORNERS[i];
        const corner = distances[i] + distances[(i + 1) % 4];
        if (edges.includes(a) && edges.includes(b)) d = Math.min(d, corner - 2);
        if (!edges.includes(a) && !edges.includes(b) && corners.has(CORNERS[i])) d = Math.min(d, corner);
      }
      if (d < 2) return;
      if (d < 5) {
        const grit = rand(o.tileX * 16 + x, o.tileY * 16 + y, o.seed + 29);
        p.px(gx, gy, bank[d === 2 ? 0 : d === 3 ? (grit > 0.75 ? 2 : 1) : (grit > 0.8 ? 3 : 2)]);
      } else {
        p.px(gx, gy, color);
      }
    },
  }, t, o);
}

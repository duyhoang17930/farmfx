import { fit, noise2, rand } from "../../core/index.js";
import { draw as grass, meta as grassMeta } from "../tiles/grass.js";

const EDGES = "NESW";
const CORNERS = ["NE", "SE", "SW", "NW"];
const BANK = ["#514638", "#765a40", "#a38254", "#c6a76e"];
const FOAM = fit(["#d9f2ee"], 1)[0];

export const meta = {
  name: "Island shoreline",
  desc: "A 16 px grass-to-water transition with outer edges and inside corners. The water remains transparent.",
  tags: ["island", "shore", "coast", "terrain", "tile"], size: [16, 16], origin: [8, 12],
  duration: grassMeta.duration, fps: grassMeta.fps, loop: true, bg: "field",
  options: { ...grassMeta.options, edges: "ES", corners: [], bank: BANK, irregular: false },
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
      // outer corners round off (radius 11) and inside corners curve, so the coast reads as one line
      for (let i = 0; i < CORNERS.length; i++) {
        const [a, b] = CORNERS[i], da = distances[i], db = distances[(i + 1) % 4];
        if (edges.includes(a) && edges.includes(b)) d = Math.min(d, 11 - Math.hypot(Math.max(0, 11 - da), Math.max(0, 11 - db)));
        if (!edges.includes(a) && !edges.includes(b) && corners.has(CORNERS[i])) d = Math.min(d, Math.hypot(da + 0.5, db + 0.5));
      }
      if (o.irregular && d < 8) {
        const wx = o.tileX * 16 + x, wy = o.tileY * 16 + y;
        // the waterline wanders in world space (joins across tiles), with a 1 px foam line riding just outside it
        const contour = noise2(wx / 11, wy / 11, o.seed + 17) * 2.4 + noise2(wx / 4, wy / 4, o.seed + 3) * 0.7;
        const e = d - contour;
        if (e < 2) {
          if (e >= 1 && (wx + wy * 3) % 5) p.px(gx, gy, FOAM);
          return;
        }
        const shore = Math.round(e);
        const front = edges.includes("S") && distances[2] <= d + 1;
        if (shore <= (front ? 4 : 3)) {
          const lit = noise2(wx / 4, wy / 4, o.seed + 18) > 0.1;
          p.px(gx, gy, bank[shore === 2 ? front ? 0 : 1 : lit ? 3 : 2]);
        } else {
          p.px(gx, gy, color);
        }
        return;
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

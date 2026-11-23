import { crop } from "../_kit/crop.js";

function beet(b, x, y, k, F) {
  b.orb(x, y, 4.8 * k, 4.7 * k, F);
  b.leaf(x, y + 1.6 * k, x + k, y + 8 * k, 2.9 * k, F);
  b.line(x - 2 * k, y + k, x + k, y + 2 * k, F[1]);
}

export const { meta, draw } = crop({
  name: "Sugar beet",
  desc: "Broad lime-veined leaves reveal an ivory shoulder. The full tapered beet pops out of the soil.",
  tags: ["beet", "root", "sugar"], method: "dig", sparkleAt: [5, -8],
  produce: ["#554141", "#897461", "#b8a382", "#decaa2", "#f8e7bd"],
  drawPlant(b, { C, F, ripe }) {
    if (ripe > 0) b.orb(0, -1, 4.8 * ripe, 2.8 * ripe, F);
    for (const [x, y, w] of [[-8, -9, 2.4], [6, -11, 2.8], [1, -16, 3], [-4, -13, 2.6], [5, -5, 2.4]]) {
      b.leaf(0, -2 - ripe, x, y, w, C);
      b.line(0, -3 - ripe, x * 0.68, y * 0.75, C[4]);
    }
  },
  drawHarvest(b, { C, F }) {
    beet(b, 0, 0, 1, F);
    b.leaf(0, -4, -4, -9, 1.6, C);
    b.leaf(0, -4, 3, -10, 1.7, C);
  },
});

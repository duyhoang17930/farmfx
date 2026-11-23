import { crop } from "../_kit/crop.js";

function head(b, x, y, k, F) {
  b.orb(x, y, 6 * k, 5.3 * k, F);
  if (k > 0.4) {
    b.leaf(x - 4 * k, y + k, x + 3 * k, y + 3 * k, 1.7 * k, F);
    b.leaf(x + 4 * k, y - k, x - 2 * k, y - 3 * k, 1.7 * k, F);
    b.line(x - 2 * k, y - 1.5 * k, x + 0.8 * k, y + 0.5 * k, F[4]);
  }
}

export const { meta, draw } = crop({
  name: "Cabbages",
  desc: "Blue-green wrapper leaves cradle a pale cabbage head with overlapping, curled folds.",
  tags: ["cabbage", "brassica", "vegetable"], method: "cut", sparkleAt: [5, -8],
  palette: ["#253d38", "#355b4e", "#4c7963", "#679779", "#94ba88"],
  produce: ["#345447", "#547459", "#7d9d6c", "#a7bd79", "#d8db9a"],
  drawPlant(b, { C, F, ripe }) {
    for (const [x, y, w] of [[-9, -5, 3], [8, -4, 3], [5, -10, 2.9], [-6, -10, 3], [0, -12, 3.3]]) b.leaf(0, -2, x, y, w, C, x > 0);
    if (ripe > 0) head(b, 0, -4, ripe, F);
    b.leaf(-1, -2, -7, 0, 2.1, C);
    b.leaf(1, -2, 7, 0, 2.1, C, true);
  },
  drawHarvest(b, { F }) { head(b, 0, 0, 1.13, F); },
});

import { crop } from "../_kit/crop.js";

export const { meta, draw } = crop({
  name: "Cassava",
  desc: "A reddish stalk holds wide fans of finger-shaped leaves. Three tapered brown roots emerge at harvest.",
  tags: ["manioc", "root", "tuber"], method: "dig", sparkleAt: [7, -19],
  produce: ["#452a29", "#714638", "#9b6749", "#be8b61", "#e1b789"],
  wood: ["#4f2e35", "#6d413d", "#95544a", "#b87359", "#d98c61"],
  drawPlant(b, { C, W, ripe }) {
    b.stem(0, 0, 1, -23, 2.4, W);
    for (const [x, y, size] of [[-5, -12, 0.78], [5, -17, 0.83], [-2, -23, 1]]) {
      b.line(1, y + 5, x, y, W[3]);
      for (const [dx, dy] of [[-6, 1], [6, 1], [-6, -3], [6, -3], [-3, -6], [3, -6], [0, -7]]) {
        b.leaf(x, y, x + dx * size, y + dy * size, (1.15 + 0.23 * ripe) * size, C, dx > 0);
      }
      b.dot(x, y, W[3]);
    }
  },
  drawHarvest(b, { F, W }) {
    b.stem(-2, -4, 1, -7, 1.8, W);
    b.leaf(-1, -5, -7, 3, 2.2, F);
    b.leaf(-1, -5, 0, 7, 2.6, F);
    b.leaf(0, -5, 6, 4, 2.4, F, true);
  },
});

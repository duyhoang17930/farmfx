import { crop } from "../_kit/crop.js";

function apple(b, x, y, k, C, F, W) {
  b.orb(x - 0.8 * k, y, 2.8 * k, 3.1 * k, F);
  b.orb(x + 0.9 * k, y + 0.25 * k, 2.35 * k, 2.85 * k, F);
  if (k > 0.65) {
    b.dot(x - 1.65 * k, y - 1.2 * k, F[4]);
    b.line(x, y - 2.15 * k, x + 0.5, y - 4 * k, W[1]);
    b.leaf(x, y - 3 * k, x + 3.1 * k, y - 4 * k, k, C);
  }
}

export const { meta, draw } = crop({
  name: "Apples",
  desc: "A round orchard tree grows layered chartreuse foliage and three red apples with little stems.",
  tags: ["apple", "fruit", "orchard"], orchard: true, sparkleAt: [9, -24],
  palette: ["#253e27", "#3b602d", "#578840", "#77a848", "#abca69"],
  produce: ["#562736", "#8c2c36", "#c23a3a", "#e65a4b", "#ffa77c"],
  drawPlant(b, { C, F, W, ripe }) {
    b.stem(0, 0, 1, -25, 4.2, W);
    b.stem(0, -10, -9, -24, 2.7, W);
    b.stem(1, -13, 10, -23, 2.8, W);
    b.line(-1, -2, -3, 0, W[2]);
    for (const [x, y, rx, ry] of [[8, -22, 8.5, 7], [-8, -23, 8, 7], [4, -32, 9, 8], [-5, -31, 9, 8], [0, -25, 10, 8]]) {
      b.orb(x, y, rx, ry, C);
    }
    b.leaf(-7, -32, -12, -28, 1.3, C);
    b.leaf(3, -36, 7, -34, 1.5, C);
    if (ripe > 0) {
      apple(b, -9, -24, ripe * 0.79, C, F, W);
      apple(b, 2, -29, ripe * 0.84, C, F, W);
      apple(b, 8, -22, ripe, C, F, W);
    }
  },
  drawHarvest(b, { C, F, W }) { apple(b, 0, 0, 1.23, C, F, W); },
});

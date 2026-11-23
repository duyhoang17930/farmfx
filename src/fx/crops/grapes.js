import { crop } from "../_kit/crop.js";

function cluster(b, x, y, k, F) {
  const berries = [[-2.7, -2], [2.6, -2], [0, -2.7], [-1.8, 0.3], [1.6, 0.6], [0.25, 2.7]];
  for (const [dx, dy] of berries) b.orb(x + dx * k, y + dy * k, 1.9 * k, 1.8 * k, F);
}

export const { meta, draw } = crop({
  name: "Grapes",
  desc: "A trunk twists up a wide trellis under lobed leaves and dangling purple bunches.",
  tags: ["grape", "fruit", "vine"], sparkleAt: [7, -12],
  produce: ["#432943", "#5f365b", "#815079", "#a769a0", "#d19ac0"],
  drawPlant(b, { C, F, W, ripe }) {
    b.stem(-8, 0, -8, -21, 2.1, W);
    b.stem(8, 0, 8, -21, 2.1, W);
    b.stem(-9, -19, 9, -19, 2.1, W);
    b.stem(0, 0, -2, -10, 2.5, W);
    b.stem(-2, -10, 1, -19, 2.2, W);
    for (const [x, y] of [[-6, -17], [6, -17], [1, -21], [-4, -22]]) {
      b.leaf(x + 1, y + 3, x - 4, y - 2, 2.65, C);
      b.leaf(x - 1, y + 3, x + 4, y - 1, 2.45, C, x > 0);
      b.leaf(x, y + 2, x, y - 5, 2.45, C);
    }
    if (ripe > 0) {
      cluster(b, -5, -13, ripe * 0.86, F);
      cluster(b, 5, -13, ripe, F);
    }
  },
  drawHarvest(b, { C, F }) {
    cluster(b, 0, 0, 1.24, F);
    b.line(0, -3, 0, -6, C[2]);
    b.leaf(0, -5, 4, -7, 1.3, C);
  },
});

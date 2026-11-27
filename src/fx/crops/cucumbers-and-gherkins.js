import { crop } from "../_kit/crop.js";

function cuke(b, x, y, k, F) {
  b.stem(x - k, y - 3.5 * k, x + k, y + 3.5 * k, 3.5 * k, F);
  if (k > 0.62) {
    for (const j of [-2, 0, 2]) b.dot(x + j / 3 * k, y + j * k, F[4]);
    b.dot(x - k, y - 4 * k, F[3]);
  }
}

export const { meta, draw } = crop({
  name: "Cucumbers and gherkins",
  desc: "Curling tendrils climb a split trellis. Long striped cucumbers hang above two shorter, bumpy gherkins.",
  tags: ["cucumber", "gherkin", "vine", "vegetable"], sparkleAt: [6, -7],
  produce: ["#1b4239", "#2b6146", "#45864c", "#78a95a", "#c2d47b"],
  drawPlant(b, { C, F, W, ripe }) {
    b.stem(-6, 0, -5, -20, 1.7, W);
    b.stem(6, 0, 5, -20, 1.7, W);
    b.stem(-6, -15, 6, -15, 1.8, W);
    b.stem(-6, -7, 6, -7, 1.4, W);
    b.bush(0, -11, 7, 7, C, 11, 3);
    b.line(-2, 0, 3, -9, C[2]);
    b.line(3, -9, -4, -16, C[3]);
    for (const [x, y, sx] of [[-3, -16, -1], [3, -13, 1], [-2, -8, -1]]) {
      b.leaf(x, y, x + sx * 6, y - 3, 2.65, C);
      b.leaf(x, y, x + sx * 5, y + 2, 2.1, C, true);
    }
    b.line(2, -13, 6, -18, C[3]);
    b.line(6, -18, 8, -17, C[4]);
    b.dot(8, -15, C[4]);
    if (ripe > 0) {
      cuke(b, -3, -8, ripe, F);
      cuke(b, 5, -7, ripe * 0.65, F);
      cuke(b, 1, -5, ripe * 0.55, F);
    }
  },
  drawHarvest(b, { F }) { cuke(b, -2, 0, 1.25, F); cuke(b, 3, 1, 0.68, F); },
});

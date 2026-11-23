import { crop } from "../_kit/crop.js";

function ear(b, x, y, k, C, F) {
  b.orb(x, y, 2.7 * k, 5.2 * k, F);
  if (k > 0.72) {
    for (const dy of [-2, 0, 2]) {
      b.dot(x - 1, y + dy, F[4]);
      b.dot(x + 1, y + dy + 1, F[1]);
    }
  }
  b.leaf(x + 1, y + 4 * k, x + 3 * k, y - 3 * k, 1.2 * k, C);
}

export const { meta, draw } = crop({
  name: "Corn",
  desc: "A tasselled maize stalk opens ribbon leaves and fills two golden ears wrapped in green husks.",
  tags: ["maize", "grain"], produce: ["#6b391c", "#a96023", "#dc942e", "#f6c648", "#ffea83"],
  sparkleAt: [5, -16], tall: true,
  drawPlant(b, { C, F, ripe }) {
    b.stem(0, 0, 1, -29, 2.3, C);
    b.leaf(0, -6, -9, -10, 2.4, C, true);
    b.leaf(0, -10, 8, -15, 2.5, C);
    b.leaf(1, -20, -8, -23, 2.3, C);
    b.leaf(1, -23, 7, -25, 1.9, C, true);
    for (const x of [-3, 1, 5]) b.line(1, -27, x, -33, ripe > 0.35 ? F[3] : C[3]);
    if (ripe > 0) {
      ear(b, -3, -11, ripe * 0.7, C, F);
      ear(b, 3, -17, ripe, C, F);
    }
  },
  drawHarvest(b, { C, F }) { ear(b, 0, 0, 1.1, C, F); },
});

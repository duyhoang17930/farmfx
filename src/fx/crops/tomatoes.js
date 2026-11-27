import { crop } from "../_kit/crop.js";

function tomato(b, x, y, k, C, F) {
  b.orb(x, y, 3.4 * k, 2.85 * k, F);
  if (k > 0.59) {
    b.line(x - k, y - 2 * k, x + k, y - 2 * k, C[1]);
    b.dot(x, y - 3 * k, C[3]);
  }
}

export const { meta, draw } = crop({
  name: "Tomatoes",
  desc: "A staked vine grows jagged leaves and clusters of glossy, red tomatoes with green stars.",
  tags: ["tomato", "fruit", "vine"], sparkleAt: [6, -8],
  produce: ["#542532", "#962b37", "#c43c34", "#e85a3d", "#ffa471"],
  drawPlant(b, { C, F, W, ripe }) {
    b.bush(0, -12, 8, 8, C, 12, 2);
    b.stem(2, 0, 2, -22, 2.1, W);
    b.stem(0, 0, -2, -18, 1.6, C);
    b.line(-2, -11, 3, -12, W[4]);
    for (const [x, y] of [[-7, -8], [8, -15], [-8, -17], [4, -20], [7, -10]]) {
      b.leaf(0, y + 3, x, y, 2.3, C, x > 0);
      b.leaf(x * 0.52, y + 0.8, x * 0.85, y - 2.5, 1.2, C);
    }
    if (ripe > 0) {
      tomato(b, -5, -7, ripe * 1.1, C, F);
      tomato(b, 4, -9, ripe, C, F);
      tomato(b, 0, -14, ripe * 0.85, C, F);
      tomato(b, -3, -17, ripe * 0.7, C, F);
      tomato(b, 6, -16, ripe * 0.75, C, F);
    }
  },
  drawHarvest(b, { C, F }) { tomato(b, 0, 0, 1.24, C, F); },
});

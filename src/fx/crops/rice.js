import { crop } from "../_kit/crop.js";

export const { meta, draw } = crop({
  name: "Rice",
  desc: "A blue-green paddy tuft with slender blades and drooping sprays of pale, spaced grains.",
  tags: ["paddy", "grain"], method: "cut", sparkleAt: [6, -18],
  palette: ["#17332b", "#244d3a", "#3a734e", "#64975e", "#b4cc71"],
  produce: ["#575026", "#8b7837", "#b9a14d", "#dcbe69", "#f4dd91"],
  drawPlant(b, { C, F, ripe, W }) {
    b.orb(0, -2, 7.4, 3.15, W);
    b.line(-6, -1, -3, -1, W[4]);
    b.line(3, -3, 6, -3, W[3]);
    for (const [x, y] of [[-8, -9], [6, -9], [-6, -16], [4, -17], [0, -18]]) {
      b.leaf(0, 0, x, y, 1.15, C, x > 0);
    }
    for (const [x, y, dir] of [[-3, -20, -1], [3, -22, 1], [0, -16, 1]]) {
      b.line(0, -2, x, y, C[3]);
      b.line(x, y, x + 5 * dir, y + 4 * ripe, ripe > 0.32 ? F[2] : C[2]);
      for (let j = 1; j <= Math.ceil(3 * ripe); j++) {
        b.orb(x + j * 1.55 * dir, y + j * 1.45, 0.85, 1.15, F);
      }
    }
  },
  wood: ["#253632", "#37544b", "#4e7567", "#7a9b82", "#9cb796"],
  drawHarvest(b, { F }) {
    for (const [x, y] of [[2, -2], [-2, -1], [0, 1], [3, 2], [-3, 2]]) b.orb(x, y, 1.5, 1, F);
  },
});

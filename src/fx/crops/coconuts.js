import { crop } from "../_kit/crop.js";

function coconut(b, x, y, k, F) {
  b.orb(x, y, 4.3 * k, 3.9 * k, F);
  if (k > 0.72) {
    b.line(x + 2 * k, y - 2 * k, x - k, y + 2 * k, F[1]);
    b.dot(x - 1.75 * k, y - 1.1 * k, F[0]);
    b.dot(x - 0.4 * k, y - 1.55 * k, F[0]);
  }
}

export const { meta, draw } = crop({
  name: "Coconuts",
  desc: "A bent, ringed palm carries long drooping pinnae and a cluster of large, fibrous coconuts.",
  tags: ["coconut", "fruit", "palm", "orchard"], orchard: true, sparkleAt: [9, -27],
  palette: ["#203d34", "#2a5942", "#397d55", "#69a465", "#a9c977"],
  produce: ["#473229", "#704e35", "#9a6d45", "#bf8e56", "#e0b675"],
  drawPlant(b, { C, F, W, ripe }) {
    b.stem(-3, 0, -2, -12, 4.7, W);
    b.stem(-2, -12, 1, -24, 3.8, W);
    b.stem(1, -24, 5, -36, 3.1, W);
    for (const [x, y] of [[-3, -4], [-2, -9], [-1, -14], [0, -19], [2, -24], [4, -30]]) b.line(x - 1.5, y - 0.6, x + 1.5, y + 0.6, W[1]);
    for (const [x, y, dir] of [[-14, -31, -1], [19, -27, 1], [-9, -40, -1], [15, -41, 1], [-9, -23, -1], [12, -22, 1]]) {
      const elbow = 5 + (x - 5) * 0.6;
      b.line(5, -36, elbow, (y - 42) * 0.5, C[3]);
      b.line(elbow, (y - 42) * 0.5, x, y, C[3]);
      for (const u of [0.36, 0.54, 0.74, 0.9]) {
        const fx = 5 + (x - 5) * u, fy = -36 + (y + 36) * u - 4 * Math.sin(u * Math.PI);
        b.leaf(fx, fy, fx - dir * 0.8, fy + 6 * (1 - u) + 2, 1.6, C, dir > 0);
        b.leaf(fx, fy, fx + dir * 3, fy - 3.5 * (1 - u), 1.06, C, true);
      }
    }
    if (ripe > 0) {
      coconut(b, 2, -32, ripe * 0.74, F);
      coconut(b, 7, -30, ripe, F);
    }
  },
  drawHarvest(b, { F }) { coconut(b, 0, 0, 1.2, F); },
});

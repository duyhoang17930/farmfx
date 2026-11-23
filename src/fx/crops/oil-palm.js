import { crop } from "../_kit/crop.js";

function bunch(b, x, y, k, F) {
  b.orb(x, y, 4 * k, 3.5 * k, F);
  if (k > 0.65) {
    for (const [dx, dy] of [[-2, -1], [1, -2], [-1, 1], [2, 1]]) b.orb(x + dx, y + dy, 1.25, 1.3, F);
  }
}

export const { meta, draw } = crop({
  name: "Oil palm",
  desc: "A squat palm with a crosshatched trunk, feathery fronds and dense bunches of red-orange fruit.",
  tags: ["palm", "fruit", "orchard"], orchard: true, sparkleAt: [6, -22],
  produce: ["#4c2031", "#7a2731", "#aa3f32", "#df6638", "#fca450"],
  drawPlant(b, { C, F, W, ripe }) {
    b.stem(0, 0, 0, -29, 4.6, W);
    for (let y = -4; y >= -25; y -= 4) b.line(-2, y - 1, 1, y, W[1]);
    for (const [x, y] of [[-14, -24], [14, -24], [-8, -35], [9, -34], [-12, -17], [10, -18]]) {
      b.leaf(0, -29, x, y, 2.8, C, x > 0);
      for (const u of [0.47, 0.67, 0.83]) b.leaf(x * u, -29 + (y + 29) * u, x * u + Math.sign(x) * 2, -25 + (y + 29) * u, 0.95, C, x > 0);
    }
    if (ripe > 0) {
      bunch(b, -4, -25, ripe * 0.81, F);
      bunch(b, 4, -23, ripe, F);
    }
  },
  drawHarvest(b, { F }) { bunch(b, 0, 0, 1.08, F); },
});

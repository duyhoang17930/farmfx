import { crop } from "../_kit/crop.js";

function orange(b, x, y, k, C, F) {
  b.orb(x, y, 3.65 * k, 3.55 * k, F);
  if (k > 0.62) {
    b.dot(x + 1.5 * k, y + 1.25 * k, F[1]);
    b.dot(x - 1 * k, y + 1.7 * k, F[2]);
    b.leaf(x, y - 2.6 * k, x + 3.8 * k, y - 4 * k, 1.25 * k, C);
  }
}

export const { meta, draw } = crop({
  name: "Oranges",
  desc: "A glossy citrus tree with a forked trunk and a cascade of dimpled orange fruit.",
  tags: ["orange", "citrus", "fruit", "orchard"], orchard: true, sparkleAt: [8, -19],
  palette: ["#233a31", "#30543b", "#407745", "#609851", "#9aba65"],
  produce: ["#6e3529", "#a24d29", "#dc762c", "#f19d38", "#ffd47b"],
  wood: ["#423235", "#63473a", "#845c41", "#a87a57", "#c99971"],
  drawPlant(b, { C, F, W, ripe }) {
    b.stem(0, 0, -1, -20, 4.5, W);
    b.stem(-1, -7, -9, -19, 2.7, W);
    b.stem(0, -10, 11, -23, 2.7, W);
    for (const [x, y, rx, ry] of [[-10, -22, 7, 8], [9, -21, 8, 7], [10, -28, 6, 7], [-1, -33, 8, 7], [-6, -27, 9, 9], [1, -23, 9, 8]]) b.orb(x, y, rx, ry, C);
    for (const [x, y, dx, dy] of [[-8, -32, -5, 1], [3, -33, 5, 2], [11, -26, 5, -2], [-9, -21, -5, 0], [2, -27, 5, 0]]) b.leaf(x, y, x + dx, y + dy, 1.75, C);
    if (ripe > 0) {
      for (const [x, y, k] of [[-11, -21, 0.67], [6, -30, 0.73], [-3, -25, 0.67], [8, -19, 1], [0, -17, 0.77]]) orange(b, x, y, ripe * k, C, F);
    }
  },
  drawHarvest(b, { C, F }) { orange(b, 0, 0, 1.3, C, F); },
});

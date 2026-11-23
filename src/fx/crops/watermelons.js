import { crop } from "../_kit/crop.js";

function melon(b, x, y, k, F) {
  b.orb(x, y, 5.9 * k, 4.65 * k, F);
  if (k > 0.47) {
    for (const s of [-2.4, 1, 3.9]) {
      b.line(x + s * k, y - 3 * k, x + (s - 1.1) * k, y, F[4]);
      b.line(x + (s - 1.1) * k, y, x + (s + 0.45) * k, y + 3 * k, F[1]);
    }
  }
}

export const { meta, draw } = crop({
  name: "Watermelons",
  desc: "A low, spreading vine curls around a broad, dark green melon with winding lime stripes.",
  tags: ["watermelon", "fruit", "vine"], sparkleAt: [5, -6],
  palette: ["#213b27", "#365a34", "#4a7b41", "#75a04e", "#aecc65"],
  produce: ["#163b32", "#285d3d", "#397d42", "#63a94b", "#b0d55a"],
  drawPlant(b, { C, F, ripe }) {
    b.line(0, 0, -5, -4, C[2]);
    b.line(-5, -4, -9, -2, C[3]);
    b.line(0, -2, 8, -6, C[2]);
    b.line(8, -6, 9, -9, C[4]);
    for (const [x, y, dx, dy] of [[-6, -3, -4, -5], [1, -4, -1, -7], [7, -7, 3, -5], [-1, -1, -4, 3]]) {
      b.leaf(x, y, x + dx, y + dy, 2.5, C);
      b.leaf(x, y, x - dx * 0.4, y + dy + 1, 1.6, C, true);
    }
    if (ripe > 0) melon(b, 3, -3 - ripe, ripe, F);
  },
  drawHarvest(b, { F }) { melon(b, 0, 0, 1.07, F); },
});

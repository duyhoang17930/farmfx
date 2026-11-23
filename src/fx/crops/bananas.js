import { crop } from "../_kit/crop.js";

function hand(b, x, y, k, F) {
  for (const [dx, dy] of [[-2, -1], [0, 0], [2, 1]]) {
    const cx = x + dx * k, cy = y + dy * k;
    b.stem(cx - 2 * k, cy - 3 * k, cx, cy + k, 2.7 * k, F);
    b.stem(cx, cy + k, cx + 3 * k, cy, 2.5 * k, F);
    b.dot(cx + 3 * k, cy, F[0]);
  }
}

export const { meta, draw } = crop({
  name: "Bananas",
  desc: "Broad split blades rise over a soft green stem. Curved yellow bananas fill out below the crown.",
  tags: ["banana", "fruit", "tropical"], tall: true, sparkleAt: [6, -14],
  palette: ["#21412b", "#365a2b", "#538137", "#79a845", "#b4ce54"],
  produce: ["#63532d", "#8d722a", "#c8a336", "#f0ca48", "#ffeb85"],
  drawPlant(b, { C, F, ripe }) {
    b.stem(0, 0, -1, -26, 4.5, C);
    for (const [x, y, ey] of [[-12, -25, -24], [11, -21, -19], [9, -29, -26], [-10, -33, -28], [2, -35, -32]]) {
      b.leaf(-1, -23, x, y, 4, C, x > 0);
      b.line(x * 0.7, y * 0.75 - 6, x * 0.77, ey, C[1]);
    }
    if (ripe > 0) {
      b.line(0, -23, 2, -17, C[1]);
      hand(b, 3, -16, ripe, F);
    }
  },
  drawHarvest(b, { F }) { hand(b, 0, 0, 1.15, F); },
});

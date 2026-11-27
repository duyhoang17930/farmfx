import { crop } from "../_kit/crop.js";

function pod(b, x, y, k, F) {
  b.orb(x, y, 1.7 * k, 3.9 * k, F);
  if (k < 0.7) return;
  for (const j of [-2, 0, 2]) b.dot(x - 0.5, y + j, F[4]);
  b.line(x + 1, y - 1, x + 1, y + 2, F[1]);
}

export const { meta, draw } = crop({
  name: "Soybeans",
  desc: "An upright bush with three-part leaves and hanging pods, each with a row of swelling beans.",
  tags: ["legume", "soy"], sparkleAt: [5, -7],
  produce: ["#514725", "#7b682f", "#9f893c", "#c4ac57", "#ead489"],
  drawPlant(b, { C, F, ripe }) {
    b.bush(0, -9, 8, 7, C, 12, 4);
    b.stem(0, 0, 0, -17, 1.8, C);
    for (const [x, y, dir] of [[4, -10, 1], [-4, -8, -1], [-2, -15, -1], [2, -17, 1]]) {
      b.line(0, y + 4, x, y, C[2]);
      b.leaf(x, y, x + 5 * dir, y - 1, 2.2, C, dir > 0);
      b.leaf(x, y, x + dir, y - 5, 2.1, C);
      b.leaf(x, y, x - 3 * dir, y - 2, 1.6, C, true);
    }
    if (ripe > 0) {
      pod(b, -4, -6, ripe * 0.85, F);
      pod(b, 4, -7, ripe, F);
      pod(b, 1, -11, ripe * 0.74, F);
      pod(b, -6, -11, ripe * 0.8, F);
      pod(b, 6, -13, ripe * 0.7, F);
    }
  },
  drawHarvest(b, { F }) { pod(b, -2, 0, 1, F); pod(b, 2, -2, 1, F); },
});

import { crop } from "../_kit/crop.js";

function panicle(b, x, y, F) {
  b.orb(x, y, 3.3, 5.2, F);
  for (const [dx, dy] of [[-2, -2], [0, -4], [2, -1], [-1, 0], [1, 2], [-1, 3]]) {
    b.orb(x + dx, y + dy, 1.12, 1.24, F);
    b.dot(x + dx - 0.45, y + dy - 0.5, F[3 + Number(dx <= 0)]);
  }
}

export const { meta, draw } = crop({
  name: "Sorghum",
  desc: "Two thick canes with waxy blades bear dense, upright clusters of copper-red grain.",
  tags: ["grain", "cereal"], method: "cut", tall: true, sparkleAt: [5, -26],
  produce: ["#572a34", "#813740", "#b45549", "#dc7b5d", "#f9a578"],
  palette: ["#2b4131", "#455f39", "#62814c", "#87a561", "#b9c879"],
  drawPlant(b, { C, F, ripe }) {
    for (const [x, y, root] of [[-5, -22, -2], [3, -30, 2]]) {
      b.stem(root, 0, x, y, 2.35, C);
      b.leaf(root, -7, x - 4, -13, 1.9, C);
      b.leaf(x, y + 9, x + 7, y + 5, 1.9, C, true);
      b.leaf(x, y + 4, x - 5, y - 1, 1.6, C);
      panicle(b, x, y, ripe > 0.42 ? F : C);
    }
  },
  drawHarvest(b, { F }) {
    b.line(0, 7, 1, 0, F[2]);
    b.line(1, 6, -3, 1, F[2]);
    panicle(b, -3, -1, F);
    panicle(b, 2, -3, F);
  },
});

import { crop } from "../_kit/crop.js";

const stalk = ["#342637", "#63434c", "#936865", "#bd9378", "#dfbd8c"];

function cane(b, x, y, h, bend, F) {
  b.stem(x, y, x + bend, y - h, 2.4, F);
  for (let j = 5; j < h; j += 5) {
    const at = x + bend * j / h;
    b.line(at - 1, y - j, at + 1, y - j, F[0]);
    b.dot(at - 1, y - j - 1, F[4]);
  }
}

export const { meta, draw } = crop({
  name: "Sugarcane",
  desc: "Three jointed violet cane stalks with long, arching blades. Harvest lifts a bundle of cut cane.",
  tags: ["sugar", "grass"], produce: stalk, tall: true, method: "cut", sparkleAt: [4, -28],
  drawPlant(b, { C, F, ripe }) {
    for (const [x, h, bend] of [[3, 23, 2], [-3, 25, -2], [0, 31, 1]]) {
      cane(b, x, 0, h, bend, ripe > 0.35 ? F : C);
      b.leaf(x + bend, -h + 3, x + bend - 7, -h - 3, 1.6, C);
      b.leaf(x + bend, -h + 2, x + bend + 6, -h + 6, 1.5, C, true);
      b.leaf(x, -h * 0.5, x - 5, -h * 0.5 + 1, 1.6, C);
    }
  },
  drawHarvest(b, { F }) {
    cane(b, -5, 5, 12, 7, F);
    cane(b, -1, 7, 14, 6, F);
    cane(b, -3, 5, 15, 7, F);
    b.line(-3, 0, 3, 0, F[4]);
  },
});

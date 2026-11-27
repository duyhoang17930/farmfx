import { ramp } from "../../core/index.js";
import { crop } from "../_kit/crop.js";

const BLOOM = ramp(["#665865", "#9b849b", "#cebad4", "#f6dedf", "#fff2dc"]);

function spud(b, x, y, s, F) {
  b.orb(x, y, 4.1 * s, 2.8 * s, F);
  if (s > 0.7) {
    b.dot(x - 2 * s, y, F[1]);
    b.dot(x + s, y - s, F[1]);
    b.dot(x + 2 * s, y + s, F[1]);
  }
}

export const { meta, draw } = crop({
  name: "Potatoes",
  desc: "Low, ruffled leaves and white flowers hide a cluster of speckled golden potatoes.",
  tags: ["tuber", "vegetable"], method: "dig", sparkleAt: [7, -9],
  produce: ["#4a3328", "#845739", "#ae7641", "#cf9a57", "#efd18a"],
  drawPlant(b, { C, F, ripe }) {
    b.bush(0, -8, 9, 6.5, C, 13, 10);
    for (const [x, y] of [[-8, -8], [7, -9], [-5, -13], [3, -15], [1, -9]]) {
      b.stem(0, 0, x * 0.65, y + 2, 1.5, C);
      b.leaf(x * 0.65, y + 2, x, y, 2.9, C, x > 0);
      b.leaf(x * 0.63, y + 3, x - 3, y + 4, 1.9, C);
    }
    if (ripe > 0.27) {
      for (const [x, y] of [[-5, -12], [3, -13], [5, -10]]) {
        b.orb(x, y, 1.3, 1.2, BLOOM);
        b.dot(x, y, F[4]);
      }
    }
  },
  drawHarvest(b, { F }) {
    spud(b, -3, -2, 0.8, F);
    spud(b, 4, -1, 0.7, F);
    spud(b, 0, 2, 1, F);
  },
});

import { ramp } from "../../core/index.js";
import { crop } from "../_kit/crop.js";

const SEED = ramp(["#382c31", "#523938", "#6e4937", "#8f6747", "#b58f64"]);

function flower(b, x, y, F) {
  b.dot(x - 1, y, F[3]);
  b.dot(x, y - 1, F[4]);
  b.dot(x + 1, y, F[3]);
  b.dot(x, y + 1, F[2]);
  b.dot(x, y, F[1]);
}

export const { meta, draw } = crop({
  name: "Rapeseed",
  desc: "An open spray of butter-yellow flowers gives way to a handful of dark canola seeds.",
  tags: ["canola", "oilseed", "flower"], method: "cut", sparkleAt: [7, -21],
  produce: ["#624721", "#8e5923", "#c19023", "#efd342", "#fff18b"],
  drawPlant(b, { C, F, ripe }) {
    b.stem(0, 0, 0, -22, 1.5, C);
    for (const [x, y] of [[-7, -19], [-4, -24], [0, -27], [4, -24], [7, -20], [3, -17]]) {
      b.line(0, y + 7, x, y, C[3]);
      if (ripe > 0.16) flower(b, x, y, ripe > 0.48 ? F : C);
      else b.dot(x, y, C[4]);
    }
    for (const [x, y] of [[-7, -6], [6, -7], [-3, -12], [4, -14]]) b.leaf(0, y + 4, x, y, 1.75, C);
  },
  drawHarvest(b, { C, F }) {
    b.leaf(-5, 2, 5, -3, 2.25, C);
    b.line(-4, 1, 3, -1, F[2]);
    for (const [x, y] of [[-3, -2], [0, -4], [0, 3], [3, 1]]) b.orb(x, y, 1.55, 1.3, SEED);
  },
});

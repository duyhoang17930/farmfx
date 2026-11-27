import { ramp } from "../../core/index.js";
import { crop } from "../_kit/crop.js";

const BLOOM = ramp(["#633354", "#8e4e77", "#bc77a1", "#d99eb9", "#f3ccdc"]);

function sweetPotato(b, x, y, k, F) {
  b.leaf(x - 5 * k, y + 2 * k, x + 5 * k, y - 2 * k, 3.6 * k, F);
  b.orb(x, y, 3.3 * k, 2.45 * k, F);
  b.dot(x + k, y + k, F[1]);
  b.dot(x - 2 * k, y - 0.2, F[4]);
}

export const { meta, draw } = crop({
  name: "Sweet potatoes",
  desc: "Purple-stemmed runners spread lobed leaves along the soil. Two rose-colored tubers spring up.",
  tags: ["sweet potato", "tuber", "vine"], method: "dig", sparkleAt: [6, -9],
  wood: ["#3c2d44", "#643653", "#895064", "#a66a72", "#c98288"],
  produce: ["#552d49", "#7d405b", "#ab5270", "#ce6a7e", "#eea090"],
  drawPlant(b, { C, W, ripe }) {
    b.bush(0, -5, 10, 5.5, C, 13, 6);
    for (const [x, y, dir, n] of [[-8, -4, -1, 0.9], [8, -6, 1, 0.92], [1, -11, 1, 1], [-4, -8, -1, 0.8]]) {
      b.line(0, -1, x, y, W[3]);
      b.leaf(x, y, x + dir * 3.8 * n, y - 3 * n, 1.7 * n, C);
      b.leaf(x, y, x - dir * 2.8 * n, y - 4 * n, 1.8 * n, C, true);
      b.leaf(x, y, x + dir * 0.8 * n, y - 6.6 * n, 2 * n, C);
    }
    if (ripe > 0.2) {
      b.orb(4, -12, ripe * 2.2, ripe * 1.8, BLOOM);
      b.orb(-6, -8, ripe * 1.5, ripe * 1.2, BLOOM);
    }
  },
  drawHarvest(b, { F }) {
    sweetPotato(b, -2, -3, 0.8, F);
    sweetPotato(b, 1, 2, 1.15, F);
  },
});

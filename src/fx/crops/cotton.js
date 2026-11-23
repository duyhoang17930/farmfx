import { ramp } from "../../core/index.js";
import { crop } from "../_kit/crop.js";

const BRACT = ramp(["#402e32", "#604338", "#80513a", "#ab7546", "#c9945b"]);

function boll(b, x, y, k, F) {
  b.leaf(x, y + 3.5 * k, x - 3.1 * k, y, 1.3 * k, BRACT);
  b.leaf(x, y + 3.5 * k, x + 3.1 * k, y, 1.3 * k, BRACT);
  b.orb(x + k, y - k, 2.25 * k, 2.6 * k, F);
  b.orb(x - 1.4 * k, y - 0.35 * k, 2.4 * k, 2.15 * k, F);
  b.orb(x + 0.3 * k, y + 0.95 * k, 2 * k, 1.7 * k, F);
}

export const { meta, draw } = crop({
  name: "Cotton",
  desc: "Rust-colored branching stems carry split leaves and fluffy white seed-cotton bolls.",
  tags: ["fiber", "boll"], sparkleAt: [7, -14],
  produce: ["#5b4955", "#8d7b86", "#c8b5ba", "#ece0d4", "#fff4de"],
  drawPlant(b, { C, F, W, ripe }) {
    b.stem(0, 0, -1, -23, 2, W);
    for (const [x, y, dir] of [[-6, -13, -1], [6, -16, 1], [-1, -23, -1]]) {
      b.stem(0, y + 6, x, y, 1.3, W);
      b.leaf(x * 0.6, y + 3, x + 4 * dir, y + 4, 1.8, C);
      b.leaf(x * 0.6, y + 3, x + 2 * dir, y + 1, 2.1, C);
      if (ripe > 0.05) boll(b, x, y - 1, ripe, F);
    }
  },
  drawHarvest(b, { F }) { boll(b, -2, 0, 1.1, F); boll(b, 3, -1, 0.72, F); },
});

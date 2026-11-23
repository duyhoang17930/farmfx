import { ramp } from "../../core/index.js";
import { crop } from "../_kit/crop.js";

const SHALLOT = ramp(["#512c39", "#813b4a", "#af5961", "#d77f76", "#f3afa1"]);

function bulb(b, x, y, rx, ry, F) {
  b.orb(x, y, rx, ry, F);
  if (rx > 1.6) {
    b.line(x + rx * 0.3, y - ry * 0.56, x + rx * 0.54, y + ry * 0.4, F[1]);
    b.line(x, y + ry, x - 1, y + ry + 1, F[0]);
  }
}

export const { meta, draw } = crop({
  name: "Onions and shallots",
  desc: "Hollow blue-green shoots rise from a golden onion beside two smaller copper-pink shallots.",
  tags: ["onion", "shallot", "bulb"], method: "dig", sparkleAt: [4, -5],
  palette: ["#224138", "#37614d", "#4f8b68", "#71aa76", "#9dcc90"],
  produce: ["#583c33", "#876046", "#bf8850", "#e1ac62", "#f9d691"],
  drawPlant(b, { C, F, ripe }) {
    for (const [x, y, ex, ey] of [[-4, -2, -8, -14], [-4, -2, -3, -16], [4, -3, 7, -17], [1, -2, -1, -21], [1, -2, 5, -20]]) {
      b.leaf(x, y, ex, ey, 1.2, C);
    }
    if (ripe > 0) {
      b.orb(-4.4, -2, 2.25 * ripe, 2.4 * ripe, SHALLOT);
      b.orb(-6, -1, 1.5 * ripe, 1.8 * ripe, SHALLOT);
      b.orb(2, -2, 4 * ripe, 3.3 * ripe, F);
    }
  },
  drawHarvest(b, { F }) {
    bulb(b, -4.7, 1, 2.2, 2.9, SHALLOT);
    bulb(b, -3, -2, 2.1, 3.1, SHALLOT);
    bulb(b, 2, 1, 4.5, 4.7, F);
    b.line(1, -4, 2, -6, F[2]);
  },
});

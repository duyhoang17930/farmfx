import { crop } from "../_kit/crop.js";

function spike(b, x, y, F) {
  b.line(x, y + 3, x, y - 6, F[4]);
  for (const j of [-3, -1, 1]) {
    b.orb(x - 1, y + j - 1, 1.15, 1.45, F);
    b.orb(x + 1, y + j, 1.1, 1.5, F);
  }
  b.dot(x - 1, y - 6, F[4]);
}

export const { meta, draw } = crop({
  name: "Wheat",
  desc: "An upright golden stand with broad grain ears and fine awns. A small sheaf hops out at harvest.",
  tags: ["grain", "cereal"], method: "cut", sparkleAt: [4, -24],
  sproutLeaves: [[-2, -1], [2, -2], [0, -4]],
  produce: ["#604223", "#8b602c", "#bd8c38", "#e5b952", "#ffe285"],
  drawPlant(b, { C, F, ripe }) {
    for (const [x, y, foot] of [[-5, -15, -2], [5, -18, 2], [0, -22, 0], [-2, -13, 1]]) {
      const ramp = ripe > 0.58 ? F : C;
      b.stem(foot, 0, x, y + 2, 1.2, ramp);
      b.leaf(foot, -4, x + (x > 0 ? 4 : -4), -10, 1.1, ramp, x > 0);
      spike(b, x, y, ramp);
    }
  },
  drawHarvest(b, { F }) {
    for (const [x, y] of [[-3, -4], [1, -6], [4, -3]]) {
      b.line(0, 7, x, y, F[2]);
      spike(b, x, y, F);
    }
    b.line(-2, 3, 2, 3, F[4]);
  },
});

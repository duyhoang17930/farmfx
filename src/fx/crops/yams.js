import { crop } from "../_kit/crop.js";

function tuber(b, x, y, F) {
  b.stem(x + 3, y - 5, x - 1, y - 1, 5.6, F);
  b.stem(x - 1, y - 1, x - 4, y + 5, 5.2, F);
  b.orb(x - 4, y + 5, 2.6, 2.25, F);
  b.line(x + 2, y - 2, x + 1, y, F[1]);
  b.line(x - 4, y + 1, x - 2, y + 2, F[1]);
}

export const { meta, draw } = crop({
  name: "Yams",
  desc: "A climbing vine curls up a tall stake with pointed heart leaves. A knobbly brown yam is dug up.",
  tags: ["yam", "vine", "tuber"], method: "dig", sparkleAt: [7, -14],
  produce: ["#46302d", "#724837", "#966146", "#b78157", "#d7a87a"],
  drawPlant(b, { C, W, ripe }) {
    b.bush(0, -8, 7, 6, C, 9, 5);
    b.stem(2, 0, 2, -25, 2.1, W);
    b.line(2, -3, -4, -8, C[2]);
    b.line(-4, -8, 4, -13, C[3]);
    b.line(4, -13, -2, -18, C[3]);
    b.line(-2, -18, 3, -23, C[4]);
    for (const [x, y, dir] of [[-3, -8, -1], [4, -13, 1], [-2, -18, -1], [3, -23, 1]]) {
      b.leaf(x - dir, y - 2, x + dir * (5 + ripe), y + 2, 2.95, C);
      b.leaf(x - dir, y + 1, x + dir * (5 + ripe), y + 2, 2.6, C, true);
    }
    if (ripe > 0.7) b.line(-1, -20, -5, -24, C[4]);
  },
  drawHarvest(b, { F }) { tuber(b, 0, 0, F); },
});

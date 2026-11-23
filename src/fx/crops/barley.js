import { crop } from "../_kit/crop.js";

function head(b, x, y, dir, F) {
  b.leaf(x, y + 4, x + dir * 2, y - 4, 1.85, F);
  for (const j of [-2, 0, 2]) {
    b.line(x, y + j, x - 2 + dir, y + j - 7, F[3]);
    b.line(x + dir, y + j, x + 2 + dir, y + j - 8, F[4]);
  }
}

export const { meta, draw } = crop({
  name: "Barley",
  desc: "Slim, angled barley heads carry long whiskered awns above a loose fan of blades.",
  tags: ["grain", "cereal"], method: "cut", sparkleAt: [6, -23],
  palette: ["#2c3b2d", "#405635", "#63804a", "#88a552", "#bfc876"],
  produce: ["#5f4a32", "#82653e", "#ab884d", "#caab60", "#f1d48b"],
  drawPlant(b, { C, F, ripe }) {
    const R = ripe > 0.48 ? F : C;
    for (const [x, y, dir] of [[-6, -16, -1], [4, -21, 1], [-1, -17, 1]]) {
      b.stem(x * 0.22, 0, x, y + 4, 1.35, R);
      b.leaf(x * 0.2, -3, x + dir * 3, -11, 1.3, C, x > 0);
      head(b, x, y, dir, R);
    }
  },
  drawHarvest(b, { F }) {
    b.line(0, 7, -3, -1, F[2]);
    b.line(0, 7, 3, -2, F[2]);
    head(b, -3, -1, -1, F);
    head(b, 3, -2, 1, F);
    b.line(-2, 4, 2, 4, F[4]);
  },
});

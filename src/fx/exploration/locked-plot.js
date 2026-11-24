import { asset, CREAM, GOLD, WOOD, post } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = asset({
  name: "Locked plot marker",
  desc: "A wooden parcel sign with a brass padlock and a configurable coin price.",
  tags: ["plot", "land", "lock", "price"], size: [64, 48], origin: [32, 36],
  duration: 1, fps: 1, palette: WOOD, options: { price: 50 },
}, (p, _phase, C, o) => {
  const price = String(Math.trunc(Number(o.price)));
  const label = /^\d{1,8}$/.test(price) ? price : "---";
  const half = Math.max(13, 8 + label.length * 2);
  groundShadow(p, 0, 0, 9, 2.4);
  post(p, -7, 0, 21, C);
  post(p, 7, 0, 21, C);
  p.poly([[-half, -10], [-half, -23], [-half + 2, -25], [half - 2, -25],
    [half, -23], [half, -10], [half - 2, -8], [-half + 2, -8]], C[0]);
  p.rect(-half + 1, -23, half * 2 - 1, 13, C[2]);
  p.line(-half + 2, -24, half - 2, -24, C[4]);
  p.rect(-half + 3, -20, half * 2 - 5, 8, C[1]);
  p.px(-half + 2, -22, CREAM[3]);
  p.px(half - 2, -22, CREAM[3]);
  const start = -Math.floor((7 + 4 * label.length) / 2);
  p.ellipse(start + 2, -16, 2.5, 3, GOLD[1]);
  p.ellipse(start + 2, -16, 1.5, 2, GOLD[3]);
  p.px(start + 2, -17, GOLD[4]);
  p.text(label, start + 7, -18, CREAM[4], { font: "mini" });

  p.polyline([[-3, -27], [-3, -30], [-1, -32], [1, -32], [3, -30], [3, -27]], GOLD[0]);
  p.polyline([[-2, -27], [-2, -30], [-1, -31], [1, -31], [2, -30], [2, -27]], GOLD[4]);
  p.rect(-4, -28, 9, 7, GOLD[0]);
  p.rect(-3, -27, 7, 5, GOLD[3]);
  p.line(-2, -27, 2, -27, GOLD[4]);
  p.line(0, -25, 0, -23, GOLD[0]);
});

import { clamp, ease, fit, hex, seg } from "../../core/index.js";
import { groundShadow } from "../_kit/sprite.js";

const PAINT = ["#59392e", "#80553a", "#b0794a", "#d49c60", "#f0bb76"].map(hex);
const DARK = hex("#342b2e");
const STRAW = hex("#dab86e");

export const meta = {
  name: "Chicken coop",
  desc: "A raised cedar coop with a teal shingle roof, screened window and a hatch that lowers into a ramp.",
  tags: ["chicken", "coop", "building", "ranch"], size: [48, 48], origin: [24, 36],
  duration: 3.5, fps: 16, loop: true, bg: "field",
  options: { palette: ["#294747", "#315d56", "#438274", "#65a38a", "#95c1a2"], open: -1 },
};

export function draw(p, t, o) {
  const R = fit(o.palette, 5);
  const open = o.open < 0 ? ease.inOutSine(seg(t, 0.46, 1.12)) * (1 - ease.inOutSine(seg(t, 2, 2.94))) : clamp(o.open);
  groundShadow(p, 0, -1, 15, 3);
  groundShadow(p, 6, 2, 6, 2);
  p.rect(-12, -8, 3, 8, PAINT[0]);
  p.rect(-11, -7, 1, 6, PAINT[2]);
  p.rect(11, -7, 3, 7, PAINT[0]);
  p.poly([[-14, -8], [-14, -20], [-5, -28], [5, -27], [16, -20], [16, -10], [12, -7]], PAINT[0]);
  p.poly([[-13, -9], [-13, -20], [-6, -26], [0, -26], [12, -20], [12, -9]], PAINT[2]);
  p.poly([[12, -19], [15, -20], [15, -11], [12, -8]], PAINT[1]);
  for (const y of [-20, -16, -12]) {
    p.line(-13, y, 12, y, PAINT[1]);
    p.line(-13, y - 1, 11, y - 1, PAINT[3]);
  }
  p.poly([[-17, -20], [-9, -29], [2, -32], [10, -29], [19, -22], [15, -18], [6, -25], [-6, -25], [-13, -18]], R[0]);
  p.poly([[-16, -21], [-8, -29], [2, -31], [10, -28], [18, -22], [15, -19], [6, -26], [-7, -26], [-13, -19]], R[2]);
  p.polyline([[-16, -21], [-8, -29], [2, -31], [10, -28], [18, -22]], R[3]);
  p.line(-6, -27, 7, -27, R[4]);
  p.line(9, -25, 13, -25, R[1]);
  p.line(11, -23, 15, -23, R[1]);
  p.rect(-11, -19, 8, 8, PAINT[4]);
  p.rect(-10, -18, 6, 6, DARK);
  p.line(-9, -18, -9, -13, PAINT[3]);
  p.line(-7, -18, -7, -13, PAINT[3]);
  p.line(-10, -15, -5, -15, PAINT[3]);
  p.rect(2, -19, 9, 11, PAINT[1]);
  p.rect(3, -18, 7, 9, DARK);
  p.line(4, -10, 8, -10, STRAW);
  p.px(5, -11, PAINT[4]);
  const endY = Math.round(-18 + 23 * open), dx = Math.round(open * 2);
  p.poly([[3, -9], [10, -9], [10 + dx, endY], [3 + dx, endY]], PAINT[0]);
  p.poly([[4, -9], [9, -9], [9 + dx, endY - Math.sign(endY + 9)], [4 + dx, endY - Math.sign(endY + 9)]], PAINT[3]);
  for (const u of [0.26, 0.55, 0.82]) {
    const y = Math.round(-9 + (endY + 9) * u), x = Math.round(4 + dx * u);
    p.line(x, y, x + 5, y, PAINT[1]);
  }
  if (open < 0.3) p.px(7, -14, PAINT[4]);
}

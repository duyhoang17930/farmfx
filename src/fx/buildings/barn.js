import { clamp, ease, fit, hex, seg } from "../../core/index.js";
import { groundShadow } from "../_kit/sprite.js";

const TRIM = ["#514350", "#766471", "#afa09a", "#dbccb0", "#f0e3c3"].map(hex);
const ROOF = ["#302c43", "#41374d", "#58445b", "#78566b", "#9c7180"].map(hex);
const STRAW = hex("#c49a53");

export const meta = {
  name: "Barn",
  desc: "A three-tile red barn with a gambrel roof, hayloft window and sliding doors. Pin the doors with open 0-1.",
  tags: ["barn", "ranch", "building", "door"], size: [64, 64], origin: [32, 52],
  duration: 4, fps: 16, loop: true, bg: "field",
  options: { palette: ["#522b39", "#764050", "#a74d4e", "#c96558", "#df8270"], open: -1 },
};

function slidingDoor(p, x, width, C, side) {
  p.rect(x, -15, width, 15, C[1]);
  p.rect(x + 1, -14, width - 2, 12, C[2]);
  p.line(x, -15, x + width - 1, -15, TRIM[4]);
  p.line(x, -2, x + width - 1, -2, TRIM[2]);
  p.line(x + 1, -3, x + width - 2, -14, TRIM[3]);
  p.line(x + 1, -14, x + width - 2, -3, TRIM[3]);
  p.px(x + (side < 0 ? width - 2 : 1), -9, TRIM[0]);
}

export function draw(p, t, o) {
  const C = fit(o.palette, 5);
  const open = o.open < 0 ? ease.inOutSine(seg(t, 0.6, 1.45)) * (1 - ease.inOutSine(seg(t, 2.43, 3.4))) : clamp(o.open);
  groundShadow(p, 1, 0, 25, 4.1);
  p.poly([[-23, -20], [-17, -30], [-10, -36], [7, -38], [17, -31], [23, -19], [23, -5], [17, 0], [-23, 0]], C[0]);
  p.poly([[15, -22], [22, -24], [22, -6], [16, -1]], C[1]);
  p.poly([[-22, -20], [-16, -30], [-9, -35], [0, -35], [10, -31], [17, -19], [17, -1], [-22, -1]], C[2]);
  for (let x = -20; x < 17; x += 4) {
    const y = x < -13 || x > 9 ? -22 : -26;
    p.line(x, y, x, -2, C[1]);
    p.line(x + 1, y, x + 1, -2, C[3]);
  }
  p.poly([[-25, -23], [-18, -33], [-11, -39], [0, -42], [14, -39], [21, -33], [26, -24], [18, -18], [12, -29], [5, -35], [-9, -35], [-16, -29], [-22, -19]], ROOF[0]);
  p.poly([[-16, -32], [-10, -38], [0, -41], [14, -38], [21, -32], [24, -25], [18, -20], [12, -30], [4, -36], [-10, -36]], ROOF[2]);
  for (const [x, y] of [[9, -37], [15, -34], [18, -30], [20, -27], [22, -24]]) p.line(x - 4, y, x, y, ROOF[3]);
  for (const [x, y] of [[-6, -39], [3, -39], [6, -38], [10, -35], [14, -32], [16, -29], [18, -26], [20, -23]]) {
    p.line(x, y, x + 2, y - 1, ROOF[1]);
  }
  p.polyline([[-23, -21], [-16, -31], [-9, -37], [5, -37], [13, -31], [19, -21]], TRIM[3]);
  p.polyline([[-22, -20], [-15, -30], [-9, -35]], TRIM[4]);
  p.rect(-8, -29, 11, 9, TRIM[1]);
  p.rect(-7, -28, 9, 7, ROOF[0]);
  p.rect(-5, -27, 5, 4, ROOF[2]);
  p.line(-3, -28, -3, -22, TRIM[2]);
  p.line(-6, -26, 0, -26, TRIM[2]);
  p.line(-8, -21, 3, -21, TRIM[4]);
  p.rect(-12, -18, 20, 18, C[0]);
  p.rect(-10, -16, 16, 16, ROOF[0]);
  p.rect(-11, -17, 18, 1, TRIM[3]);
  p.line(-9, -3, 5, -3, ROOF[1]);
  for (const x of [-6, -4, 1, 4]) p.line(x, -2, x + 1, -4, STRAW);
  const slide = Math.round(open * 8);
  slidingDoor(p, -10 - slide, 8, C, -1);
  slidingDoor(p, -2 + slide, 8, C, 1);
  p.rect(-22, -2, 4, 2, TRIM[2]);
  p.rect(14, -2, 4, 2, TRIM[1]);
}

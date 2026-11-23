import { livestock, coat, leg } from "../_kit/livestock.js";

function muzzle(g, x, y, M, side) {
  g.ellipse(x, y, side ? 4.6 : 6.3, 3.9, (nx, ny) => M[ny > 0.35 ? 2 : nx < 0 ? 4 : 3]);
  for (const dx of side ? [0, 2] : [-2, 2]) g.set(x + dx, y - 1, M[0]);
  g.line(x - 1, y + 2, x + 2, y + 2, M[2]);
}

function side(g, R, C, M) {
  const y = -12 + R.bob, dip = Math.round(R.graze * 7);
  leg(g, -9, y + 4, -8 - R.stride, -3 - R.heel, 1.55, C, M, true);
  leg(g, 5, y + 4, 7 + R.stride, -3 + R.heel, 1.5, C, M, true);
  g.tube([[-12, y - 3], [-16, y + 1], [-17 + R.tail, y + 5]], 0.75, C[2]);
  g.ellipse(-17 + R.tail, y + 5, 1.55, 1.8, M[0]);
  coat(g, -4, y, 12, 7.7, C);
  g.poly([[-13, y - 3], [-10, y - 6], [-7, y - 4], [-6, y], [-9, y + 3], [-12, y + 1]], M[0]);
  g.poly([[0, y - 6], [5, y - 5], [7, y - 2], [4, y + 1], [0, y - 1], [-1, y - 4]], M[1]);
  g.ellipse(-1, y + 6, 3.8, 2.2, M[3]);
  leg(g, -10, y + 4, -11 + R.stride, -Math.max(R.heel, 0), 1.7, C, M);
  leg(g, 4, y + 4, 5 - R.stride, Math.min(R.heel, 0), 1.65, C, M);
  coat(g, 7, y - 4 + dip * 0.56, 5, 5.4, C);
  const hx = 12 + Math.round(R.graze * 2), hy = y - 6 + dip;
  g.ellipse(hx - 5, hy - 1, 3.4, 1.8, M[0]);
  g.ellipse(hx - 5, hy - 1, 2.25, 0.8, M[3]);
  coat(g, hx, hy, 5.5, 5.8, C);
  g.poly([[hx - 4, hy - 4], [hx, hy - 5], [hx + 1, hy - 2], [hx - 1, hy + 1], [hx - 4, hy]], M[0]);
  g.tube([[hx - 2, hy - 4], [hx - 3, hy - 7], [hx - 3, hy - 8]], 0.85, C[3]);
  g.tube([[hx + 2, hy - 4], [hx + 3, hy - 7]], 0.8, C[2]);
  g.line(hx + 1, hy - 2, hx + 1, hy - (R.blink ? 2 : 1), M[0]);
  if (!R.blink) g.set(hx + 1, hy - 2, C[4]);
  muzzle(g, hx + 3, hy + 4, M, true);
}

function straight(g, f, R, C, M) {
  const back = f === "up", y = -13 + R.bob;
  for (const [x, d] of [[-6, -1], [6, 1]]) {
    leg(g, x, y + 2, x + R.heel * d, -5 + R.stride * d / 2, 1.45, C, M, true);
    leg(g, x * 0.85, y + 5, x - R.heel * d, -Math.max(0, R.stride * d), 1.6, C, M);
  }
  const h = back ? y - 10 : y + Math.round(R.graze * 3);
  if (back) head(g, h, C, M, R.blink, true);
  coat(g, 0, y - 2, 9, 9.5, C);
  g.poly([[-7, y - 2], [-6, y - 7], [-2, y - 9], [1, y - 5], [-2, y - 2], [-4, y + 1]], M[0]);
  if (back) {
    g.tube([[1, y - 4], [2 + R.tail, y + 2], [1 + R.tail, y + 7]], 0.8, C[2]);
    g.ellipse(1 + R.tail, y + 7, 1.25, 1.5, M[0]);
  } else head(g, h, C, M, R.blink, false);
}

function head(g, y, C, M, blink, back) {
  for (const d of [-1, 1]) {
    g.ellipse(d * 6, y - 2, 2.8, 1.85, M[0]);
    g.ellipse(d * 6, y - 2, 1.8, 0.8, M[3]);
    g.tube([[d * 3, y - 4], [d * 4.5, y - 6], [d * 4.5, y - 8]], 0.9, C[3]);
  }
  coat(g, 0, y, 6.1, 5.9, C, Number(back));
  if (back) return;
  g.poly([[-4, y - 4], [-1, y - 5], [0, y - 2], [-2, y + 1], [-4, y]], M[0]);
  for (const x of [-3, 3]) {
    g.line(x, y - 1, x, y + (blink ? -1 : 0), M[0]);
    if (!blink) g.set(x, y - 1, C[4]);
  }
  muzzle(g, 0, y + 4, M, false);
}

export const { meta, draw } = livestock({
  name: "Cow", desc: "A spotted dairy cow with four facings, a swishing tail and idle, walk and graze loops.",
  tags: ["cattle", "dairy", "ranch"], size: [48, 48], origin: [24, 36], shadow: [9, 16, 3],
  palette: ["#41323c", "#a29696", "#c7b9ac", "#e7d9c0", "#fff0d0"],
  marking: ["#443644", "#685568", "#aa6b75", "#d99792", "#f2bdb0"],
  drawAnimal(g, f, pose, C, M) {
    if (f === "up" || f === "down") straight(g, f, pose, C, M);
    else side(g, pose, C, M);
  },
});

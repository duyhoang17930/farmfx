import { livestock, coat, leg } from "../_kit/livestock.js";

function wool(g, x, y, wide, C) {
  coat(g, x, y + 1, wide ? 10 : 7.4, 6.8, C);
  for (const [dx, dy, r] of [[-5, -2, 4], [-2, -4, 4.1], [3, -4, 4], [6, -2, 3.6], [2, 0, 3.8], [-3, 1, 3.6], [3, 3, 3.25]]) {
    coat(g, x + dx * (wide ? 1 : 0.69), y + dy, r, r * 0.87, C, dy > 1 ? 1 : 0);
  }
  g.line(x - 7, y - 3, x - 6, y - 4, C[4]);
  g.line(x - 1, y - 5, x + 1, y - 5, C[4]);
  g.line(x + 1, y + 2, x + 2, y + 1, C[4]);
  g.line(x - 4, y + 3, x - 3, y + 2, C[2]);
  g.line(x + 4, y + 4, x + 5, y + 3, C[2]);
  g.set(x + 3, y - 5, C[4]);
}

function head(g, x, y, flank, back, blink, C, M) {
  g.ellipse(x - (flank ? 2 : 4.7), y, 2.1, 1.3, M[1]);
  g.ellipse(x + (flank ? 0 : 4.7), y - 0.5, 2.1, 1.3, M[2]);
  coat(g, x, y + 1, flank ? 3.9 : 4, 4.2, M, Number(back));
  coat(g, x - 0.9, y - 2.5, 3.2, 2.15, C);
  coat(g, x + 1.8, y - 2.3, 2, 1.6, C);
  if (back) return;
  for (const dx of flank ? [1] : [-2, 2]) {
    g.line(x + dx, y, x + dx, y + Number(!blink), M[0]);
    if (!blink) g.set(x + dx, y, C[4]);
  }
  g.ellipse(x + (flank ? 1 : 0), y + 3.8, 2.25, 1.3, M[2]);
  g.set(x + (flank ? 2 : 0), y + 3.5, M[0]);
}

export const { meta, draw } = livestock({
  name: "Sheep", desc: "A woolly sheep with a charcoal face, four facings and idle, walk and graze loops.",
  tags: ["wool", "lamb", "ranch"], size: [32, 32], origin: [16, 24], shadow: [7, 11, 2.7],
  palette: ["#544656", "#a297a1", "#c8b7b6", "#e7d3c4", "#fff0d6"],
  marking: ["#34303e", "#50485b", "#6c6271", "#877883", "#a18e95"],
  drawAnimal(g, f, R, C, M) {
    const wide = f !== "up" && f !== "down", y = -10 + R.bob;
    const hw = wide ? 5.5 : 4.1, bodyX = wide ? -2.8 : 0;
    for (const d of [-1, 1]) {
      leg(g, bodyX + hw * d, y + 4, bodyX + (hw + R.stride * 0.72) * d, -3 - R.heel * d, 1, M, M, true);
      leg(g, bodyX + hw * d, y + 5, bodyX + (hw - R.stride * 0.72) * d, -Math.max(R.heel * d, 0), 1.25, M, M);
    }
    if (f === "up") head(g, 0, y - 8, false, true, false, C, M);
    if (wide) coat(g, -12, y - 0.5 + R.tail / 2, 2.5, 1.8, C);
    wool(g, bodyX, y, wide, C);
    if (f !== "up") head(g, wide ? 8.5 + R.graze : 0, y - (wide ? 4 : 0) + Math.round(R.graze * 5), wide, false, R.blink, C, M);
    else coat(g, R.tail / 2, y + 5, 2.35, 1.8, C);
  },
});

import { asset, RED, WATER, wave } from "../_kit/art.js";

export const { meta, draw } = asset({
  name: "Build footprint",
  desc: "Grid-aligned placement marks for up to six by six tiles, with an X on each blocked square.",
  tags: ["building", "placement", "mobile"], size: [128, 128], origin: [24, 28],
  duration: 1, palette: WATER,
  options: { columns: 2, rows: 2, blocked: [] },
}, (p, t, colors, o) => {
  const columns = Math.min(6, Math.max(1, Math.floor(o.columns)));
  const rows = Math.min(6, Math.max(1, Math.floor(o.rows)));
  for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
    const x = col * 16 - 8, y = row * 16 - 12;
    const blocked = o.blocked.includes(row * columns + col);
    const C = blocked ? RED : colors;
    p.rect(x, y, 16, 16, C[0], 0.3);
    for (const dx of [0, 15]) for (const dy of [0, 15]) {
      const xx = x + dx, yy = y + dy;
      p.line(xx, yy, xx + (dx ? -4 : 4), yy, C[4]);
      p.line(xx, yy, xx, yy + (dy ? -4 : 4), C[3]);
    }
    if (blocked) {
      p.line(x + 5, y + 5, x + 10, y + 10, C[4]);
      p.line(x + 10, y + 5, x + 5, y + 10, C[4]);
    } else {
      p.dot(x + 7, y + 7, C[4], 0.65 + 0.32 * wave(t));
    }
  }
});

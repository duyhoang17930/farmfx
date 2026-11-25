import { asset, GOLD, RED, WATER, wave } from "../_kit/art.js";

export const { meta, draw } = asset({
  name: "Target brackets",
  desc: "Four animated pixel brackets with ready, distant, and hostile states.",
  tags: ["target", "feedback", "mobile"], size: [80, 80], origin: [40, 64],
  duration: 1, palette: GOLD, options: { width: 22, height: 24, state: "ready" },
}, (p, t, colors, o) => {
  const C = o.state === "hostile" ? RED : o.state === "distant" ? WATER : colors;
  const half = Math.min(34, Math.max(7, o.width / 2)) + Math.round(wave(t));
  const h = Math.min(59, Math.max(12, o.height));
  const alpha = o.state === "distant" ? 0.72 : 1;
  for (const dx of [-1, 1]) for (const dy of [-1, 1]) {
    const x = dx * half, y = dy === -1 ? -h : 3;
    p.line(x, y + 1, x - dx * 5, y + 1, C[0], alpha);
    p.line(x + dx, y, x + dx, y - dy * 5, C[0], alpha);
    p.line(x, y, x - dx * 5, y, C[4], alpha);
    p.line(x, y, x, y - dy * 5, C[3], alpha);
    p.px(x - dx, y - dy, C[1]);
  }
});

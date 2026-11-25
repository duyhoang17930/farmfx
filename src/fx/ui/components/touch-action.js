import { asset, CREAM, GOLD, RED, WATER } from "../../_kit/art.js";

export const { meta, draw } = asset({
  name: "Touch action",
  desc: "A pixel touch control with pressed, hold progress and locked states.",
  tags: ["button", "touch", "mobile"], size: [48, 48], origin: [24, 24],
  duration: 1, fps: 1, palette: WATER, bg: "dark",
  options: { state: "ready", progress: 0, mark: "+" },
}, (p, _t, C, o) => {
  const locked = o.state === "locked";
  const y = o.state === "pressed" ? 2 : 0;
  p.circle(0, 2, 19, C[0]);
  p.circle(0, y, 18, locked ? RED[1] : C[3]);
  p.circle(0, y, 15, C[0]);
  p.arc(0, y, 14, 1, Math.PI, Math.PI * 1.5, C[2]);
  if (o.progress > 0) p.arc(0, y, 17, 1, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, o.progress), GOLD[4]);
  p.text(String(o.mark).slice(0, 1), 0, y - 3, locked ? RED[4] : CREAM[4], { align: "center", font: "big" });
});

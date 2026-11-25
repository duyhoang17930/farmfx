import { ease, seg } from "../../core/index.js";
import { asset, GOLD } from "../_kit/art.js";
import { icon } from "../_kit/farm-ui.js";

export const { meta, draw } = asset({
  name: "Loot flight",
  desc: "A configurable item icon bounces from its source then accelerates toward a moving destination.",
  tags: ["loot", "magnet", "pickup"], size: [128, 112], origin: [64, 72],
  duration: 0.66, fps: 30, loop: false, palette: GOLD,
  options: { item: "wood", toX: 37, toY: -15, drift: -6 },
}, (p, t, C, o) => {
  if (t >= 1) return;
  const flight = ease.inQuad(seg(t, 0.29, 1));
  const bounce = Math.sin(Math.PI * seg(t, 0, 0.34)) * 9;
  const x = o.toX * flight + o.drift * Math.sin(Math.PI * t);
  const y = o.toY * flight - bounce - 7 * Math.sin(Math.PI * flight);
  const opacity = 1 - seg(t, 0.87, 1);
  const before = p.fade;
  const launch = 1 - seg(t, 0, 0.23);
  p.line(x + 5, y - 8, x + 8, y - 8, C[4], launch);
  p.line(x + 6, y - 10, x + 6, y - 6, C[3], launch);
  for (let i = 1; i <= 3; i++) {
    const back = ease.inQuad(seg(t - i * 0.037, 0.29, 1));
    if (back > 0) p.dot(x - o.toX * (flight - back), y - o.toY * (flight - back), C[4], opacity / i);
  }
  p.fade *= opacity;
  icon(p, o.item, Math.round(x), Math.round(y - 5), 0);
  p.fade = before;
});

import { ease, rand, seg } from "../../core/index.js";
import { GOLD, STEEL } from "../_kit/art.js";
import { burst } from "../_kit/farm-feedback.js";

export const { meta, draw } = burst("Ore pick impact",
  "A short spray of warm metal sparks follows the pick, with heavier ore chips on the finishing strike.",
  "mining", GOLD, 0.37, (p, t, C, o) => {
    const dir = Math.sign(o.direction) || 1;
    const flash = 1 - seg(t, 0.04, 0.31);
    p.line(-2, -9, 3, -9, C[4], flash);
    p.line(0, -12, 0, -7, C[4], flash);
    for (let i = 0; i < (o.heavy ? 11 : 8); i++) {
      const speed = 5 + 13 * rand(i, 8, o.seed);
      const f = ease.outQuad(t);
      const x = dir * (f * speed) * (i % 4 === 0 ? -0.6 : 1);
      const y = -9 - (i * 1.8 + 4) * f + t * t * (16 + i);
      const fade = 1 - seg(t, 0.25 + (i % 3) * 0.12, 0.9);
      const chip = o.heavy && i > 6;
      p.line(x, y, x - dir * (chip ? 1 : 3 * (1 - t)), y + 1, chip ? STEEL[3] : C[3], fade);
      p.dot(x, y, chip ? STEEL[4] : C[4], fade);
    }
  }, { direction: 1, heavy: false });

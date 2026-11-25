import { rand, seg } from "../../core/index.js";
import { GOLD, LEAF, WOOD } from "../_kit/art.js";
import { burst } from "../_kit/farm-feedback.js";

export const { meta, draw } = burst("Woodcut impact",
  "Pale splinters fan out at the axe contact while two loose needles flutter down.", "woodcut", WOOD, 0.49,
  (p, t, C, o) => {
    const dir = Math.sign(o.direction) || 1;
    for (let i = 0; i < 7; i++) {
      const speed = 5 + 13 * rand(i, 2, o.seed);
      const height = 5 + 18 * rand(i, 7, o.seed);
      const x = dir * (2 + t * speed) + (i - 3) * (1 - t);
      const y = -8 - (height * t) + t * t * 24;
      const fade = 1 - seg(t, 0.47 + i * 0.02, 0.94);
      p.line(x, y, x - dir * (i % 3 === 0 ? 3 : 1), y + 1, C[2 + i % 3], fade);
      if (i < 2) p.dot(x, y - 1, GOLD[4], fade);
    }
    for (let i = 0; i < 2; i++) {
      const x = (i ? 1 : -1) * (5 + t * 12) + 2 * Math.sin(t * 17 + i);
      const y = -19 + t * (9 + i * 4);
      p.line(x, y, x + (i ? 1 : -1), y + 1, LEAF[4], 1 - seg(t, 0.56, 0.95));
    }
  }, { direction: 1 });

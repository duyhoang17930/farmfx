import { rand, seg } from "../../core/index.js";
import { STEEL } from "../_kit/art.js";
import { burst, puff } from "../_kit/farm-feedback.js";

export const { meta, draw } = burst("Stone pick impact",
  "Chalky chips tumble out of a compact dust puff when the pick strikes bare stone.", "stone", STEEL, 0.45,
  (p, t, C, o) => {
    puff(p, t, C, o, o.heavy ? 7 : 4);
    for (let i = 0; i < (o.heavy ? 10 : 5); i++) {
      const dir = i % 2 === 0 ? -1 : 1;
      const x = dir * (3 + t * (6 + 11 * rand(i, 9, o.seed)));
      const y = -6 - t * (8 + 17 * rand(i, 7, o.seed)) + t * t * 26;
      const fade = 1 - seg(t, 0.43, 0.92);
      p.line(x, y, x + dir, y + 1, C[2], fade);
      p.dot(x, y, C[4], fade);
    }
  }, { heavy: false });

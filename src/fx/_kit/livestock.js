import { ease, fit, seg, TAU } from "../../core/index.js";
import { Grid, shift } from "./creature.js";
import { groundShadow } from "./sprite.js";

/** Shared gait and facing controls. The species supplies its own body and head anatomy. */
export function livestock({ name, desc, tags, size, origin, palette, marking, shadow, drawAnimal }) {
  const meta = {
    name, desc, tags: ["animal", "livestock", "four-way", ...tags], size, origin,
    duration: 3.2, fps: 20, loop: true, bg: "field",
    options: { palette, marking, facing: "right", anim: "graze", seed: 1 },
  };
  const g = new Grid(-origin[0], -origin[1], ...size);
  function draw(p, t, o) {
    const time = shift(t, meta.duration, o.seed), phase = time / meta.duration;
    const walking = o.anim === "walk";
    const grazing = o.anim === "graze";
    const graze = grazing ? ease.inOutSine(seg(time, 0.75, 1.24)) * (1 - ease.inOutSine(seg(time, 1.84, 2.35))) : 0;
    const step = walking ? Math.floor(phase * 16) % 4 : 0;
    const pose = {
      bob: walking ? step % 2 : Number(Math.sin(phase * TAU * 2) > 0.5),
      stride: walking ? [2, 0, -2, 0][step] : 0,
      heel: walking ? (step === 1 ? 1 : step === 3 ? -1 : 0) : 0,
      graze, blink: (time >= 0.55 && time < 0.65) || (time >= 2.68 && time < 2.8),
      tail: Math.round(Math.sin(phase * TAU * 2) * 2),
    };
    const facing = o.facing === "left" ? "right" : o.facing;
    const middle = facing === "up" || facing === "down";
    const C = fit(o.palette, 5), M = fit(o.marking, 5);
    groundShadow(p, 0, -1, shadow[middle ? 0 : 1], shadow[2]);
    drawAnimal(g.clear(), facing, pose, C, M);
    g.outline(C[0]);
    if (o.facing === "left") {
      for (let i = 0; i < g.c.length; i++) {
        const c = g.c[i];
        if (c) p.px(-(i % g.w + g.x0) - 1, Math.floor(i / g.w) + g.y0, c);
      }
    } else {
      g.draw(p);
    }
  }
  return { meta, draw };
}

export function coat(g, x, y, rx, ry, C, shade = 0) {
  g.ellipse(x, y, rx, ry, (nx, ny) => {
    const lit = -0.38 * nx - 0.59 * ny;
    return C[Math.max(1, (lit > 0.4 ? 4 : lit > 0.1 ? 3 : lit > -0.32 ? 2 : 1) - shade)];
  });
}

export function leg(g, x, y, footX, footY, r, C, M, far = false) {
  g.tube([[x, y], [(x + footX) / 2, footY - 3], [footX, footY - 1]], r, far ? C[1] : C[2]);
  if (!far) g.line(x - r / 2, y, footX - r / 2, footY - 2, C[3]);
  g.ellipse(footX, footY - 0.5, r + 0.25, 1, M[1]);
}

import { clamp, ease, fit, hex, lerp, rand, seg, TAU, wrap } from "../../core/index.js";
import { groundShadow, Layer, twinkle } from "./sprite.js";
import { toss } from "./creature.js";

const LEAF = ["#1d3427", "#31552d", "#51843f", "#79a944", "#bbd564"];
const SOIL = ["#3b2723", "#573727", "#74482d", "#8e5c36", "#ac7748"];
const DUR = 5;
const RIPEN = 2.95;
const HARVEST = 3.8;
const GLINT = hex("#ffe192");
const SHINE = hex("#fff3be");

export function crop({
  name, desc, tags, palette = LEAF, produce, wood = SOIL, drawPlant, drawHarvest,
  sparkleAt, method = "pick", orchard = false, tall = false, sproutLeaves,
}) {
  const size = orchard ? [48, 64] : [32, tall ? 64 : 48];
  const origin = [size[0] / 2, size[1] - 8];
  const store = new Layer(...size);
  const meta = {
    name,
    desc: `${desc} Stage 0-4 holds growth.`,
    tags: ["crop", "plant", "grow", "harvest", "loop", ...tags],
    size, origin,
    duration: DUR,
    loop: true,
    fps: 24,
    bg: "field",
    options: { palette, produce, wood, soil: SOIL, plot: true, stage: -1, seed: 1 },
  };

  function draw(p, t, o) {
    t = wrap(t, DUR);
    const stage = o.stage < 0 ? null : Math.round(clamp(o.stage, 0, 4));
    const age = stage === null ? t - HARVEST : -1;
    const planted = stage === null ? t >= 0.44 && t < 4.82 : stage > 0;
    const S = fit(o.soil, 5);
    const hole = method === "dig" ? 1 - seg(age, 0.42, 0.85) : 0;
    if (o.plot) plot(p, S, o.seed, age >= 0 ? hole : 0);
    if (!planted) {
      const alpha = stage === null ? Math.max(1 - seg(t, 0.35, 0.48), seg(t, 4.82, 5)) : 1;
      seed(p, S, alpha);
      return;
    }

    const growth = stage === null
      ? lerp(0.15, 1, ease.outCubic(seg(t, 0.68, 2.25)))
      : [0, 0.15, 0.61, 0.86, 1][stage];
    const ripe = stage === null ? ease.inOutSine(seg(t, 1.92, RIPEN)) : [0, 0, 0, 0.42, 1][stage];
    const stemRipe = age >= 0 && method === "pick" ? 0 : ripe;
    const gust = Math.sin(t * TAU * 0.8) + 0.33 * Math.sin(t * TAU * 1.4 + o.seed);
    const C = fit(o.palette, 5), F = fit(o.produce, 5), W = fit(o.wood, 5);
    const lean = 0.045 * gust + 0.026 * (rand(9, 4, o.seed) - 0.5);
    const q = store.begin(-origin[0], -origin[1]);
    const picking = method === "pick";
    const uproot = picking ? 0 : seg(age, 0, 0.13);
    if (uproot < 1) {
      const fade = 1 - (picking ? seg(age, 0.49, 0.93) : uproot);
      groundShadow(p, 0, -1, orchard ? 9 : 5, orchard ? 3 : 2, growth * fade);
      if (growth < 0.25) {
        const pop = stage === null ? Math.sin(Math.PI * seg(t, 0.44, 0.68)) : 0;
        sprout(q, C, 4 * growth / 0.15 + pop, sproutLeaves);
      } else {
        const tug = stage === null ? ease.inQuad(seg(age, -0.13, 0)) - uproot : 0;
        const stretch = 1 + (picking ? 0 : -0.04 * tug);
        drawPlant(brush(q, growth * stretch, lean + (picking ? 0 : tug * 0.045)), { C, F, W, ripe: stemRipe });
      }
      store.draw(p, 0, -Math.round(uproot * 3), fade);
    }

    const isRipe = stage === 4 || (stage === null && t >= RIPEN && age < 0);
    if (isRipe) {
      const phase = wrap(t - (stage === null ? RIPEN : 0), 0.73) / 0.73;
      const flash = Math.sin(phase * Math.PI);
      const [x, y] = sparkleAt;
      if (flash > 0.43) {
        twinkle(p, x, y, 2.4 * flash, GLINT, SHINE);
        p.glow(x, y, 3, GLINT, 0.22 * flash);
      }
    }
    if (stage === null) {
      if (age >= 0) harvest(p, drawHarvest, age, method, sparkleAt, { C, F, W });
      debris(p, t - 0.45, S, o.seed, 4);
      if (method === "dig") debris(p, age, S, o.seed + 13, 9);
      if (method === "cut") debris(p, age, F, o.seed + 13, 4);
    }
  }
  return { meta, draw };
}

function plot(p, S, seed, hole) {
  p.shade(-8, -12, 8, 4, (x, y) => {
    if (Math.abs(x) > 7 && (y < -11 || y > 2)) return 0;
    if (y > 2 || Math.abs(x) > 7) return S[0];
    if (y > 1) return S[1];
    const row = Math.floor(y + 12 + 0.9 * rand(Math.floor(x / 3), 1, seed)) % 4;
    const fleck = rand(Math.floor(x), Math.floor(y), seed);
    const step = y < -11 ? 3 : [3, 2, 2, 1][row];
    return S[clamp(step + Number(fleck > 0.83) - Number(fleck < 0.1), 1, 4)];
  });
  if (hole > 0) {
    p.ellipse(0, -1, 3.5 * hole, 1.6 * hole, S[1]);
    p.ellipse(-0.5, -1.5, 2.5 * hole, 1.1 * hole, S[0]);
  }
}

function seed(p, S, alpha) {
  p.dot(-1, -1, S[0], alpha);
  p.dot(0, -2, S[4], alpha);
  p.dot(1, -2, S[3], alpha);
  p.dot(0, -1, S[1], alpha);
}

function sprout(p, C, h, leaves = [[-2, -1], [2, -2]]) {
  const tip = -Math.round(h);
  p.line(0, 0, 0, tip, C[2]);
  for (const [x, y] of leaves) {
    p.line(0, tip + Number(x < 0), x, tip + y, C[3]);
    p.px(x, tip + y, C[4]);
  }
}

function harvest(p, drawHarvest, age, method, at, colors) {
  const u = seg(age, 0, 0.7);
  if (u >= 1) return;
  const fromX = method === "pick" ? at[0] * 0.55 : 0;
  const fromY = method === "pick" ? at[1] + 3 : -2;
  const x = Math.round(fromX + ease.outQuad(u) * (method === "pick" ? 4 : 2));
  const y = Math.round(fromY - 9 * Math.sin(u * 2.4));
  const scale = lerp(0.62, 1, ease.outQuad(seg(u, 0, 0.38))) * (1 - 0.8 * ease.inQuad(seg(u, 0.66, 1)));
  if (u < 0.92) drawHarvest(brush(p, scale, 0, x, y), colors);
  if (u > 0.69) twinkle(p, x, y, 3.2 * (1 - seg(u, 0.76, 1)), GLINT, SHINE);
}

function debris(p, age, colors, seed, count) {
  if (age < 0 || age > 0.48) return;
  for (let i = 0; i < count; i++) {
    const v = 12 + 21 * rand(i, 1, seed);
    const angle = lerp(-2.85, -0.3, rand(i, 2, seed));
    const depth = lerp(-6, 3, rand(i, 3, seed));
    const grain = toss(0, -1, Math.cos(angle) * v, Math.sin(angle) * v, age, 190, depth);
    const alpha = grain.landed ? 1 - seg(age - grain.at, 0.02, 0.14) : 1;
    p.dot(grain.x, grain.y, colors[i % 2 + 2], alpha);
  }
}

// The crop is drawn in mature dimensions. The brush scales from the root and
// bends the canopy more than the base, keeping the footprint on the tile.
function brush(p, scale, lean, ox = 0, oy = 0) {
  const X = (x, y) => ox + (x + lean * Math.max(0, -y)) * scale;
  const Y = (y) => oy + y * scale;
  const points = (coords) => coords.map(([x, y]) => [X(x, y), Y(y)]);
  const line = (x, y, ex, ey, c) => p.line(X(x, y), Y(y), X(ex, ey), Y(ey), c);
  return {
    dot(x, y, c) { p.px(X(x, y), Y(y), c); },
    line,
    stem(x, y, ex, ey, width, C) {
      if (width * scale < 1.05) {
        line(x, y, ex, ey, C[2]);
        return;
      }
      p.beam(X(x, y), Y(y), X(ex, ey), Y(ey), width * scale, C[1]);
      line(x - 0.5, y, ex - 0.5, ey, C[3]);
    },
    // Polygonal leaf clusters keep the outline crisp. The upper plane holds the highlight.
    leaf(x, y, ex, ey, width, C, back = false) {
      const dx = ex - x, dy = ey - y, len = Math.hypot(dx, dy) || 1;
      const side = dx < 0 ? -1 : 1;
      const nx = -dy / len * width * side, ny = dx / len * width * side;
      const mx = x + dx * 0.57, my = y + dy * 0.57;
      if (width * scale < 0.65) {
        line(x, y, ex, ey, C[back ? 2 : 3]);
        return;
      }
      p.poly(points([[x, y], [mx - nx, my - ny], [ex, ey], [mx + nx, my + ny]]), C[0]);
      const tip = [x + dx * 0.91, y + dy * 0.91];
      p.poly(points([[x, y], [mx - nx * 0.89, my - ny * 0.89], tip, [mx, my]]), C[back ? 2 : 3]);
      p.poly(points([[x, y], [mx, my], tip, [mx + nx * 0.7, my + ny * 0.7]]), C[back ? 1 : 2]);
      if (!back && len * scale > 4.5) {
        line(x + dx * 0.34, y + dy * 0.34, mx - nx * 0.2, my - ny * 0.2, C[4]);
      }
    },
    orb(x, y, rx, ry, C) {
      const cx = X(x, y), cy = Y(y);
      if (Math.min(rx, ry) * scale < 0.8) {
        p.px(cx, cy, C[3]);
        return;
      }
      p.ellipse(cx, cy, rx * scale, ry * scale, C[0]);
      p.ellipse(cx - 0.3 * scale, cy - 0.4 * scale, rx * scale * 0.83, ry * scale * 0.79, C[2]);
      p.ellipse(cx - rx * scale * 0.22, cy - ry * scale * 0.30, rx * scale * 0.59, ry * scale * 0.50, C[3]);
      if (rx * scale > 2.5 && ry * scale > 2.1) p.px(cx - rx * scale * 0.34, cy - ry * scale * 0.45, C[4]);
    },
  };
}

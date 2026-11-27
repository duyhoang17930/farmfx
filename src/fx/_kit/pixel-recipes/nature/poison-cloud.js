import { cycle, fit, rng, smooth, clamp, TAU, WHITE, tileNoise } from "../../../../core/index.js";

export const meta = {
  name: "Poison cloud",
  desc: "A miasma hugging the floor: violet sheets of gas with an acid-lit crest creep out in curling tongues; plumes twist up and bubbles well up through it and pop.",
  tags: ["nature", "poison", "gas", "cloud", "miasma", "toxic", "area", "ground", "loop"],
  size: [256, 100],
  origin: [128, 86],
  duration: 4,
  loop: true,
  fps: 30,
  bg: "ground",
  options: {
    palette: ["#181521", "#2c1d44", "#46296a", "#6a4790", "#5e6743", "#8aa04f", "#b8d063", "#e6f59a"],
    spread: 1,
    seed: 3,
  },
};

const D = meta.duration;
// sheets of gas, back to front: how tall, how wide, how thick, how much dimmer, how fast their edges flow
const SHEETS = [
  { h: 36, e: 0.84, a: 0.46, dim: 2, flow: 4, n: 2, back: true },
  { h: 26, e: 0.96, a: 0.5, dim: 1, flow: 8, n: 2, back: true },
  { h: 16, e: 1.04, a: 0.56, dim: 0, flow: 8, n: 3, back: false },
];

// tongues creeping out along the floor from the middle: where each one's front is, how tall, how far along
function tongues(sh, si, E, ph) {
  const out = [];
  for (const s of [-1, 1])
    for (let i = 0; i < sh.n; i++) {
      const q = (ph + i / sh.n + si * 0.17 + (s > 0 ? 0.5 / sh.n : 0)) % 1;
      out.push({ s, q, x: s * E * (0.3 + 0.82 * q), h: sh.h * (0.75 - 0.45 * q) });
    }
  return out;
}

// a sheet's height above the floor at x: flat through the middle, falling away at its ends, its top torn by
// noise that flows outward, raised behind each tongue's front
function height(sh, si, E, x, ph, T, seed) {
  const ax = Math.abs(x), env = 1 - smooth(0.5, 1, ax / (E * sh.e)), r = tileNoise(ax * 0.07 - ph * sh.flow, si * 3.7, sh.flow, 0, seed + si);
  const breathe = 1 + 0.2 * Math.sin(TAU * ph * 2 + si * 2.1 + x * 0.02);
  let h = sh.h * breathe * env * (0.55 + 0.45 * r);
  for (const g of T) {
    const behind = g.s * (g.x - x);
    if (behind < -1.5 || behind > 30) continue;
    h = Math.max(h, g.h * Math.sqrt(Math.max(0, 1 - behind / 30)) * smooth(-1.5, 1.5, behind) * (1 - smooth(0.75, 1, g.q)));
  }
  return h;
}

// one sheet: brightest down at the floor where it's lit from within, darkening to violet toward its torn top,
// streaked in thin layers, a pale rim along its edge
function sheet(p, C, sh, si, E, t, seed) {
  const ph = t / D, T = tongues(sh, si, E, ph), d = sh.dim, X = Math.ceil(E * 1.25);
  for (let x = -X; x <= X; x++) {
    const H = height(sh, si, E, x + 0.5, ph, T, seed);
    if (H < 0.6) continue;
    const top = -Math.round(H);
    for (let y = top; y <= 1; y++) {
      const v = clamp(-y / H), streak = 0.7 + 0.3 * tileNoise(x * 0.05 - ph * sh.flow * Math.sign(x || 1), y * 0.55, sh.flow, 0, seed + 9 + si);
      const lv = v - (streak - 0.7) * 0.6, c = y === top ? C[Math.max(1, 4 - d)] : lv < 0.16 ? C[6 - d] : lv < 0.42 ? C[5 - d] : lv < 0.68 ? C[4 - d] : C[Math.max(1, 3 - d)];
      // a hard rim: lit acid along the front sheet's crest, a dark violet line on the back ones, so the cloud has
      // a silhouette on any ground; the body below is denser violet up high, thinner where it's lit near the floor
      if (y === top) p.dot(x, y, sh.back ? C[1] : streak > 0.7 ? C[7] : C[6], sh.back ? 0.8 : 0.95);
      else if (y === top + 1 && !sh.back) p.dot(x, y, C[5], 0.7);
      else p.blend(x, y, c, sh.a * (sh.back ? 1.05 : 0.72) * (1 - 0.38 * v));
    }
  }
  // the tongues' leading edges roll over in curls as they creep forward
  for (const g of T) {
    const k = Math.sin(Math.PI * g.q);
    if (k < 0.15 || g.h < 4) continue;
    const r = 1.8 + g.h * 0.22, cx = g.x - g.s * r * 0.6, cy = -g.h * 0.72, spin = -g.s * g.q * TAU * 2.2;
    // a roll of gas: a thick soft band winding in on itself, lighter along its outer edge
    for (let a = 0; a < 4.6; a += 0.1) {
      const rr = r * (1 - a * 0.12), px = cx + g.s * Math.cos(spin + a) * rr, py = cy + Math.sin(spin + a) * rr, w = 1.6 * (1 - a / 6);
      for (let o = -w; o <= w; o += 0.8) {
        const qx = px + g.s * Math.cos(spin + a) * o, qy = py + Math.sin(spin + a) * o;
        p.dot(qx,qy,o>w*.4?C[5-d]:C[4-d],sh.a*.6*k*(1-a/5.5));
      }
    }
  }
}

// plumes: columns that lift off the sheets and twist into ribbons, thinning as they climb
function plumes(p, C, E, t, seed) {
  cycle(t, D, 5, seed, (g) => g.range(2.4, 3.2), (age, L, R) => {
    const u = age / L, x0 = R.range(-0.55, 0.55) * E, rise = R.range(13, 19), len = R.range(34, 48), ph = R.range(0, TAU), amp = R.range(3, 5);
    const head = 14 + rise * age, tail = Math.max(10, head - len), fade = smooth(0, 0.15, u) * (1 - smooth(0.5, 1, u));
    for (let h = tail; h <= head; h += 0.7) {
      const s = (h - tail) / Math.max(1, head - tail), tw = Math.cos(h * 0.22 + age * 2.4 + ph), w = 0.6 + 2.2 * Math.abs(tw) * (1 - s * 0.5);
      const x = x0 + amp * Math.sin(h * 0.12 + age + ph) * (0.4 + s), a = fade * Math.sin(Math.PI * Math.min(1, s * 1.2)) * 0.32;
      for (let o = -w; o <= w; o += 1) p.blend(x + o, -h, tw > 0 ? (Math.abs(o) < w * 0.5 ? C[6] : C[5]) : Math.abs(o) < w * 0.5 ? C[3] : C[2], a);
    }
  });
}

// specks drifting out through the gas with its flow, twinkling
function specks(p, C, E, t, seed) {
  cycle(t, D, 30, seed, (g) => g.range(1.5, 2.6), (age, L, R) => {
    const u = age / L, s = R.sign(), x = s * (R.range(0.05, 0.7) * E + age * R.range(6, 14)), y = -R.range(2, 20) - Math.sin(age * R.range(1.5, 3) + R.next() * TAU) * 2;
    const a = Math.min(1, u * 5) * Math.min(1, (1 - u) * 3) * (0.6 + 0.4 * Math.sin(age * R.range(6, 10) + R.next() * TAU));
    if (a < 0.1) return;
    p.dot(x, y, a > 0.7 ? C[7] : C[6], a * 1.3);
    p.glow(x, y, 3, C[6], 0.12 * a);
  });
}

// bubbles welling up out of the floor through the gas: a 1 px ring with a glint, that pops into four droplets
function bubbles(p, C, E, t, seed) {
  cycle(t, D, 9, seed, (g) => g.range(1.1, 1.7), (age, L, R) => {
    const u = age / L, x = R.range(-0.75, 0.75) * E, rise = R.range(10, 22), r = R.range(1.6, 3.2), pop = 0.82;
    const y = -2 - rise * Math.min(u, pop) / pop;
    if (u < pop) {
      const rr = r * (0.5 + 0.5 * Math.min(1, u * 4));
      p.ring(x, y, rr + 0.5, 1, C[6]);
      p.dot(x - rr * 0.4, y - rr * 0.4, C[7]);
      p.glow(x, y, rr + 3, C[6], 0.1);
    } else {
      const k = (u - pop) / (1 - pop), d = r + 1 + k * 4;
      for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 0.6], [1, 0.6]]) p.dot(x + dx * d, y + dy * d + k * k * 3, k < 0.5 ? C[7] : C[6], 1 - k);
    }
  });
}

export function drawBack(p, t, o) {
  const C = fit(o.palette, 8), E = 96 * o.spread, pulse = 0.85 + 0.15 * Math.sin((TAU * t * 2) / D);
  // lit from within, low down: a soft line of light along the floor under it all
  for (let x = -E; x <= E; x += 22) p.glow(x, -3, 22, C[5], 0.08 * pulse * (1 - Math.abs(x) / (E * 1.3)));
  // pockets of light wandering inside it, low down
  for (let i = 0; i < 6; i++) {
    const R = rng(o.seed, i, 7), x = Math.sin((TAU * t) / D + R.range(0, TAU)) * E * R.range(0.2, 0.7) + R.range(-0.3, 0.3) * E, k = 0.6 + 0.4 * Math.sin((TAU * t * 3) / D + i);
    p.glow(x, -R.range(4, 10), R.range(10, 16), C[6], 0.1 * k);
  }
  SHEETS.forEach((sh, i) => sh.back && sheet(p, C, sh, i, E, t, o.seed));
}

export function draw(p, t, o) {
  const C = fit(o.palette, 8), E = 96 * o.spread;
  plumes(p, C, E, t, o.seed * 7 + 2);
  SHEETS.forEach((sh, i) => !sh.back && sheet(p, C, sh, i, E, t, o.seed));
  bubbles(p, C, E, t, o.seed * 5 + 1);
  specks(p, C, E, t, o.seed * 11 + 5);
  p.glow(0, -6, E * 0.65, C[5], 0.06);
}

import { fit, noise2, rand, TAU } from "../../core/index.js";
import { groundTones } from "../_kit/world-terrain.js";

const SEASONS = {
  spring: ["#315335", "#406a36", "#527c3d", "#71a143", "#94bd57"],
  summer: ["#384e30", "#476337", "#5d783b", "#819a45", "#b0b75e"],
  autumn: ["#54452d", "#6b5935", "#806b38", "#a48a43", "#c6a558"],
  winter: ["#59737c", "#819b9c", "#a9c1bc", "#c3d5cb", "#e7e9d6"],
};

export const meta = {
  name: "Grass",
  desc: "A seamless 16 px ground tile with wind-stirred tufts and spring, summer, autumn or winter colors.",
  tags: ["grass", "season", "ground", "tile"], size: [16, 16], origin: [8, 12],
  duration: 2.5, fps: 12, loop: true, bg: "field",
  options: { season: "spring", palette: null, seed: 1, tileX: 0, tileY: 0, meadow: false },
};

export function draw(p, t, o) {
  const C = fit(o.palette ?? SEASONS[o.season] ?? SEASONS.spring, 5);
  const tones = groundTones(C);
  const x0 = o.tileX * 16, y0 = o.tileY * 16;
  if (o.meadow) {
    // Broad color changes and occasional clumps leave quiet space around sprites.
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const n = noise2((x0 + x) / 30, (y0 + y) / 27, o.seed);
      p.px(x - 8, y - 12, tones[n < -.57 ? 0 : n > .57 ? 2 : 1]);
    }
    if (rand(o.tileX, o.tileY, o.seed + 82) < 0.4) {
      const x = -5 + Math.floor(rand(o.tileX, o.tileY, o.seed + 16) * 10);
      const y = -8 + Math.floor(rand(o.tileX, o.tileY, o.seed + 33) * 8);
      const bend = Math.sin(t / meta.duration * TAU) >= 0 ? 1 : 0;
      for (const [dx, dy, shade] of [[-1,0,1],[0,0,1],[-1,-1,3],[bend,-2,4],[1,-1,3]]) {
        p.px(x + dx, y + dy, C[shade]);
      }
    }
    return;
  }
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const wx = x0 + x, wy = y0 + y;
      const n = noise2(wx / 7, wy / 5, o.seed);
      p.px(x - 8, y - 12, tones[n < -.57 ? 0 : n > .57 ? 2 : 1]);
    }
  }
  const gust = Math.sin(t / meta.duration * TAU);
  for (let i = 0; i < 2; i++) {
    const x = -6 + Math.floor(rand(i + x0, y0, o.seed) * 12);
    const y = -9 + Math.floor(rand(x0, i + y0, o.seed + 7) * 12);
    const flick = Math.sin(i * 1.7 + gust * 1.15) > 0 ? 1 : -1;
    p.px(x, y, C[1]);
    p.px(x, y - 1, tones[2]);
    p.px(x + flick, y - 2, C[3]);
  }
}

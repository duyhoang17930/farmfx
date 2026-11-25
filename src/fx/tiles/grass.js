import { fit, noise2, rand, TAU } from "../../core/index.js";

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
  const x0 = o.tileX * 16, y0 = o.tileY * 16;
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const wx = x0 + x, wy = y0 + y;
      const n = o.meadow ? noise2(wx / 20, wy / 15, o.seed) : noise2(wx / 7, wy / 5, o.seed);
      const speck = rand(wx, wy, o.seed + 5);
      const shade = o.meadow ? speck < 0.027 ? 1 : n > 0.23 && speck > 0.25 ? 3 : n < -0.32 ? 1 : 2
        : speck < 0.09 ? 0 : n < 0 ? 1 : 2;
      p.px(x - 8, y - 12, C[shade]);
    }
  }
  const gust = Math.sin(t / meta.duration * TAU);
  const tufts = o.meadow ? (rand(o.tileX, o.tileY, o.seed) < 0.75 ? 2 : 1) : 5;
  for (let i = 0; i < tufts; i++) {
    const x = -6 + Math.floor(rand(i + x0, y0, o.seed) * 12);
    const y = -9 + Math.floor(rand(x0, i + y0, o.seed + 7) * 12);
    const flick = Math.sin(i * 1.7 + gust * 1.15) > 0 ? 1 : -1;
    p.px(x, y, C[0]);
    p.px(x, y - 1, C[3]);
    p.px(x + flick, y - 2, C[i % 3 === 0 ? 4 : 3]);
  }
}

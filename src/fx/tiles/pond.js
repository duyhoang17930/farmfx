import { fit, noise2, rand, TAU } from "../../core/index.js";

export const meta = {
  name: "Pond",
  desc: "A rippling 16 px pond tile with configurable banks N/E/S/W. Use empty banks for deep water.",
  tags: ["water", "pond", "shore", "tile"], size: [16, 16], origin: [8, 12],
  duration: 3, fps: 12, loop: true, bg: "field",
  options: {
    palette: ["#284958", "#326779", "#428b92", "#58a4a3", "#93c8ac"],
    bank: ["#504535", "#756044", "#a48b59"], banks: "NESW", seed: 1, tileX: 0, tileY: 0,
  },
};

export function draw(p, t, o) {
  const W = fit(o.palette, 5), B = fit(o.bank, 3);
  const banks = o.banks.toUpperCase();
  const tx = o.tileX * 16, ty = o.tileY * 16;
  const phase = t / meta.duration * TAU;
  const sw = banks.includes("W"), se = banks.includes("E");
  const sn = banks.includes("N"), ss = banks.includes("S");
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const dx = Math.min(sw ? x : 16, se ? 15 - x : 16);
      const dy = Math.min(sn ? y : 16, ss ? 15 - y : 16);
      const d = Math.min(dx, dy) - Number(dx < 3 && dy < 3);
      const X = tx + x, Y = ty + y;
      if (d < 0) continue;
      if (d < 2) {
        p.px(x - 8, y - 12, B[d === 1 ? 0 : rand(X, Y, o.seed) > 0.72 ? 2 : 1]);
        continue;
      }
      const wave = Math.sin(X * 0.35 + Y * 1.1 + phase + 3 * noise2(X / 9, Y / 7, o.seed));
      const ripple = wave > 0.84 && noise2(X / 5, Y / 4, o.seed + 4) > -0.1;
      p.px(x - 8, y - 12, W[d === 2 ? (wave > 0.4 ? 4 : 2) : ripple ? 3 : d < 5 ? 1 : 0]);
    }
  }
}

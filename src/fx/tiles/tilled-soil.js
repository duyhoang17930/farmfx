import { clamp, ease, fit, rand, TAU } from "../../core/index.js";

const DRY = ["#392620", "#593823", "#775031", "#93623b", "#ae7a4d"];
const WET = ["#2d2528", "#46312b", "#5f422f", "#77533a", "#b18b5d"];

export const meta = {
  name: "Tilled soil",
  desc: "A 16 px soil tile with dry or damp furrows. Edges N/E/S/W can join adjacent plots.",
  tags: ["soil", "wet", "tilled", "ground", "tile"], size: [16, 16], origin: [8, 12],
  duration: 2.5, fps: 12, loop: true, bg: "field",
  options: { palette: DRY, wetPalette: WET, wet: -1, edges: "NESW", seed: 1, tileX: 0, tileY: 0 },
};

export function draw(p, t, o) {
  const dry = fit(o.palette, 5), wet = fit(o.wetPalette, 5);
  const phase = t / meta.duration * TAU;
  const wetness = o.wet < 0 ? ease.inOutSine((1 - Math.cos(phase)) / 2) : clamp(o.wet);
  const edges = o.edges.toUpperCase();
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const top = y === 0 && edges.includes("N"), bottom = y === 15 && edges.includes("S");
      const west = x === 0 && edges.includes("W"), east = x === 15 && edges.includes("E");
      if ((top || bottom) && (west || east)) continue;
      const wx = x + 16 * o.tileX, wy = y + 16 * o.tileY;
      const noise = rand(wx, wy, o.seed);
      const C = rand(wx, wy, o.seed + 2) < wetness ? wet : dry;
      const ridge = [3, 2, 1, 2][y % 4];
      const color = top ? C[3] : bottom || west || east ? C[0] : C[clamp(ridge + Number(noise > 0.84) - Number(noise < 0.11), 0, 4)];
      p.px(x - 8, y - 12, color);
    }
  }
  const shimmer = Math.sin(phase + 1);
  if (wetness > 0.65 && shimmer > 0.25) {
    p.dot(-3, -4, wet[4], wetness * shimmer);
    p.dot(-2, -4, wet[4], wetness * shimmer * 0.7);
  }
}

import { blue, green, hex, mix, red } from "../../core/index.js";

const seasons = {
  spring: ["#637053", "#f8e5d1"],
  summer: ["#8b664f", "#ffe5ad"],
  autumn: ["#805759", "#f4bb81"],
  winter: ["#575b85", "#d9efff"],
};
const cache = new WeakMap();
const customCache = new WeakMap();
export const FIGURE_SEASONS = ["original", ...Object.keys(seasons)];

/** Recolor indexed art while retaining its pixel shapes and dark ink. */
export function figurePalette(palette, { season, colors } = {}) {
  const light = Object.hasOwn(seasons, season) && seasons[season];
  let tinted = palette;
  if (light) {
    if (!cache.has(palette)) cache.set(palette, new Map());
    const variants = cache.get(palette);
    if (!variants.has(season)) {
      const [shadow, highlight] = light.map(hex);
      const entries = Object.entries(palette).map(([slot, source]) => {
        const color = hex(source);
        const amount = (red(color) * 0.25 + green(color) * 0.6 + blue(color) * 0.15) / 255;
        const tone = mix(shadow, highlight, amount);
        return [slot, mix(color, tone, 0.22 * Math.min(1, amount * 2.5))];
      });
      variants.set(season, Object.fromEntries(entries));
    }
    tinted = variants.get(season);
  }
  if (!colors || typeof colors !== "object") return tinted;
  if (!customCache.has(colors)) customCache.set(colors, new WeakMap());
  const variants = customCache.get(colors);
  const entries = Object.entries(colors);
  const prior = variants.get(tinted);
  if (prior && entries.length === prior.entries.length &&
      entries.every(([slot, color], i) => slot === prior.entries[i][0] && color === prior.entries[i][1])) {
    return prior.palette;
  }
  const custom = { ...tinted, ...colors };
  variants.set(tinted, { entries, palette: custom });
  return custom;
}

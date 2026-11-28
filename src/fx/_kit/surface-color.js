// Small color measures on packed colors (r = c & 255, g = c >>> 8, b = c >>> 16), for passes that pick ramp
// neighbours from what a sprite already uses.

const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const LUT = Float32Array.from({ length: 256 }, (_, v) => lin(v));

/** CIE lightness L* (0..100). */
export function lightness(c) {
  const Y = 0.2126 * LUT[c & 255] + 0.7152 * LUT[(c >>> 8) & 255] + 0.0722 * LUT[(c >>> 16) & 255];
  return Y > 0.008856 ? 116 * Math.cbrt(Y) - 16 : 903.3 * Y;
}
/** Hue in degrees (0..360); 0 for greys. */
export function hueOf(c) {
  const r = (c & 255) / 255, g = ((c >>> 8) & 255) / 255, b = ((c >>> 16) & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (!d) return 0;
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}
/** HSV saturation (0..1). */
export function saturationOf(c) {
  const r = c & 255, g = (c >>> 8) & 255, b = (c >>> 16) & 255, mx = Math.max(r, g, b);
  return mx ? (mx - Math.min(r, g, b)) / mx : 0;
}

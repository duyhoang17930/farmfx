import { seg } from "../../core/index.js";
import { asset, RED } from "../_kit/art.js";

export function telegraphArea({ shape, heading = 0, radius: distance = 28 }) {
  const radius = Math.min(55, Math.max(0, distance));
  const start = shape === "cone" ? heading - Math.PI / 5 : 0;
  const sweep = shape === "cone" ? Math.PI * 2 / 5 : Math.PI * 2;
  if (shape === "line") {
    const X = Math.cos(heading), Y = Math.sin(heading), half = radius * 0.24;
    return [[-X, -Y], [X, Y]].flatMap(([x, y], i) =>
      [1, -1].map(side => [x * radius - y * half * side, (y * radius + x * half * side) * 0.55]));
  }
  const points = Array.from({ length: 17 }, (_, i) => {
    const a = start + sweep * i / 16;
    return [Math.cos(a) * radius, Math.sin(a) * radius * 0.55];
  });
  return shape === "cone" ? [[0, 0], ...points] : points;
}

const windup = asset({
  name: "Ground telegraph",
  desc: "A circle, a lane or a cone that fills toward the attack cue on the ground plane.",
  tags: ["combat", "warning", "area"], size: [128, 80], origin: [64, 40],
  duration: 1.1, fps: 24, loop: false, palette: RED,
  options: { shape: "circle", heading: 0, radius: 28 },
}, (p, t, C, o) => {
  if (t >= 1) return;
  const fade = 1 - seg(t, 0.87, 1);
  const area = telegraphArea(o);
  const progress = seg(t, 0, 0.82);
  const fill = area.map(([x, y]) => [x * progress, y * progress]);
  p.poly(area, C[1], fade * 0.42);
  p.poly(fill, C[2], fade * 0.58);
  p.polyline([...area, area[0]], C[4], fade);
  p.px(0, 0, C[4]);
});

export const meta = { ...windup.meta, events: { damage: 0.92, completion: 1.1 } };
export const draw = windup.draw;

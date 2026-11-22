import { showcase } from "../_kit/person.js";
import { groundShadow } from "../_kit/sprite.js";

export const meta = {
  name: "Farmer",
  desc: "A farmer in a straw hat and overalls, top-down 3/4, about 16 x 28 px. Walks or stands in four facings; facing 'all' shows them side by side.",
  tags: ["character", "person", "farmer", "walk", "idle", "four-way", "loop"],
  size: [112, 48],
  origin: [56, 40],
  duration: 1.6,
  loop: true,
  fps: 30,
  bg: "field",
  options: { facing: "all", anim: "walk", seed: 1 },
};

export function draw(p, t, o) {
  showcase(p, t, o, "farmer", groundShadow);
}

import { showcase } from "../_kit/person.js";
import { groundShadow } from "../_kit/sprite.js";

export const meta = {
  name: "Grandpa",
  desc: "An old farmer with a white beard and a straw hat. Top-down 3/4 chibi, about 16 x 24 px, walking or idle in four facings ('all' shows them side by side).",
  tags: ["character", "person", "grandpa", "walk", "idle", "four-way", "loop"],
  size: [112, 56],
  origin: [56, 48],
  duration: 1.6,
  loop: true,
  fps: 30,
  bg: "field",
  options: { facing: "all", anim: "walk", seed: 1 },
};

export function draw(p, t, o) {
  showcase(p, t, o, "grandpa", groundShadow);
}

import { drawCharacter } from "./_draw.js";

export const meta = {
  name: "Ash",
  desc: "A quiet mage with silver hair, a purple scarf and a robe. Top-down 3/4 chibi, 24 x 26 px frames, walking or idle in four facings ('all' shows them side by side).",
  tags: ["character", "person", "ash", "walk", "idle", "four-way", "loop"],
  size: [112, 56],
  origin: [56, 48],
  duration: 1.6,
  loop: true,
  fps: 30,
  bg: "field",
  options: { facing: "all", anim: "walk", season: "original", colors: null, seed: 1 },
};

export function draw(p, t, o) {
  drawCharacter(p, t, o, "ash");
}

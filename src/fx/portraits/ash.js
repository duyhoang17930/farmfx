import { drawPortrait } from "../_kit/portrait.js";

export const meta = {
  name: "Ash portrait",
  desc: "Ash's 48 x 64 bust for dialogue boxes, matching characters/ash: breathes and blinks; anim 'talk' moves the mouth, expression smile | happy | neutral | surprised.",
  tags: ["portrait", "dialogue", "face", "character", "ash", "loop"],
  size: [48, 64],
  origin: [24, 64],
  duration: 3,
  loop: true,
  fps: 30,
  bg: "light",
  options: { anim: "idle", expression: "smile", seed: 1 },
};

export function draw(p, t, o) {
  const talk = o.anim === "talk" ? (Math.floor(t * 8) % 3 === 1 ? 1 : 0) : 0;
  drawPortrait(p, "ash", { blink: t > 2.4 && t < 2.52, bob: (t + 0.3) % 1.5 > 0.75 ? 1 : 0, talk, expression: o.expression });
}

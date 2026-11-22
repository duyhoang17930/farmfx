import { drawPortrait } from "./_draw.js";

export const meta = {
  name: "Farmer portrait",
  desc: "Farmer's 40 x 48 chibi bust for dialogue boxes, matching characters/farmer: breathes and blinks; anim 'talk' moves the mouth, expression smile | happy | neutral | surprised.",
  tags: ["portrait", "dialogue", "face", "character", "farmer", "loop"],
  size: [40, 48],
  origin: [20, 48],
  duration: 3,
  loop: true,
  fps: 30,
  bg: "light",
  options: { anim: "idle", expression: "smile", season: "original", colors: null, seed: 1 },
};

export function draw(p, t, o) {
  const talk = o.anim === "talk" ? (Math.floor(t * 8) % 3 === 1 ? 1 : 0) : 0;
  drawPortrait(p, "farmer", { blink: t > 2.4 && t < 2.52, bob: (t + 0.3) % 1.5 > 0.75 ? 1 : 0, talk, expression: o.expression, colors: o.colors, season: o.season });
}

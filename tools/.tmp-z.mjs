import { loadEffect, upscale, save } from "./lib/fxlib.mjs";
import { encodePNG } from "./lib/png.mjs";
import { createFrame, painterFor, composite, backdrop, stockActor, drawActor, createFx } from "../src/core/index.js";
const ids = process.argv.slice(3), W = 150 * ids.length, H = 110, f = createFrame(W, H);
for (const [i, id] of ids.entries()) for (const [j, s] of [[0, 1], [1, 0.5]].entries()) {
  const { mod } = await loadEffect(id), x = i * 150 + 40 + s[0] * 80, y = 80;
  drawActor(painterFor(f).place(x, y), stockActor(s[0] ? 1 : 2));
  const inst = createFx(mod, { seed: 1, actor: stockActor(2), x, y, drawScale: s[1] });
  for (let t = 0; t < mod.meta.duration * 0.35; t += 1 / 30) inst.update(1 / 30);
  inst.draw(f);
}
const rgba = composite(f, new Uint8ClampedArray(W * H * 4), backdrop("field", W, H, 80, 40));
save(process.argv[2], encodePNG(W * 3, H * 3, upscale(rgba, W, H, 3)));

#!/usr/bin/env node
// Presentation shots for the set: the cast lined up at one scale on the tile grid, and two game-resolution
// mock-ups (a boss fight in the dungeon, a morning on the farm) with the HUD on top. Everything is drawn from the
// library at 1x and enlarged nearest-neighbour, so the shots show the real pixels.
//
//   node tools/showcase.mjs                     records/showcase/{cast,mockup-dungeon,mockup-farm}@4x.png
//   node tools/showcase.mjs --out DIR --scale 3

import { join } from "node:path";
import { createFrame, createFx, composite, backdrop, stockActor } from "../src/core/index.js";
import { rasterText, textWidth } from "../src/core/font.js";
import { ROOT, allIds, loadEffect, save, upscale } from "./lib/fxlib.mjs";
import { encodePNG } from "./lib/png.mjs";

const args = process.argv.slice(2), flag = (k, d) => { const i = args.indexOf("--" + k); return i < 0 ? d : args[i + 1]; };
const OUT = flag("out", join(ROOT, "records", "showcase")), K = +flag("scale", 4);
const T = 16;

/** Draw one asset at (x, y) (its ground point) at time t, as a game would: 2x effects at world scale. */
async function put(frame, id, x, y, o = {}, t) {
  const { mod } = await loadEffect(id), m = mod.meta;
  const opts = { ...m.options, seed: 1, ...(m.actor ? { actor: stockActor(m.actor === 2 ? 2 : 1), ...(m.actor === 2 ? { drawScale: 0.5 } : {}) } : {}), ...o, x, y };
  if (typeof opts.facing === "string" && !o.facing) opts.facing = "down";
  if (typeof opts.state === "string" && !o.state) opts.state = "idle";
  if ("stage" in opts && o.stage === undefined) opts.stage = 4;
  const inst = createFx(mod, opts), at = t ?? (m.loop ? m.duration * 0.3 : m.duration * 0.45);
  for (let s = 0; s < at; s += 1 / 30) inst.update(1 / 30);
  inst.draw(frame);
  return m;
}
function label(rgba, W, s, cx, y, fg = [236, 238, 244], bg = [24, 28, 38]) {
  const tw = textWidth(s, "mini"), x0 = Math.round(cx - tw / 2);
  for (let yy = y - 2; yy < y + 7; yy++) for (let xx = x0 - 2; xx < x0 + tw + 2; xx++) rgba.set([...bg, 255], (yy * W + xx) * 4);
  rasterText(s, "mini", (x, yy) => rgba.set([...fg, 255], ((y + yy) * W + x0 + x) * 4));
}
function out(name, frame, W, H, bgKind, labels = []) {
  const rgba = composite(frame, new Uint8ClampedArray(W * H * 4), bgKind ? backdrop(bgKind, W, H, 0, 0) : null);
  for (const l of labels) label(rgba, W, ...l);
  save(join(OUT, `${name}@${K}x.png`), encodePNG(W * K, H * K, upscale(rgba, W, H, K)));
  console.log(`${name}@${K}x.png  ${W}x${H} -> ${W * K}x${H * K}`);
}

// ---------------------------------------------------------------- the cast, one scale
{
  const ids = allIds();
  const rows = [
    ["player/idle", ...ids.filter((i) => i.startsWith("characters/")).slice(0, 7), "animals/chicken", "animals/cow", "animals/sheep"],
    ids.filter((i) => i.startsWith("enemies/")).slice(0, 14),
    ids.filter((i) => i.startsWith("enemies/")).slice(14, 28),
    ["player/idle", ...ids.filter((i) => i.startsWith("bosses/")).slice(0, 7)],
    ["player/idle", ...ids.filter((i) => i.startsWith("bosses/")).slice(7)],
  ];
  const W = 640, rowH = [48, 56, 56, 112, 112], H = rowH.reduce((a, b) => a + b, 0) + 16;
  const frame = createFrame(W, H), labels = [];
  let y = 8;
  for (const [r, list] of rows.entries()) {
    y += rowH[r];
    const gap = (W - 64) / list.length;
    for (const [i, id] of list.entries()) {
      const x = 32 + Math.round(gap * (i + 0.5));
      await put(frame, id, x, y - 10);
      if (r >= 3 || i % 2 === 0) labels.push([id.split("/")[1].replaceAll("-", " ").toUpperCase().slice(0, 14), x, y - 6]);
    }
  }
  out("cast", frame, W, H, "field", labels);
}

// ---------------------------------------------------------------- a boss fight in the dungeon
{
  const W = 320, H = 180, frame = createFrame(W, H);
  const DUNGEON_STONE = ["#232a38", "#3a4558", "#526073", "#6f7f92", "#a3b3c2"];
  for (let r = 0; r < 12; r++) for (let c = 0; c < 20; c++) {
    const wall = r < 2;
    await put(frame, wall ? "dungeons/dungeon-wall" : "dungeons/dungeon-floor", c * T + 8, r * T + 12,
      { tileX: c, tileY: r, ...(wall ? {} : { palette: DUNGEON_STONE }), edges: wall ? "EW" : "", corners: [] }, 0);
  }
  const scene = [
    ["dungeons/dungeon-torch", 40, 44], ["dungeons/dungeon-torch", 280, 44], ["objects/golden-chest", 296, 92],
    ["dungeons/spike-trap", 60, 150], ["dungeons/skeleton-remains", 250, 160],
    ["bosses/skeleton-king", 200, 104, { state: "attack" }], ["enemies/skeleton", 262, 128, { state: "move", facing: "left" }],
    ["enemies/bat", 120, 70, { state: "move" }], ["player/sword-attack", 140, 130], ["combat/sword-slash", 152, 130],
    ["combat/enemy-hit", 196, 96],
  ].sort((a, b) => a[2] - b[2]);
  for (const [id, x, y, o] of scene) await put(frame, id, x, y, o);
  // HUD
  await put(frame, "ui/health-bar", 52, 14, { value: 0.72 }, 0);
  await put(frame, "ui/hud/boss-health-bar", 236, 14, { value: 62, max: 100, label: "Skeleton King" }, 0);
  await put(frame, "ui/hotbar", 160, 164, { selected: 1 }, 0);
  out("mockup-dungeon", frame, W, H, null);
}

// ---------------------------------------------------------------- a morning on the farm
{
  const W = 320, H = 180, frame = createFrame(W, H);
  for (let r = 0; r < 12; r++) for (let c = 0; c < 20; c++) {
    const soil = c >= 9 && c <= 16 && r >= 6 && r <= 10, path = r === 5 && c < 18 || c === 7 && r >= 5;
    if (soil) {
      const e = (c === 9 ? "W" : "") + (c === 16 ? "E" : "") + (r === 6 ? "N" : "") + (r === 10 ? "S" : "");
      await put(frame, "tiles/tilled-soil", c * T + 8, r * T + 12, { tileX: c, tileY: r, edges: e, wet: 0.6 }, 0);
    } else if (path) {
      const e = (r === 5 && c > 0 ? "W" : "") + (r === 5 && c < 17 ? "E" : "") + (c === 7 && r > 5 ? "N" : "") + (c === 7 && r < 11 ? "S" : "") + (c === 7 && r === 5 ? "S" : "");
      await put(frame, "tiles/grass", c * T + 8, r * T + 12, { tileX: c, tileY: r }, 0);
      await put(frame, "tiles/dirt-path", c * T + 8, r * T + 12, { tileX: c, tileY: r, edges: e }, 0);
    } else await put(frame, "tiles/grass", c * T + 8, r * T + 12, { tileX: c, tileY: r }, 0);
  }
  const crops = ["crops/carrot", "crops/tomatoes", "crops/corn", "crops/cabbages", "crops/wheat", "crops/potatoes"];
  const scene = [["buildings/farmhouse", 60, 76], ["trees/oak", 300, 132], ["trees/oak", 18, 150], ["objects/shipping-bin", 108, 78],
    ["objects/mailbox", 132, 76]];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) if ((c + r) % 3 !== 2) scene.push([crops[(c + r * 2) % crops.length], 160 + c * 16, 116 + r * 16, { stage: 2 + ((c * 7 + r) % 3) }]);
  scene.push(["player/watering", 154, 134], ["farming/water", 160, 134], ["animals/chicken", 60, 126, { facing: "right" }],
    ["animals/chicken", 86, 140], ["animals/cat", 124, 110], ["fx/harvest-sparkle", 208, 148]);
  scene.sort((a, b) => a[2] - b[2]);
  for (const [id, x, y, o] of scene) await put(frame, id, x, y, o);
  await put(frame, "ui/health-bar", 52, 14, { value: 0.9 }, 0);
  await put(frame, "ui/hud/resource-counter", 252, 16, { count: 1250, label: "Gold" }, 0);
  await put(frame, "ui/hotbar", 160, 164, { selected: 2 }, 0);
  out("mockup-farm", frame, W, H, null);
}

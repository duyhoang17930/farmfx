#!/usr/bin/env node
import { join } from "node:path";
import { composite, createFrame, createFx, hex, painterFor } from "../src/core/index.js";
import { textWidth } from "../src/core/font.js";
import { allIds, loadEffect, ROOT, save, upscale } from "./lib/fxlib.mjs";
import { encodePNG } from "./lib/png.mjs";

const out = process.argv[2] ?? join(ROOT, "docs", "preview", "item-icons");
const sections = new Map();
for (const id of allIds()) {
  const [category, family] = id.split("/");
  if (!["items", "equipment", "tools", "weapons"].includes(category)) continue;
  const key = category === "items" ? `Items / ${family}` : category;
  if (!sections.has(key)) sections.set(key, []);
  sections.get(key).push({ id, ...await loadEffect(id) });
}

const title = hex("#ececf0"), label = hex("#c8c8cf"), cell = hex("#4a4b50");
const columns = 8, margin = 8, heading = 14;
const names = [...sections.values()].flat().map(({ meta }) => meta.name.toUpperCase());
const cellW = Math.max(...names.map((name) => textWidth(name, "mini"))) + 12;
const width = margin * 2 + columns * cellW;
const panels = [...sections].map(([name, assets]) => ({
  name, assets, cellH: Math.max(...assets.map(({ meta }) => meta.size[1])) + 16,
}));
const height = margin * 2 + panels.reduce((sum, { assets, cellH }) => sum + heading + Math.ceil(assets.length / columns) * cellH, 0);
const board = createFrame(width, height), p = painterFor(board);
let top = margin;

for (const { name, assets, cellH } of panels) {
  p.text(name.toUpperCase(), margin, top, title, { font: "mini" });
  top += heading;
  for (const [i, { id, meta, mod }] of assets.entries()) {
    const x = margin + (i % columns) * cellW, y = top + Math.floor(i / columns) * cellH;
    const [w, h] = meta.size, [ox, oy] = meta.origin;
    const icon = createFrame(w, h);
    const fx = createFx(mod, { x: ox, y: oy, ...("active" in meta.options ? { active: false } : {}) });
    if (meta.fps > 1) fx.update(meta.duration / 4);
    fx.draw(icon);
    if (!icon.color.some(Boolean) && !icon.light.some(Boolean)) throw new Error(`Blank preview for ${id}`);
    p.rect(x, y, cellW - 2, cellH - 2, cell);
    p.text(meta.name.toUpperCase(), x + Math.floor(cellW / 2), y + cellH - 10, label, { font: "mini", align: "center" });
    const left = x + Math.floor((cellW - w - 2) / 2), start = y + Math.floor((cellH - 12 - h) / 2);
    const rgba = composite(icon, new Uint8ClampedArray(w * h * 4), cell);
    const pixels = new Uint32Array(rgba.buffer);
    for (let row = 0; row < h; row++) board.color.set(pixels.subarray(row * w, (row + 1) * w), (start + row) * width + left);
  }
  top += Math.ceil(assets.length / columns) * cellH;
}

const rgba = composite(board, new Uint8ClampedArray(width * height * 4), hex("#36363a"));
save(`${out}.png`, encodePNG(width, height, rgba));
save(`${out}@2x.png`, encodePNG(width * 2, height * 2, upscale(rgba, width, height, 2)));
console.log(`${names.length} sprites on a neutral background at 1x and 2x`);

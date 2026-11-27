#!/usr/bin/env node
// A still of every asset in a group on one labelled sheet, for reviewing a whole family side by side.
//
//   node tools/triage-sheet.mjs trees --out records/triage --scale 2
//   node tools/triage-sheet.mjs items/raw --at 0.5
//   node tools/triage-sheet.mjs "objects/*chest*" objects/trash-bin --name chests     several patterns on one sheet
//
// Each cell shows the asset at a representative moment (a loop at --at of its duration, a one-shot at 55%) on the
// field backdrop, with its name under it, cells sized to the largest inked bounds in the group.

import { join } from "node:path";
import { mkdirSync } from "node:fs";
import { ROOT, resolveIds, loadEffect, save, upscale } from "./lib/fxlib.mjs";
import { encodePNG } from "./lib/png.mjs";
import { createFrame, createFx, painterFor, composite, stockActor, backdrop } from "../src/core/index.js";
import { rasterText, textWidth } from "../src/core/font.js";

const args = process.argv.slice(2), flags = {}, groups = [];
for (let i = 0; i < args.length; i++) args[i].startsWith("--") ? (flags[args[i].slice(2)] = args[++i]) : groups.push(args[i]);
const SCALE = +(flags.scale ?? 2), AT = +(flags.at ?? 0.35), OUT = flags.out ?? join(ROOT, "records", "triage"), COLS = +(flags.cols ?? 8);

function still(m, t, frame, x, y) {
  const o = { ...m.meta.options };
  if (m.meta.actor) o.actor = stockActor(m.meta.actor === 2 ? 2 : 1);
  if (typeof o.facing === "string") o.facing = "down";
  if (!m.draw) {
    const inst = createFx(m, { ...o, x, y });
    for (let s = 0; s < t; s += 1 / 60) inst.update(1 / 60);
    inst.draw(frame);
    return;
  }
  const p = painterFor(frame).reset();
  p.place(x, y);
  m.drawBack?.(p, t, o);
  m.draw(p, t, o);
}

const sheets = flags.name ? [[flags.name, groups]] : groups.map((g) => [g, [g]]);
for (const [g, patterns] of sheets) {
  const ids = resolveIds(patterns);
  const cells = [];
  for (const id of ids) {
    const { mod: m } = await loadEffect(id);
    const { loop, duration, size, origin } = m.meta;
    if (size[0] >= 320) continue; // screen-sized: not a sprite
    const t = loop ? duration * AT : duration * 0.55;
    const f = createFrame(size[0] + 48, size[1] + 48);
    still(m, t, f, origin[0] + 24, origin[1] + 24);
    let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    for (let y = 0; y < f.h; y++) for (let x = 0; x < f.w; x++) if ((f.color[y * f.w + x] >>> 24) > 20 || (f.light[y * f.w + x] & 0xffffff)) {
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    cells.push({ id, m, t, ink: x1 < 0 ? null : { x0, y0, x1, y1 } });
  }
  const inks = cells.filter((c) => c.ink);
  const cw = Math.min(200, Math.max(48, ...inks.map((c) => c.ink.x1 - c.ink.x0 + 13), ...cells.map((c) => textWidth(c.id.split("/").pop()) + 6)));
  const ch = Math.min(200, Math.max(40, ...inks.map((c) => c.ink.y1 - c.ink.y0 + 9))) + 9;
  const cols = Math.min(COLS, cells.length), rows = Math.ceil(cells.length / cols), W = cols * cw, H = rows * ch + 10;
  const frame = createFrame(W, H);
  const bg = backdrop?.("field", W, H);
  if (bg) frame.color.set(bg.color ?? bg);
  else frame.color.fill(0xff3a6b45);
  cells.forEach((c, i) => {
    const cx = (i % cols) * cw, cy = 10 + Math.floor(i / cols) * ch;
    if (!c.ink) return;
    const ox = c.m.meta.origin[0] + 24, oy = c.m.meta.origin[1] + 24;
    const bx = cx + Math.round((cw - (c.ink.x1 - c.ink.x0 + 1)) / 2) - c.ink.x0, by = cy + 2 + (ch - 11 - (c.ink.y1 - c.ink.y0 + 1)) - c.ink.y0;
    // draw into a copy of the cell's backdrop, so translucent shadows and smoke blend with the grass
    const sub = createFrame(cw, ch - 9, cx, cy);
    for (let y = 0; y < sub.h; y++) sub.color.set(frame.color.subarray((cy + y) * W + cx, (cy + y) * W + cx + cw), y * cw);
    still(c.m, c.t, sub, bx + ox, by + oy);
    for (let y = 0; y < sub.h; y++) {
      frame.color.set(sub.color.subarray(y * cw, y * cw + cw), (cy + y) * W + cx);
      frame.light.set(sub.light.subarray(y * cw, y * cw + cw), (cy + y) * W + cx);
    }
  });
  const rgba = composite(frame, new Uint8ClampedArray(W * H * 4), null);
  const ink = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) rgba.set(c, (y * W + x) * 4); };
  cells.forEach((c, i) => {
    const cx = (i % cols) * cw, cy = 10 + Math.floor(i / cols) * ch, name = c.id.split("/").pop(), tw = textWidth(name);
    const lx = cx + Math.round((cw - tw) / 2), ly = cy + ch - 7;
    rasterText(name, "mini", (x, y) => { ink(lx + x + 1, ly + y + 1, [20, 24, 30, 255]); });
    rasterText(name, "mini", (x, y) => ink(lx + x, ly + y, [255, 244, 214, 255]));
  });
  rasterText(g.toUpperCase() + "  " + cells.length, "mini", (x, y) => ink(2 + x, 2 + y, [255, 244, 214, 255]));
  mkdirSync(OUT, { recursive: true });
  const file = join(OUT, g.replace(/[/*?:"<>|]/g, "-") + ".png");
  save(file, encodePNG(W * SCALE, H * SCALE, upscale(rgba, W, H, SCALE)));
  console.log(g, cells.length, "->", file);
}

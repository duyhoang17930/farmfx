#!/usr/bin/env node
// GIF previews for the README: docs/preview/<category>-<name>.gif for every asset (or the ones named), then the
// grid between <!-- previews --> and <!-- /previews --> in README.md is rewritten from the GIFs on disk.
//
//   node tools/preview.mjs                  every asset
//   node tools/preview.mjs crops/carrot     just these (the grid still lists them all)
//
// Needs ffmpeg on the PATH.

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT, resolveIds, allIds, loadEffect, renderFrames, renderAct, writeVideo } from "./lib/fxlib.mjs";
import { categories } from "../src/fx/categories.js";

const DIR = join(ROOT, "docs", "preview"), args = process.argv.slice(2);
const ids = args.length ? resolveIds(args) : allIds();
let failed = 0;
for (const id of ids) {
  try {
    // an asset with an act plays acted out, the farmer and all
    const fx = await loadEffect(id), r = fx.mod.act ? renderAct(fx, { fps: fx.meta.fps }) : renderFrames(fx);
    const k = Math.max(2, Math.min(4, Math.floor(240 / Math.max(r.w, r.h))));
    const file = join(DIR, id.replace("/", "-") + ".gif");
    if (!writeVideo(file, r, k, { loops: 1 })) throw new Error("ffmpeg not found");
    console.log(`${id}  ->  ${file}`);
  } catch (e) {
    failed++;
    console.error(`${id}  FAILED: ${e.message ?? e}`);
  }
}

// the README grid: every asset that has a GIF, in catalog order, four to a row
const have = new Set(existsSync(DIR) ? readdirSync(DIR).filter((f) => f.endsWith(".gif")) : []);
const order = new Map(categories.map((c, i) => [c.id, i]));
const shown = [];
for (const id of allIds().sort((a, b) => (order.get(a.split("/")[0]) ?? 99) - (order.get(b.split("/")[0]) ?? 99) || a.localeCompare(b))) {
  const f = id.replace("/", "-") + ".gif";
  if (have.has(f)) shown.push({ id, f, name: (await loadEffect(id)).meta.name });
}
const rows = [];
for (let i = 0; i < shown.length; i += 4)
  rows.push(
    "<tr>" +
      shown
        .slice(i, i + 4)
        .map((s) => `<td align="center"><img src="docs/preview/${s.f}" width="180" alt="${s.name}"><br><code>${s.id}</code></td>`)
        .join("") +
      "</tr>",
  );
const readme = join(ROOT, "README.md");
const text = readFileSync(readme, "utf8").replace(/<!-- previews -->[\s\S]*?<!-- \/previews -->/, `<!-- previews -->\n<table>\n${rows.join("\n")}\n</table>\n<!-- /previews -->`);
writeFileSync(readme, text);
console.log(`README: ${shown.length} previews`);
process.exit(failed ? 1 : 0);

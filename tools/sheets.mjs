#!/usr/bin/env node
// Export default sheets, gameplay variants, and Tiled terrain sets.
// node tools/sheets.mjs [<id|category|pattern> ...] [--release] [--out <directory>]

import { copyFileSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { ROOT, allIds, resolveIds, loadEffect, renderFrames, spriteSheet, save } from "./lib/fxlib.mjs";
import { sheetVariants, tiledTerrain } from "./lib/sheet-variants.mjs";
import { usesReferenceArt } from "./lib/asset-rights.mjs";

const patterns = [];
let out, release = false;
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === "--out") {
    if (!process.argv[i + 1] || process.argv[i + 1].startsWith("--")) throw new Error("--out needs a directory");
    out = resolve(process.argv[++i]);
  } else if (arg === "--release") {
    release = true;
  } else if (arg.startsWith("--")) {
    throw new Error(`unknown flag: ${arg}`);
  } else {
    patterns.push(arg);
  }
}

out ??= release ? join(ROOT, "sheets", "release") : join(ROOT, "sheets");
const selected = patterns.length ? resolveIds(patterns) : allIds();
const ids = release ? selected.filter((id) => !usesReferenceArt(id)) : selected;
if (!ids.length) {
  console.error(release ? "No selected assets are included in the release export. See NOTICE.md." : "No assets selected.");
  process.exit(1);
}
if (release && existsSync(out) && readdirSync(out).some((name) => usesReferenceArt(name) || name.endsWith(".zip"))) {
  throw new Error("The release destination has local assets or archives. Choose a separate directory with --out.");
}
const indexFile = join(out, "index.json");
const existing = patterns.length && existsSync(indexFile) ? JSON.parse(readFileSync(indexFile, "utf8")) : [];
const index = new Map(existing.filter((entry) => !release || !usesReferenceArt(entry.id)).map((entry) => [entry.id, entry]));
const writeJSON = (path, value) => save(join(out, path), JSON.stringify(value, null, 1) + "\n");

function writeClip(fx, path, name, render, variant) {
  const { png, json } = spriteSheet(fx, render, name, variant);
  const image = `${path}.png`, data = `${path}.json`;
  save(join(out, image), png);
  writeJSON(data, json);
  return { ...json.meta.farmfx, image, data };
}

let variantCount = 0, terrainCount = 0;
for (const id of ids) {
  const fx = await loadEffect(id), name = id.split("/")[1];
  const entry = {
    ...writeClip(fx, id, name, renderFrames(fx, { bg: "none" })),
    desc: fx.meta.desc, tags: fx.meta.tags,
  };
  const variants = [], terrain = [];
  for (const variant of sheetVariants(fx)) {
    const { name, options, viewport } = variant;
    const render = renderFrames(fx, { bg: "none", options, viewport });
    const { id: _id, name: _name, ...clip } = writeClip(fx, `${id}/${name}`, name, render, variant);
    variants.push({ name, ...clip });
    if (variant.terrain) terrain.push({ ...variant.terrain, render });
  }
  if (terrain.length) {
    const name = "terrain", path = `${id}/${name}`;
    const { png, json } = tiledTerrain(fx, terrain, name);
    save(join(out, path + ".png"), png);
    writeJSON(path + ".tsj", json);
    entry.tileset = path + ".tsj";
    terrainCount++;
  }
  if (variants.length) entry.variants = variants;
  variantCount += variants.length;
  index.set(id, entry);
  process.stdout.write(".");
}

for (const file of ["LICENSE", "NOTICE.md"]) copyFileSync(join(ROOT, file), join(out, file));
writeJSON("index.json", [...index.values()].sort((a, b) => a.id.localeCompare(b.id)));
console.log(`\n${ids.length} default sheets, ${variantCount} variants, ${terrainCount} terrain sets -> ${out}`);

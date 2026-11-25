// node tools/adventure-sheets.mjs <staging-directory> [<group> ...]
// With no group filters, exports a complete staging directory for adventure-package.py.
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { loadEffect, renderFrames, save, spriteSheet } from "./lib/fxlib.mjs";
import { sheetVariants } from "./lib/sheet-variants.mjs";

const [stage, ...selected] = process.argv.slice(2);
if (!stage) throw new Error("A staging directory is required");
const out = resolve(stage);
const groups = JSON.parse(readFileSync(new URL("./lib/adventure-groups.json", import.meta.url)));
const toolIds = ["axe", "fishing-rod", "hammer", "pickaxe", "scythe", "shovel", "watering-can"];
const visualGroups = Object.keys(groups).filter((name) => name !== "audio");
for (const name of selected) {
  if (!visualGroups.includes(name) && name !== "tool-upgrades") throw new Error(`Unknown group: ${name}`);
}

function writeClip(fx, prefix, relativePath, name, variant) {
  const render = renderFrames(fx, { bg: "none", options: variant?.options, viewport: variant?.viewport });
  const { png, json } = spriteSheet(fx, render, name, variant);
  const image = `${prefix}${relativePath}.png`, data = `${prefix}${relativePath}.json`;
  const gif = `gif/${prefix === "sprites/" ? "" : prefix}${relativePath}.gif`;
  save(join(out, image), png);
  save(join(out, data), JSON.stringify(json));
  return { ...json.meta.farmfx, image, data, gif };
}

async function exportEntry(id, prefix) {
  const fx = await loadEffect(id);
  const entry = writeClip(fx, prefix, id, id.split("/").at(-1));
  entry.variants = sheetVariants(fx).map((variant) => ({
    ...writeClip(fx, prefix, `${id}/${variant.name}`, variant.name, variant),
    name: variant.name,
  }));
  return entry;
}

for (const group of selected.length ? selected : [...visualGroups, "tool-upgrades"]) {
  const upgrades = group === "tool-upgrades";
  const entries = [];
  for (const name of upgrades ? toolIds : groups[group]) {
    entries.push(await exportEntry(`${upgrades ? "tools" : group}/${name}`, upgrades ? "tool-upgrades/" : "sprites/"));
  }
  const manifest = upgrades ? "tool-upgrades/index.json" : `groups/${group.replaceAll("/", "-")}.json`;
  save(join(out, manifest), JSON.stringify(upgrades ? entries : { group, entries }));
  console.log(`${group} | ${entries.length} assets`);
}

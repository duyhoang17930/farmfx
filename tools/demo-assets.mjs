import { spawnSync } from "node:child_process";
import { ROOT } from "./lib/fxlib.mjs";

const assets = [
  "exploration/target-brackets", "exploration/island-shore", "exploration/coastal-shore",
  "fx/build-footprint", "fx/loot-flight", "fx/woodcut-impact", "fx/ore-pick-impact", "fx/stone-pick-impact",
  "fx/wildflower-pick", "fx/resource-respawn", "fx/build-placement", "fx/crafting-complete", "fx/power-pulse",
  "combat/ground-telegraph", "combat/sword-slash", "combat/enemy-hit", "exploration/island-unlock-reveal",
  "ui/components/touch-action",
  "objects/mist-beacon", "objects/coastal-dock", "objects/weather-workbench", "objects/coastal-bench", "objects/coastal-waypost",
  "trees/wind-pine", "trees/wind-pine-fall",
  "resources/coastal-iron-seam", "resources/coastal-copper-node", "resources/coastal-gold-node", "resources/coastal-boulder",
  "resources/mushroom", "resources/red-mushroom", "machines/coastal-kiln",
  "tiles/coastal-boardwalk", "tiles/coastal-wildflowers", "biomes/crystal/crystal-cluster",
  "animals/butterfly", "animals/turtle", "enemies/crystal-guardian",
  "items/raw/wood", "items/raw/stone", "items/raw/iron-ore", "items/raw/copper-ore", "items/raw/gold-ore",
  "items/processed/iron-ingot", "items/seeds/flower-seed", "items/special/coin", "items/special/magic-orb", "items/gems/quartz",
  "player/idle", "player/walk", "player/axe-swing", "player/pickaxe-swing", "player/sword-attack", "player/dash",
  "player/building", "player/hurt", "player/harvesting",
];

const result = spawnSync(process.execPath, ["tools/sheets.mjs", ...assets, "--release", "--out", "sheets/mist-station"], {
  cwd: ROOT,
  stdio: "inherit",
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;

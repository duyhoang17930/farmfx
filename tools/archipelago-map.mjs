#!/usr/bin/env node
// A whole archipelago laid out from the library, as one overview picture: every island shows one biome or trade,
// and as many of the assets as fit sit where they belong (crops in tilled rows, machines on the factory floor,
// fish in the sea, items laid out in the bazaar), with effects, weather and light where they would happen.
//
//   node tools/archipelago-map.mjs                 records/mist-station/toan-canh-quan-dao.png (+ @2x, + .json)
//   node tools/archipelago-map.mjs --scale 3 --labels --no-weather
//
// Placement packs each zone by the sprites' real pixel bounds, so no two sprites overlap. Anything that does not fit
// is listed at the end, along with the assets the map leaves out.

import { join } from "node:path";
import { writeFileSync } from "node:fs";
import { createFrame, createFx, painterFor, composite, ramp, stockActor } from "../src/core/index.js";
import { rasterText } from "../src/core/font.js";
import { ROOT, allIds, loadEffect, save, upscale } from "./lib/fxlib.mjs";
import { encodePNG } from "./lib/png.mjs";
import { SEA_COLORS } from "../src/fx/tiles/coastal-pond.js";

const args = process.argv.slice(2);
const flag = (k, d) => { const i = args.indexOf("--" + k); return i < 0 ? d : args[i + 1]; };
const SCALE = +flag("scale", 2), LABELS = args.includes("--labels"), WEATHER = !args.includes("--no-weather");
const OUT = flag("out", join(ROOT, "records", "mist-station", "toan-canh-quan-dao"));

const T = 16, MW = 112, MH = 127, W = MW * T, H = MH * T;
const tx = (c) => c * T + 8, ty = (r) => r * T + 12;

// ---------------------------------------------------------------- modules and stills
const ALL = allIds(), HAVE = new Set(ALL);
const mods = new Map();
async function mod(id) {
  if (!mods.has(id)) mods.set(id, (await loadEffect(id)).mod);
  return mods.get(id);
}
const hash = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) / 4294967296; };

/** The options a still picture wants: facing the viewer, idle, grown, switched on. */
function stillOptions(m, id, extra = {}) {
  const o = { ...m.meta.options };
  if (typeof o.facing === "string" && ["down", "all", "left", "right", "up"].includes(o.facing)) o.facing = "down";
  if ("anim" in o) o.anim = "idle";
  if (typeof o.state === "string") o.state = "idle";
  if ("stage" in o) o.stage = id.startsWith("crops/coastal") ? 2 : 4;
  if ("active" in o) o.active = true;
  if ("unlocked" in o) o.unlocked = true;
  return { ...o, ...extra };
}
function stillTime(m, id, at) {
  const { loop, duration } = m.meta;
  if (at !== undefined) return loop ? at % duration : Math.min(at, duration);
  return loop ? (0.35 + hash(id) * 2.3) % duration : duration * 0.55;
}

function paint(frame, m, t, x, y, o, fade = 1) {
  if (!m.draw) { // a stateful effect: run it forward to the moment
    const inst = createFx(m, { ...o, x: Math.round(x), y: Math.round(y) });
    for (let s = 0; s < t; s += 1 / 30) inst.update(1 / 30);
    inst.draw(frame);
    return;
  }
  const p = painterFor(frame);
  p.place(Math.round(x), Math.round(y));
  p.fade = fade;
  m.drawBack?.(p, t, o);
  m.draw(p, t, o);
}

const bounds = new Map();
/** Opaque pixel bounds of one still, relative to where it is placed. */
async function boundsOf(key, id, o, t) {
  if (bounds.has(key)) return bounds.get(key);
  const m = await mod(id), [w, h] = m.meta.size, [ox, oy] = m.meta.origin, pad = 24;
  const f = createFrame(w + pad * 2, h + pad * 2);
  paint(f, m, t, ox + pad, oy + pad, o);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (let y = 0; y < f.h; y++) for (let x = 0; x < f.w; x++) {
    if ((f.color[y * f.w + x] >>> 24) < 40) continue;
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  const b = x1 < 0 ? null : { x0: x0 - ox - pad, y0: y0 - oy - pad, x1: x1 - ox - pad + 1, y1: y1 - oy - pad + 1 };
  bounds.set(key, b);
  return b;
}

let rs = 7;
const rnd = () => ((rs = (Math.imul(rs, 1103515245) + 12345) >>> 0) / 4294967296);

// ---------------------------------------------------------------- islands
// rect is in tiles, inclusive. ground paints the inside, shore the rim (edges and corners face the sea).
const GL = "biomes/grassland";
const islands = [
  { name: "Đảo Tuyết", rect: [1, 1, 24, 28], ground: "biomes/snowland/snow-ground", shore: "biomes/snowland/snow-shore", weather: ["weather/snow"] },
  { name: "Đảo Pha Lê", rect: [27, 1, 45, 25], ground: "biomes/crystal/crystal-ground", shore: "biomes/crystal/crystal-shore", weather: ["weather/starry-night"] },
  { name: "Thị Trấn", rect: [48, 1, 84, 30], ground: `${GL}/grass-ground`, shore: `${GL}/grass-shore`, weather: ["weather/sun-rays"] },
  { name: "Nghĩa Địa", rect: [87, 1, 110, 27], ground: "biomes/graveyard/dark-ground", shore: "biomes/graveyard/dark-shore", weather: ["weather/fog"] },
  { name: "Rừng Già", rect: [1, 31, 26, 64], ground: `${GL}/grass-ground`, shore: `${GL}/grass-shore`, weather: ["weather/falling-leaves"] },
  { name: "Nông Trại", rect: [29, 31, 70, 66], ground: "tiles/grass", shore: "exploration/coastal-shore", weather: ["weather/pollen"] },
  { name: "Khu Công Nghiệp", rect: [73, 30, 110, 63], ground: `${GL}/dirt-ground`, shore: `${GL}/grass-shore`, weather: ["weather/cloud-shadow"] },
  { name: "Đảo Nhiệt Đới", rect: [2, 68, 20, 97], ground: "biomes/tropical/tropical-ground", shore: "biomes/tropical/tropical-shore", weather: ["weather/rainbow"] },
  { name: "Sa Mạc", rect: [24, 69, 43, 97], ground: "biomes/desert/desert-ground", shore: "biomes/desert/desert-shore", weather: ["weather/floating-dust"] },
  { name: "Đầm Lầy", rect: [46, 69, 63, 97], ground: "biomes/swamp/mud-ground", shore: "biomes/swamp/swamp-shore", weather: ["weather/fireflies"] },
  { name: "Núi Lửa", rect: [66, 67, 85, 97], ground: "biomes/volcanic/volcanic-ground", shore: "biomes/volcanic/lava-shore", weather: ["weather/floating-embers"] },
  { name: "Hầm Ngục", rect: [88, 66, 110, 97], ground: "biomes/graveyard/cracked-ground", shore: "biomes/graveyard/dark-shore", weather: [] },
  { name: "Chợ Phiên", rect: [2, 101, 109, 125], ground: "tiles/grass-summer", shore: "exploration/coastal-shore", weather: [] },
];

const landAt = new Int8Array(MW * MH).fill(-1);
for (const [k, isl] of islands.entries()) {
  const [x0, y0, x1, y1] = isl.rect, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = (x1 - x0) / 2 + 0.5, ry = (y1 - y0) / 2 + 0.5;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const nx = Math.abs(x - cx) / rx, ny = Math.abs(y - cy) / ry;
    const wob = Math.sin(x * 0.83 + k * 3) * 0.07 + Math.cos(y * 0.71 + k) * 0.07 + Math.sin((x + y) * 0.37 + k * 5) * 0.05;
    if (nx ** 3.4 + ny ** 3.4 <= 1 + wob) landAt[y * MW + x] = k;
  }
}
const land = (x, y) => x >= 0 && y >= 0 && x < MW && y < MH ? landAt[y * MW + x] : -1;

// tiles painted over the island floor. edges: "rim" (border faces outward), "links" (sides that continue),
// "joins" (same, as the coastal field names it), "pond" (banks + corners).
const patches = [];
const patch = (id, x0, y0, x1, y1, o = {}, how = {}) => patches.push({ id, r: [x0, y0, x1, y1], o, ...how });
const blocked = new Uint8Array(MW * MH);

// zones: where each asset goes. An entry is "id" or ["id", options, count, time].
// grid packs rows and centres the block, scatter places at random, sea wants water under the sprite.
const zones = [];
const zone = (rect, entries, mode = "scatter", gap = 2) => zones.push({ rect, entries, mode, gap });
const ids = (prefix) => ALL.filter((id) => id.startsWith(prefix));
const used = new Set();

// ---- Snow
patch("biomes/snowland/deep-snow", 4, 5, 9, 8);
patch("biomes/snowland/ice-ground", 14, 18, 20, 22);
patch("biomes/snowland/frozen-pond", 14, 5, 19, 8, {}, { edges: "rim", block: true });
patch("tiles/grass-winter", 4, 21, 8, 24);
patch("tiles/grass-to-snow", 4, 20, 8, 20, { edges: "N", corners: [] });
patch("tiles/snow-to-ice", 13, 18, 13, 22, { edges: "E", corners: [] });
patch("biomes/snowland/ice-cliff", 3, 13, 10, 13, { edges: "S", corners: [] }, { block: true });
zone([2, 2, 23, 27], [
  "bosses/frost-dragon", "bosses/ice-giant", "buildings/watchtower", ["trees/snow-covered-tree", {}, 6],
  ["trees/pine", { season: "winter" }, 3], ["biomes/snowland/icicle", {}, 3], ["biomes/snowland/snow-rock", {}, 3],
  ["animals/penguin", {}, 3], "enemies/snow-wolf", "enemies/ice-golem", "enemies/ice-elemental", "player/sleeping",
  "objects/lamp", "tools/grappling-hook",
]);

// ---- Crystal
patch("biomes/crystal/crystal-water", 30, 15, 34, 18, {}, { block: true });
patch("tiles/crystal-floor", 37, 6, 42, 9);
patch("biomes/crystal/crystal-cliff", 36, 20, 42, 20, { edges: "S", corners: [] }, { block: true });
zone([28, 2, 44, 24], [
  "bosses/crystal-golem", "buildings/magic-tower", "buildings/portal-building", "exploration/magical-portal",
  "exploration/teleport-gate", "exploration/fast-travel-point", "objects/mist-beacon", "objects/crystal-chest",
  "machines/enchanting-table", "machines/alchemy-station", "machines/teleporter", "dungeons/magic-crystal",
  "trees/crystal-tree", "trees/magical-tree", ["biomes/crystal/crystal-cluster", {}, 3], "biomes/crystal/crystal-rock",
  ["biomes/crystal/crystal-grass", {}, 2], ["biomes/crystal/glowing-flower", {}, 3], "enemies/crystal-slime",
  "enemies/crystal-guardian", "resources/amethyst-deposit", "resources/crystal-deposit", "resources/emerald-deposit",
  "resources/ruby-deposit", "resources/sapphire-deposit", ["tiles/mist-fern", {}, 2], "player/magic-cast",
  "player/teleport", "animals/firefly",
]);

// ---- Town: a stone road cross, a marble square, a walled stone yard where the cast meets
patch("tiles/stone-path", 50, 12, 82, 12, {}, { edges: "links", block: true });
patch("tiles/stone-path", 66, 2, 66, 29, {}, { edges: "links", block: true });
patch("tiles/marble-floor", 62, 13, 70, 18, {}, { edges: "rim" });
patch("tiles/stone-floor", 52, 21, 64, 28, {}, { edges: "rim" });
patch("tiles/brick-floor", 68, 21, 80, 28, {}, { edges: "rim" });
patch("tiles/stone-wall", 52, 20, 64, 20, {}, { edges: "links", block: true });
patch("tiles/stone-gate", 58, 20, 58, 20, { open: true });
patch("tiles/stone-stairs", 65, 24, 65, 25);
zone([49, 1, 65, 11], ["buildings/tavern", "buildings/clock-tower", "buildings/town-hall", "buildings/bank-building",
  "buildings/library", "buildings/museum"], "grid", 2);
zone([67, 1, 83, 11], ["buildings/bakery", "buildings/restaurant", "buildings/clothing-shop", "buildings/seed-shop",
  "buildings/merchant-house", "buildings/shop"], "grid", 3);
zone([62, 13, 70, 18], ["objects/fountain", "objects/statue", "objects/bench", "objects/coastal-bench", "objects/flag",
  "objects/banner"], "grid", 3);
zone([49, 13, 61, 19], ["buildings/blacksmith", "buildings/weapon-shop", "buildings/well", "objects/notice-board",
  "objects/quest-board"], "grid", 2);
zone([71, 13, 83, 20], ["machines/bank", "machines/coin-mint", "objects/donation-box", "objects/trash-bin",
  "objects/flower-pot", "objects/street-lamp", "objects/signpost", "objects/mailbox", "objects/lamp",
  ["objects/street-lamp", {}, 1]], "grid", 3);
zone([52, 21, 64, 28], ids("characters/").slice(0, 10), "scatter", 3);
zone([68, 21, 80, 28], ids("characters/").slice(10), "scatter", 3);
zone([49, 21, 83, 29], ["animals/cat", "animals/dog", "animals/songbird", "objects/street-lamp"], "scatter", 2);

// ---- Graveyard
patch("biomes/graveyard/dark-ground", 95, 10, 104, 18);
patch("tiles/iron-fence", 94, 9, 105, 9, {}, { edges: "links", block: true });
patch("biomes/graveyard/dark-cliff", 89, 22, 95, 22, { edges: "S", corners: [] }, { block: true });
zone([88, 1, 109, 8], ["buildings/church", "buildings/shrine", "buildings/abandoned-house", "trees/dead-tree",
  "objects/torch", "animals/owl"], "grid", 3);
zone([95, 10, 104, 19], [["biomes/graveyard/grave", {}, 4], ["biomes/graveyard/tombstone", {}, 4],
  "dungeons/skeleton-remains", "biomes/graveyard/graveyard-gate"], "grid", 2);
zone([88, 10, 109, 26], ["bosses/skeleton-king", "biomes/graveyard/iron-fence", "trees/burnt-tree", "trees/dead-tree",
  "enemies/skeleton", "enemies/skeleton-archer", "enemies/skeleton-knight", "enemies/zombie", "enemies/ghost",
  "enemies/dark-spirit", "enemies/vampire-bat", "enemies/goblin-warrior", "animals/crow", "tiles/iron-gate", "dungeons/cobweb", "player/death",
  "player/respawn"]);

// ---- Forest: a river from a waterfall to the sea, a pond, a grass ridge
patch("tiles/river", 13, 38, 13, 61, { facing: "north-south" }, { block: true });
patch("tiles/river-mouth", 13, 62, 13, 63, {}, { edges: "rim", block: true });
patch("tiles/wooden-bridge", 12, 48, 14, 48, { facing: "east-west" });
patch("tiles/coastal-pond", 2, 51, 8, 56, {}, { edges: "banks", block: true });
patch(`${GL}/flower-ground`, 17, 34, 22, 38);
patch(`${GL}/dirt-ground`, 3, 41, 8, 44);
patch("tiles/grass-to-dirt", 3, 40, 8, 40, { edges: "S", corners: [] });
patch(`${GL}/grass-cliff`, 16, 57, 22, 57, {}, { edges: "rim", block: true });
zone([10, 32, 16, 37], ["tiles/waterfall"], "grid");
zone([2, 51, 8, 56], ["animals/koi-fish", "animals/frog", "animals/turtle", ["biomes/swamp/lily-pad", {}, 2]], "sea", 2);
zone([2, 32, 25, 63], [
  "bosses/ancient-tree-guardian", "bosses/goblin-king", "buildings/cave-entrance", "buildings/hunter-hut",
  "buildings/lumber-house", "trees/falling-tree", "trees/wind-pine-fall", "trees/oak", "trees/pine", "trees/birch",
  "trees/maple", "trees/willow", "trees/wind-pine", "trees/mushroom-tree", "trees/fruit-tree", "trees/sapling",
  "trees/tree-regrowth", ["trees/oak", {}, 3], ["trees/pine", {}, 3], "tiles/stump", "tiles/fallen-log",
  "tiles/berry-bush", "tiles/weeds", "tiles/wildflowers", "tiles/coastal-wildflowers", ["biomes/grassland/tall-grass", {}, 3],
  "tiles/rock", "resources/mushroom", "resources/red-mushroom", "resources/fiber-bush", "resources/cotton-bush",
  "resources/bamboo", "animals/deer", "animals/fox", "animals/rabbit", "animals/squirrel", "animals/raccoon",
  "animals/butterfly", "animals/ladybug", "animals/snail", "animals/bee", "animals/eagle", "animals/dragonfly",
  "enemies/wolf", "enemies/angry-boar", "enemies/mushroom-monster", "enemies/carnivorous-plant",
  "enemies/corrupted-tree", "enemies/giant-bee", "enemies/green-slime", "enemies/goblin", "enemies/goblin-archer",
  "objects/campfire", "objects/wood-pile", "exploration/exploration-flag",
  "exploration/buried-treasure", "exploration/hidden-treasure-marker", "player/axe-swing",
  "player/bow-aim", "player/climbing", "tools/bug-net", "tools/chainsaw",
]);

// ---- Farm: dirt lanes, tilled rows, a pond, an open-air cottage room, the paddock
patch("tiles/dirt-path", 31, 44, 68, 44, {}, { edges: "links", block: true });
patch("tiles/dirt-path", 49, 32, 49, 65, {}, { edges: "links", block: true });
patch("tiles/wooden-stairs", 49, 31, 49, 31);
patch("tiles/tilled-soil", 51, 46, 67, 55, {}, { edges: "rim" });
patch("tiles/farmland-edge", 51, 56, 66, 56, { edges: "S", corners: [] });
patch("tiles/farmland-corner", 67, 56, 67, 56);
patch("tiles/coastal-field", 51, 58, 67, 58, { wet: true }, { edges: "joins" });
patch("tiles/grass-autumn", 38, 58, 47, 64);
patch("tiles/wooden-floor", 31, 46, 42, 55, {}, { edges: "rim" });
patch("tiles/wooden-wall", 31, 45, 42, 45, {}, { edges: "links" });
zone([30, 32, 48, 43], ["buildings/farmhouse-deluxe", "buildings/farmhouse", "buildings/farmhouse-upgrade",
  "buildings/barn", "buildings/upgraded-barn", "buildings/silo", "buildings/stable", "buildings/storage-shed",
  "buildings/workshop", "buildings/well"], "grid", 3);
zone([50, 32, 69, 43], ["buildings/windmill", "buildings/greenhouse", "buildings/upgraded-greenhouse",
  "buildings/chicken-coop", "buildings/upgraded-coop", "buildings/duck-house", "buildings/coastal-farmstead",
  "buildings/animal-shelter", "machines/auto-feeder", "machines/auto-collector"], "grid", 3);
zone([51, 46, 67, 55], ids("crops/").map((id) => [id, {}, 1]).concat(
  [0, 1, 2, 3].map((s) => ["crops/carrot", { stage: s }, 1]), [0, 1, 2, 3].map((s) => ["crops/wheat", { stage: s }, 1])), "grid", 1);
zone([51, 59, 67, 65], ["tools/scarecrow", "tools/sprinkler", "tools/advanced-sprinkler", "tools/golden-sprinkler",
  "tools/irrigation-pipe", "machines/auto-planter", "machines/auto-harvester", "player/hoe-swing", "player/watering",
  "player/sowing", "player/harvesting", "player/scythe-swing", "player/shovel-dig", "objects/water-pump",
  "objects/water-tank", "exploration/locked-plot"], "grid", 2);
zone([31, 45, 42, 47], ["objects/wooden-door", "objects/window", "objects/wall-clock", "objects/painting"], "grid", 1);
zone([31, 46, 42, 55], ["objects/double-bed", "objects/bed", "objects/bookshelf", "objects/wardrobe", "objects/cabinet",
  "objects/fireplace", "objects/stove", "objects/refrigerator", "objects/kitchen-counter", "objects/dining-table",
  "objects/wooden-table", "objects/chair", "objects/stool", "objects/rug", "objects/carpet",
  "player/eating", "player/drinking",
  "player/waking-up"], "grid", 1);
zone([43, 46, 48, 57], ["buildings/sheep-pen", "buildings/pigsty"], "grid", 2);
zone([30, 56, 48, 65], [
  "animals/cow", "animals/calf", "animals/horse", "animals/donkey", "animals/goat", "animals/sheep", "animals/lamb",
  "animals/pig", "animals/piglet", "animals/chicken", "animals/chick", "animals/rooster", "animals/turkey",
  "animals/duck", "animals/duckling", "animals/goose", "animals/coastal-livestock", "objects/beehive",
  "objects/hay-bale", "objects/feeding-trough", "objects/shipping-bin", "objects/wheelbarrow", "objects/barrel",
  "objects/crate", ["tiles/fence", {}, 3], "tiles/stone-fence",
  "player/item-carry", "tools/milking-bucket", "tools/shears", "player/idle", "player/walk",
]);

// ---- Industry: factory floor with a conveyor line, a quarry, the big buildings
patch("tiles/metal-floor", 75, 32, 108, 46, {}, { edges: "rim" });
patch("tiles/metal-wall", 75, 31, 108, 31, {}, { edges: "links" });
patch("machines/conveyor-belt", 77, 46, 101, 46, { facing: "east" }, { block: true });
patch("machines/conveyor-splitter", 84, 46, 84, 46, { facing: "east" });
patch("machines/conveyor-merger", 93, 46, 93, 46, { facing: "east" });
patch("machines/conveyor-corner", 102, 46, 102, 46, { facing: "east", turn: "left" }, { block: true });
patch("tiles/stone-floor", 75, 49, 92, 61, {}, { edges: "rim" });
patch("tiles/dirt-to-stone", 75, 48, 92, 48, { edges: "S", corners: [] });
patch("tiles/grass-to-stone", 93, 49, 93, 61, { edges: "W", corners: [] });
patch("tiles/brick-wall", 94, 48, 108, 48, {}, { edges: "links" });
const factory = ids("machines/").filter((id) => !/conveyor|bank|coin-mint|enchanting|alchemy|teleporter|auto-|fish-trap|oil-pump|solar|blast|advanced-furnace|forge|smelter|charcoal|brewing/.test(id));
zone([75, 32, 108, 45], factory, "grid", 3);
zone([94, 49, 109, 62], ["buildings/factory-building", "buildings/power-station", "buildings/warehouse",
  "buildings/mining-house", "buildings/laboratory", "player/building"], "grid", 3);
zone([75, 49, 92, 62], ["bosses/stone-titan", "enemies/stone-golem", "objects/workbench", "buildings/mine-entrance", "objects/minecart", "objects/minecart-track",
  "objects/stone-pile", "objects/resource-crate", "objects/wooden-pallet", "objects/large-storage-chest",
  "objects/metal-door", ...["coal-ore", "copper-ore", "iron-ore", "gold-ore", "silver-ore", "tin-ore", "titanium-ore",
    "limestone-deposit", "sandstone-deposit", "clay-deposit", "salt-deposit", "coastal-boulder", "coastal-copper-node",
    "coastal-gold-node", "coastal-iron-seam"].map((r) => "resources/" + r), "exploration/ore-deposit",
  "enemies/lightning-elemental", "player/pickaxe-swing", "player/hammer-swing", "player/pushing",
  "player/pulling", "objects/crafting-table", "player/crafting"]);

// ---- Tropical: sand, a pier, the sea creatures off shore
patch("biomes/tropical/beach-sand", 3, 86, 19, 96);
patch("tiles/sand", 4, 84, 17, 85);
patch("tiles/grass-to-sand", 4, 83, 17, 83, { edges: "S", corners: [] });
patch("biomes/tropical/tropical-cliff", 4, 79, 9, 79, { edges: "S", corners: [] }, { block: true });
patch("tiles/wooden-dock", 20, 80, 22, 80, { facing: "east-west" });
zone([3, 69, 19, 82], ["buildings/fish-farm", "buildings/fishing-hut", "trees/palm", ["trees/palm", {}, 2],
  "trees/bamboo-tree", "biomes/tropical/tropical-flower", ["biomes/tropical/tropical-grass", {}, 2],
  "biomes/tropical/tropical-rock", "animals/parrot", "objects/coastal-waypost", "objects/coastal-bench",
  "machines/fish-trap"]);
zone([3, 84, 19, 96], ["biomes/tropical/coral", "resources/seashell", "resources/seaweed", "resources/driftwood",
  "animals/crab", "animals/turtle", "exploration/boat-dock", "objects/coastal-dock", "objects/coastal-supplies",
  "player/fishing-cast", "player/fishing-wait", "player/fishing-reel", "player/fishing-catch", "tools/fishing-rod",
  "tools/fishing-bait", "tools/fishing-hook", "player/jump", "player/landing"]);
zone([0, 64, 27, 100], ["animals/fish", "animals/jellyfish", "animals/octopus", "animals/pufferfish", "animals/salmon",
  "animals/tuna", "animals/lobster", "exploration/boat", "exploration/sailing-boat", "exploration/raft",
  "exploration/fishing-spot", "player/swimming", "exploration/secret-island"], "sea", 6);

// ---- Desert
patch("biomes/desert/cracked-sand", 27, 86, 34, 92);
patch("biomes/desert/desert-cliff", 29, 76, 38, 76, { edges: "S", corners: [] }, { block: true });
zone([25, 70, 42, 96], ["bosses/desert-pharaoh", "bosses/sand-worm-queen", "buildings/temple", "biomes/desert/oasis",
  ["biomes/desert/sand-dune", {}, 3], ["biomes/desert/dried-bush", {}, 3], "biomes/desert/sandstone-rock",
  ["resources/cactus", {}, 4], "resources/fossil-deposit", "resources/bone-pile", "resources/meteorite",
  "exploration/fossil-discovery", "exploration/artifact-discovery", "exploration/cave-discovery", "exploration/secret-door",
  "enemies/scorpion", "enemies/sand-worm", "enemies/mummy", "machines/oil-pump", "machines/solar-panel",
  "dungeons/ancient-statue", "exploration/treasure-dig", "tools/treasure-detector", "tools/magnifying-glass", "tools/compass", "player/dash",
  "player/sprint"]);

// ---- Swamp
patch("biomes/swamp/swamp-water", 49, 80, 55, 86, {}, { block: true });
patch("biomes/swamp/swamp-cliff", 50, 74, 58, 74, { edges: "S", corners: [] }, { block: true });
zone([49, 80, 55, 86], [["biomes/swamp/lily-pad", {}, 3], "animals/frog"], "sea", 2);
zone([47, 70, 62, 96], ["bosses/slime-king", "bosses/giant-spider", "buildings/potion-shop",
  ["biomes/swamp/swamp-grass", {}, 3], ["biomes/swamp/swamp-vines", {}, 2], "biomes/swamp/swamp-rock",
  "enemies/swamp-monster", "enemies/poison-slime", "enemies/poison-spider", "enemies/spider", "enemies/blue-slime",
  "enemies/red-slime", "machines/brewing-station", "trees/willow", "animals/firefly", "player/stunned", "player/hurt",
  "player/knockback"]);

// ---- Volcano: lava river and the fire bosses
patch("biomes/volcanic/burnt-ground", 68, 70, 74, 76);
patch("biomes/volcanic/lava-river", 76, 72, 77, 94, {}, { edges: "rim", block: true });
patch("biomes/volcanic/lava-tile", 70, 88, 73, 91, {}, { block: true });
patch("biomes/volcanic/volcanic-cliff", 79, 71, 84, 71, { edges: "S", corners: [] }, { block: true });
zone([75, 67, 79, 72], ["biomes/volcanic/lava-waterfall"], "grid");
zone([67, 68, 84, 96], ["bosses/fire-dragon", "bosses/lava-titan", "bosses/ancient-demon",
  ["biomes/volcanic/volcanic-rock", {}, 3], "resources/obsidian-deposit", "resources/sulfur-deposit", "trees/burnt-tree",
  "enemies/fire-elemental", "enemies/lava-golem", "enemies/mini-dragon", "enemies/demon", "machines/blast-furnace",
  "machines/advanced-furnace", "machines/forge", "machines/smelter", "machines/charcoal-kiln", "objects/brazier",
  "objects/furnace", "player/shield-block", "player/dodge-roll"]);

// ---- Dungeon: walled floor full of traps, puzzles and the last bosses
patch("dungeons/dungeon-floor", 91, 70, 108, 94, {}, { edges: "rim" });
patch("dungeons/dungeon-wall", 91, 69, 108, 69, {}, { edges: "links" });
patch("dungeons/dungeon-wall-corner", 90, 69, 90, 69);
patch("dungeons/cracked-floor", 94, 88, 98, 92);
patch("dungeons/dungeon-stairs", 106, 92, 107, 93);
zone([91, 70, 108, 94], ["buildings/dungeon-entrance", "bosses/dark-wizard",
  ...ids("dungeons/").filter((id) => !/floor$|wall$|stairs|cracked-floor|magic-crystal|ancient-statue|skeleton-remains|cobweb|wall-corner/.test(id)),
  "enemies/dark-knight", "enemies/mimic-chest", "enemies/bat", "objects/treasure-chest", "objects/golden-chest",
  "objects/silver-chest", "objects/locked-chest", "objects/chest", "objects/stone-door", "player/sword-attack",
  "player/sword-combo", "player/heavy-attack", "player/spear-attack", "player/bow-shoot", "player/celebration",
  "player/level-up", "player/item-pickup", "player/item-throw", "player/run",
], "grid", 2);

// ---- Bazaar: one mat per item family, the armoury, the tool rack, the stalls, a plot for sale, terrain swatches
const families = ["raw", "seeds", "produce", "food", "processed", "components", "gems", "animal", "consumables", "special"];
families.forEach((f, i) => {
  const x = 5 + (i % 5) * 9, y = i < 5 ? 103 : 113;
  patch(i % 2 ? "tiles/brick-floor" : "tiles/wooden-floor", x, y, x + 7, y + 7, {}, { edges: "rim" });
  zone([x, y, x + 7, y + 7], ids(`items/${f}/`), "grid", 3);
});
patch("tiles/marble-floor", 51, 102, 62, 112, {}, { edges: "rim" });
zone([51, 102, 62, 112], ids("weapons/"), "grid", 1);
patch("tiles/marble-floor", 51, 113, 62, 123, {}, { edges: "rim" });
zone([51, 113, 62, 123], ids("equipment/"), "grid", 1);
patch("tiles/wooden-floor", 64, 114, 72, 121, {}, { edges: "rim" });
zone([64, 114, 72, 121], ["axe", "backpack", "bucket", "hammer", "hand-drill", "hoe", "jackhammer", "lantern",
  "pickaxe", "scythe", "seed-bag", "shovel", "sickle", "watering-can"].map((t) => "tools/" + t), "grid", 3);
zone([64, 102, 74, 112], ["buildings/market-stall", "buildings/coastal-trades", "objects/market-cart",
  "objects/cooking-pot", "objects/weather-workbench", "objects/banner"], "grid", 3);
// the plot for sale: a floating test patch and every island-building marker
patch("tiles/island-shadow", 76, 113, 81, 113);
patch("tiles/island-edge", 76, 108, 81, 112, {}, { edges: "rim" });
zone([75, 102, 92, 124], ["exploration/island-purchase-preview", "exploration/island-purchase-border",
  "exploration/island-construction", "exploration/island-expand", "exploration/island-emerge",
  "exploration/island-locked-overlay", "exploration/island-unlock-reveal", "exploration/plot-unlock",
  "exploration/map-marker", "exploration/waypoint", "exploration/resource-highlight", "exploration/resource-respawn",
  "exploration/treasure-reveal", "exploration/target-brackets", "exploration/island-explorer",
  "exploration/gather-swing", "exploration/ingot", "exploration/fog-of-war", "objects/quest-board"], "grid", 3);
// terrain swatches: every ground tile the islands did not already use, 2 x 2 each
const swatches = ["tiles/grass", "tiles/sand", "tiles/cliff", "tiles/cliff-corner", "tiles/cliff-inner-corner",
  "tiles/cliff-outer-corner", "tiles/island-inner-corner", "tiles/island-outer-corner", "tiles/deep-water",
  "tiles/shallow-water", "tiles/ocean-water", "tiles/ocean-wave", "tiles/sand-to-water", "tiles/pond",
  "tiles/pond-inner-corner", "tiles/pond-outer-corner", "tiles/river-corner", "tiles/river-junction",
  "tiles/stone-path", "tiles/dirt-path", "tiles/metal-bridge", "tiles/rope-bridge", "tiles/stone-bridge",
  "tiles/coastal-boardwalk", "tiles/bridge", "dungeons/rune-floor", "dungeons/collapsing-floor", "dungeons/wall-button",
  "exploration/island-shore", "exploration/coastal-shore"];
patch("tiles/stone-floor", 94, 103, 107, 123, {}, { edges: "rim" });
const SW = [];
swatches.forEach((id, i) => SW.push([id, 95 + (i % 4) * 3, 104 + Math.floor(i / 4) * 2.6]));

// links between islands
const bridges = [
  ["tiles/wooden-bridge", 25, 12, 26, 12, "east-west"], ["tiles/rope-bridge", 46, 10, 47, 10, "east-west"],
  ["tiles/stone-bridge", 85, 14, 86, 14, "east-west"], ["tiles/wooden-bridge", 12, 29, 12, 30, "north-south"],
  ["tiles/wooden-bridge", 27, 48, 28, 48, "east-west"], ["tiles/stone-bridge", 66, 31, 66, 30, "north-south"],
  ["tiles/metal-bridge", 71, 44, 72, 44, "east-west"], ["tiles/rope-bridge", 13, 65, 13, 67, "north-south"],
  ["tiles/wooden-bridge", 21, 82, 23, 82, "east-west"], ["tiles/wooden-bridge", 44, 83, 45, 83, "east-west"],
  ["tiles/rope-bridge", 64, 82, 65, 82, "east-west"], ["tiles/stone-bridge", 86, 82, 87, 82, "east-west"],
  ["tiles/wooden-bridge", 49, 67, 49, 68, "north-south"], ["tiles/metal-bridge", 92, 64, 92, 65, "north-south"],
  ["tiles/wooden-bridge", 33, 98, 33, 100, "north-south"], ["tiles/wooden-bridge", 54, 98, 54, 100, "north-south"],
  ["tiles/stone-bridge", 99, 98, 99, 100, "north-south"], ["tiles/rope-bridge", 11, 98, 11, 100, "north-south"],
];

// ---------------------------------------------------------------- effects, light and weather
// [anchor sprite, effect, dx, dy]: the effect plays over the first sprite of that id.
const moments = [
  // farm
  ["crops/carrot", "fx/crop-growth"], ["crops/tomatoes", "fx/harvest-sparkle"], ["crops/corn", "fx/fertilizer-sparkle"],
  ["crops/cotton", "fx/crop-wither"], ["player/harvesting", "fx/crop-harvest"], ["player/watering", "fx/watering-droplets", 10, 0],
  ["player/sowing", "fx/seed-pop", 8, 0], ["player/hoe-swing", "particles/soil-clod", 8, 0], ["animals/cow", "fx/animal-heart"],
  ["objects/feeding-trough", "fx/animal-feed"], ["animals/chicken", "fx/animal-product-drop"], ["animals/horse", "particles/heart"],
  ["buildings/farmhouse-upgrade", "fx/building-upgrade"], ["exploration/locked-plot", "fx/build-footprint"],
  ["player/walk", "fx/footsteps"], ["player/hoe-swing", "farming/hoe"], ["player/watering", "farming/water"],
  ["player/sowing", "farming/sow"], ["player/harvesting", "farming/harvest"], ["animals/penguin", "particles/snowflake"],
  ["trees/pine", "fx/woodcut-impact"], ["enemies/green-slime", "fx/experience-drop"], ["enemies/skeleton-knight", "combat/sword-spin", 20, 0],
  ["enemies/wolf", "combat/fireball-impact"], ["dungeons/arrow-trap", "combat/bow-shot"], ["dungeons/spike-trap", "combat/large-explosion"],
  ["dungeons/collapsing-floor", "combat/bomb-explosion"], ["enemies/goblin-warrior", "combat/shield-break"], ["player/idle", "fx/player-shadow"], ["buildings/windmill", "particles/dust"],
  // forest and quarry
  ["player/axe-swing", "fx/chopping-impact", 12, 0], ["trees/oak", "fx/tree-shake"], ["trees/maple", "fx/falling-leaf-burst"],
  ["trees/falling-tree", "fx/tree-fall-dust", 30, 0], ["trees/birch", "particles/leaf"], ["tiles/fallen-log", "particles/wood-chip"],
  ["tiles/wildflowers", "fx/wildflower-pick"], ["resources/fiber-bush", "fx/resource-hit"], ["objects/campfire", "particles/flame"],
  ["player/pickaxe-swing", "fx/mining-impact", 12, 0], ["resources/iron-ore", "fx/ore-break"], ["resources/copper-ore", "fx/ore-pick-impact"],
  ["resources/coastal-boulder", "fx/rock-break"], ["resources/limestone-deposit", "fx/stone-pick-impact"],
  ["resources/gold-ore", "fx/resource-crack"], ["resources/coal-ore", "fx/resource-break"], ["resources/salt-deposit", "fx/resource-spawn"],
  ["resources/tin-ore", "fx/resource-respawn"], ["player/hammer-swing", "particles/stone-chip", 10, 0], ["objects/minecart", "fx/dust"],
  ["player/building", "fx/construction-dust"], ["objects/workbench", "fx/blueprint-unlock"], ["player/crafting", "fx/crafting-start"],
  // factory
  ["machines/steam-generator", "fx/machine-steam"], ["machines/power-generator", "fx/power-pulse"], ["machines/battery-station", "fx/electric-spark"],
  ["machines/crusher", "fx/machine-overheat"], ["machines/assembly-machine", "fx/welding-sparks"], ["machines/loom", "fx/crafting-progress"],
  ["machines/sewing-station", "fx/crafting-complete"], ["machines/lumber-mill", "fx/machine-smoke"], ["machines/stone-cutter", "particles/metal-chip"],
  ["machines/robotic-arm", "particles/spark"], ["machines/smelter", "fx/smelting-sparks"], ["machines/forge", "particles/ember"],
  ["machines/charcoal-kiln", "fx/smoke"], ["machines/refinery", "particles/steam"], ["buildings/factory-building", "particles/smoke"],
  ["buildings/power-station", "fx/build-complete"],
  // crystal and magic
  ["resources/crystal-deposit", "fx/crystal-break"], ["resources/amethyst-deposit", "particles/crystal-shard"],
  ["exploration/magical-portal", "particles/magic-dust"], ["exploration/teleport-gate", "fx/portal-swirl"],
  ["player/teleport", "fx/teleport-in"], ["exploration/fast-travel-point", "fx/teleport-out"], ["biomes/crystal/glowing-flower", "particles/glowing-pixel"],
  ["objects/mist-beacon", "particles/light-ray"], ["machines/enchanting-table", "particles/magic-orb"], ["machines/alchemy-station", "particles/star"],
  // water
  ["exploration/fishing-spot", "fx/fishing-ripple"], ["player/fishing-wait", "fx/fishing-bite", 14, 0], ["player/fishing-catch", "fx/fishing-catch", 12, 0],
  ["player/swimming", "fx/swimming-splash"], ["animals/tuna", "fx/water-ripple"], ["animals/salmon", "fx/water-splash"],
  ["animals/pufferfish", "particles/water-bubble"], ["animals/jellyfish", "particles/water-drop"], ["animals/octopus", "particles/poison-drop"],
  // town and bazaar
  ["machines/coin-mint", "fx/coin-burst"], ["machines/bank", "fx/coin-collect"], ["buildings/bank-building", "particles/coin"],
  ["objects/donation-box", "fx/coin-drop"], ["objects/fountain", "fx/confetti"], ["objects/statue", "fx/achievement-unlock"],
  ["buildings/restaurant", "fx/recipe-unlock"], ["buildings/library", "fx/skill-unlock"], ["buildings/blacksmith", "fx/smoke"],
  ["items/special/coin", "fx/item-glow"], ["items/gems/diamond", "fx/legendary-item-drop"], ["items/gems/ruby", "fx/rare-item-drop"],
  ["items/raw/wood", "fx/item-bounce"], ["items/food/bread", "fx/item-drop"], ["items/produce/apple", "fx/item-pickup"],
  ["items/seeds/carrot-seed", "fx/item-collect"], ["items/processed/iron-ingot", "fx/item-magnet"], ["items/special/magic-orb", "fx/loot-flight"],
  ["items/consumables/health-potion", "fx/experience-drop"], ["items/components/gear", "fx/experience-collect"],
  ["exploration/island-construction", "fx/build-placement"], ["exploration/island-purchase-preview", "fx/build-preview"],
  ["buildings/coastal-trades", "fx/building-demolish"], ["objects/quest-board", "particles/experience-orb"],
  // the player's day
  ["player/drinking", "fx/heal"], ["player/eating", "fx/energy-restore"], ["player/level-up", "fx/level-up"],
  ["player/celebration", "fx/buff-activate"], ["player/hurt", "fx/buff-expire"], ["player/waking-up", "fx/hunger-warning"],
  ["player/sleeping", "fx/low-energy-warning"], ["player/dash", "fx/dash-trail"], ["player/sprint", "fx/speed-trail"],
  ["player/landing", "particles/shockwave-ring"], ["player/item-pickup", "fx/floating-text"],
  // combat
  ["player/sword-attack", "combat/sword-slash", 12, 0], ["player/sword-combo", "combat/sword-double-slash", 12, 0],
  ["player/heavy-attack", "combat/heavy-slash", 12, 0], ["player/spear-attack", "combat/spear-thrust", 14, 0],
  ["player/bow-shoot", "combat/bow-shot", 14, 0], ["player/bow-aim", "combat/arrow-projectile", 24, -8],
  ["player/magic-cast", "combat/magic-missile", 18, -6], ["player/shield-block", "combat/shield-block", 10, 0],
  ["player/stunned", "combat/stun-stars"], ["player/knockback", "combat/knockback"], ["player/respawn", "combat/invulnerability"],
  ["player/run", "combat/speed-aura"], ["enemies/dark-knight", "combat/strength-aura"], ["dungeons/healing-fountain", "combat/healing-aura"],
  ["dungeons/mana-fountain", "combat/regeneration-aura"], ["dungeons/boss-summoning-circle", "combat/magic-circle"],
  ["dungeons/falling-rock-trap", "combat/rock-projectile"], ["dungeons/fire-trap", "combat/burning"], ["dungeons/poison-trap", "combat/poison-cloud"],
  ["bosses/fire-dragon", "combat/fireball", 0, 20], ["enemies/demon", "combat/fireball-impact"], ["bosses/frost-dragon", "combat/ice-ball", 0, 20],
  ["bosses/ice-giant", "combat/ice-explosion", 30, 0], ["enemies/ice-elemental", "combat/ice-shard"], ["enemies/snow-wolf", "combat/frozen"],
  ["enemies/ice-golem", "combat/ice-arrow-impact"], ["enemies/lava-golem", "combat/fire-arrow-impact"], ["bosses/lava-titan", "combat/large-explosion", 30, 10],
  ["bosses/stone-titan", "combat/ground-slam", 0, 10], ["bosses/goblin-king", "combat/ground-crack", 0, 12], ["bosses/ancient-tree-guardian", "combat/shockwave"],
  ["enemies/lightning-elemental", "combat/chain-lightning"], ["bosses/dark-wizard", "combat/lightning-bolt", 30, 0], ["bosses/ancient-demon", "combat/magic-explosion", 30, 0],
  ["enemies/crystal-guardian", "combat/magic-shield"], ["bosses/slime-king", "combat/poison-hit"], ["bosses/giant-spider", "combat/ground-telegraph", 0, 16],
  ["bosses/skeleton-king", "combat/boss-warning"], ["bosses/sand-worm-queen", "combat/bomb-explosion", 30, 0], ["enemies/skeleton-knight", "combat/parry"],
  ["enemies/goblin-warrior", "combat/shield-break"], ["enemies/zombie", "combat/enemy-hit"], ["enemies/skeleton", "combat/enemy-death"],
  ["enemies/goblin", "combat/melee-hit"], ["enemies/skeleton-archer", "combat/ranged-hit"], ["enemies/mummy", "combat/damage-number"],
  ["enemies/scorpion", "combat/critical-number"], ["enemies/angry-boar", "combat/critical-hit"], ["enemies/corrupted-tree", "combat/axe-cleave"],
  ["enemies/goblin-archer", "combat/arrow-impact", 24, 0], ["enemies/poison-spider", "combat/poison-hit"], ["bosses/crystal-golem", "combat/ice-shard", 30, 0],
  ["bosses/desert-pharaoh", "particles/flame"], ["enemies/fire-elemental", "combat/burning"], ["enemies/stone-golem", "particles/stone-chip"],
];
// light: shadows go under the sprites, glows over them
const under = { "trees/": "lighting/tree-shadow", "buildings/": "lighting/building-shadow", "characters/": "lighting/character-shadow",
  "bosses/": "lighting/soft-shadow" };
const glows = { "objects/campfire": "lighting/campfire-light", "objects/street-lamp": "lighting/street-light",
  "objects/torch": "lighting/torch-light", "objects/lamp": "lighting/lantern-light", "objects/brazier": "lighting/light-flicker",
  "machines/blast-furnace": "lighting/furnace-light", "biomes/volcanic/lava-waterfall": "lighting/lava-light",
  "trees/crystal-tree": "lighting/crystal-light", "exploration/magical-portal": "lighting/magic-light",
  "objects/mist-beacon": "lighting/light-pulse", "dungeons/dungeon-torch": "lighting/point-light",
  "buildings/tavern": "lighting/window-light", "biomes/crystal/glowing-flower": "lighting/radial-light",
};
// ambient-light, cave-darkness and dungeon-darkness tint a whole screen; on one spot they leave a hard dark box

// ---------------------------------------------------------------- terrain
const water = ramp(SEA_COLORS);
const SIDES = [[0, -1, "N"], [1, 0, "E"], [0, 1, "S"], [-1, 0, "W"]], DIAG = ["NE", "SE", "SW", "NW"];
function rimOf(test, x, y) {
  const edges = SIDES.filter(([dx, dy]) => !test(x + dx, y + dy)).map((s) => s[2]).join("");
  const corners = SIDES.flatMap(([dx, dy, a], i) => {
    const [nx, ny, b] = SIDES[(i + 1) % 4];
    return !edges.includes(a) && !edges.includes(b) && !test(x + dx + nx, y + dy + ny) ? [DIAG[i]] : [];
  });
  return { edges, corners };
}

function paintSea(frame) {
  const { w, h, color } = frame, step = new Uint8Array(w * h);
  for (let i = 0; i < step.length; i++) step[i] = color[i] >>> 24 ? 0 : 35;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    if (x) step[i] = Math.min(step[i], step[i - 1] + 3);
    if (y) {
      step[i] = Math.min(step[i], step[i - w] + 3);
      if (x) step[i] = Math.min(step[i], step[i - w - 1] + 4);
      if (x < w - 1) step[i] = Math.min(step[i], step[i - w + 1] + 4);
    }
  }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
    const i = y * w + x;
    if (x < w - 1) step[i] = Math.min(step[i], step[i + 1] + 3);
    if (y < h - 1) {
      step[i] = Math.min(step[i], step[i + w] + 3);
      if (x) step[i] = Math.min(step[i], step[i + w - 1] + 4);
      if (x < w - 1) step[i] = Math.min(step[i], step[i + w + 1] + 4);
    }
    if (!step[i]) continue;
    const ripple = Math.sin(x * 0.19 + y * 0.15) * 2, depth = step[i] + ripple;
    color[i] = water[depth < 4 && (x + y * 2) % 19 < 8 ? 4 : depth < 11 + ripple ? 3 : depth < 24 ? 2 : 1];
  }
  const p = painterFor(frame);
  for (let i = 0; i < 1800; i++) {
    const wx = (i * 83) % w, wy = (i * 59 + Math.floor(i / 7) * 13) % h;
    if (land(Math.floor(wx / T), Math.floor(wy / T)) < 0 && land(Math.floor((wx + 6) / T), Math.floor(wy / T)) < 0)
      p.line(wx, wy, wx + 2 + (i % 5), wy, water[i % 8 === 0 ? 4 : 3], 0.66);
  }
}

async function tile(frame, id, x, y, o, px, py) {
  const m = await mod(id);
  paint(frame, m, stillTime(m, id, 0.3), px ?? tx(x), py ?? ty(y), { ...m.meta.options, tileX: x, tileY: y, seed: x * 7 + y * 13, ...o });
}

async function paintGround(frame) {
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
    const k = land(x, y);
    if (k < 0) continue;
    const isl = islands[k], rim = rimOf((a, b) => land(a, b) === k, x, y);
    if (rim.edges || rim.corners.length) await tile(frame, isl.shore, x, y, rim);
    else await tile(frame, isl.ground, x, y, { edges: "", corners: [] });
  }
  for (const pt of patches) {
    const [x0, y0, x1, y1] = pt.r, inside = (a, b) => a >= x0 && a <= x1 && b >= y0 && b <= y1;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      if (land(x, y) < 0) continue;
      let o = {};
      const links = SIDES.filter(([dx, dy]) => inside(x + dx, y + dy)).map((s) => s[2]).join("");
      if (pt.edges === "rim") o = rimOf(inside, x, y);
      else if (pt.edges === "links") o = { edges: links };
      else if (pt.edges === "joins") o = { joins: links };
      else if (pt.edges === "banks") { const r = rimOf(inside, x, y); o = { banks: r.edges, corners: r.corners }; }
      await tile(frame, pt.id, x, y, { ...pt.o, ...o });
      if (pt.block) blocked[y * MW + x] = 1;
    }
    used.add(pt.id);
  }
  for (const k of islands) used.add(k.ground), used.add(k.shore);
  // swatch board: 2 x 2 of each tile, with its name under it
  for (const [id, sx, sy] of SW) {
    if (!HAVE.has(id)) continue;
    const m = await mod(id), [w, h] = m.meta.size;
    const n = w > 16 ? 1 : 2; // a prop wider than a tile is shown once
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++)
      await tile(frame, id, 200 + i, 200 + j, { edges: "", corners: [] }, sx * T + (n === 1 ? 16 : 8 + i * w), sy * T + (n === 1 ? 26 : 12 + j * Math.min(h, 16)));
    for (let i = 0; i < 2 * T; i++) for (let j = 0; j < 2 * T; j++) blocked[Math.floor(sy + j / T) * MW + Math.floor(sx + i / T)] = 1;
    used.add(id);
  }
  paintSea(frame);
  for (const [id, x0, y0, x1, y1, facing] of bridges) {
    for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++)
      await tile(frame, id, x, y, { facing });
    used.add(id);
  }
}

// ---------------------------------------------------------------- placement
const boxes = [], placed = [], missed = [];
const hit = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

async function placeZone(z) {
  const [c0, r0, c1, r1] = z.rect, X0 = c0 * T, Y0 = r0 * T, X1 = (c1 + 1) * T, Y1 = (r1 + 1) * T;
  const list = z.entries.flatMap((e) => {
    const [id, o = {}, n = 1, at] = Array.isArray(e) ? e : [e];
    return Array.from({ length: n }, (_, i) => ({ id, o, at, i }));
  });
  const mine = [];
  for (const it of list) {
    if (!HAVE.has(it.id)) { missed.push(it.id + " (no such asset)"); continue; }
    const m = await mod(it.id), o = stillOptions(m, it.id, it.o), t = stillTime(m, it.id + it.i, it.at);
    if (z.mode === "sea" && o.facing === "down") o.facing = it.i % 2 ? "left" : "right";
    if (it.id.startsWith("animals/") && z.mode === "scatter" && o.facing === "down" && rnd() < 0.5) o.facing = rnd() < 0.5 ? "left" : "right";
    const key = it.id + JSON.stringify(o) + t, b = await boundsOf(key, it.id, o, t);
    if (!b) { missed.push(it.id + " (draws nothing as a still)"); continue; }
    const g = z.gap, bw = b.x1 - b.x0, bh = b.y1 - b.y0;
    const fits = (px, py) => {
      if (px + b.x0 < X0 || px + b.x1 > X1 || py + b.y0 < Y0 || py + b.y1 > Y1) return null;
      // the footing must be on the right kind of ground
      for (const fx of [px + b.x0 + 1, px, px + b.x1 - 2]) {
        const c = Math.floor(fx / T);
        for (const fy of [py + b.y1 - 2, py + b.y1 - Math.min(8, bh)]) {
          const r = Math.floor(fy / T), k = land(c, r);
          const ok = z.mode === "sea" ? (k < 0 || blocked[r * MW + c]) : k >= 0 && !blocked[r * MW + c];
          if (!ok) return null;
        }
      }
      const box = { x0: px + b.x0 - g, y0: py + b.y0 - g, x1: px + b.x1 + g, y1: py + b.y1 + g };
      return boxes.some((o) => hit(o, box)) ? null : box;
    };
    let spot = null;
    if (z.mode === "grid") {
      outer: for (let py = Y0 - b.y0; py + b.y1 <= Y1; py += 2) for (let px = X0 - b.x0; px + b.x1 <= X1; px += 2) {
        const box = fits(px, py);
        if (box) { spot = [px, py, box]; break outer; }
      }
    } else {
      for (let k = 0; k < 5000 && !spot; k++) {
        const px = Math.round(X0 - b.x0 + rnd() * Math.max(0, X1 - X0 - bw)), py = Math.round(Y0 - b.y0 + rnd() * Math.max(0, Y1 - Y0 - bh));
        const box = fits(px, py);
        if (box) spot = [px, py, box];
      }
    }
    if (!spot) { missed.push(`${it.id} (no room in ${z.rect.join(",")})`); continue; }
    boxes.push(spot[2]);
    const e = { id: it.id, m, o, t, x: spot[0], y: spot[1], b, box: spot[2] };
    placed.push(e);
    mine.push(e);
    used.add(it.id);
  }
  // a packed grid sits in the middle of its zone, not against the top-left corner
  if (z.mode === "grid" && mine.length) {
    const ux0 = Math.min(...mine.map((e) => e.box.x0)), ux1 = Math.max(...mine.map((e) => e.box.x1));
    const uy0 = Math.min(...mine.map((e) => e.box.y0)), uy1 = Math.max(...mine.map((e) => e.box.y1));
    let dx = Math.floor((X1 - ux1 - (ux0 - X0)) / 2), dy = Math.floor((Y1 - uy1 - (uy0 - Y0)) / 2);
    const others = boxes.filter((bx) => !mine.some((e) => e.box === bx));
    const clear = (ddx, ddy) => mine.every((e) => {
      const nb = { x0: e.box.x0 + ddx, y0: e.box.y0 + ddy, x1: e.box.x1 + ddx, y1: e.box.y1 + ddy };
      const r = Math.floor((e.y + ddy + e.b.y1 - 2) / T), c = Math.floor((e.x + ddx) / T);
      return land(c, r) >= 0 && !blocked[r * MW + c] && !others.some((o) => hit(o, nb));
    });
    while ((dx || dy) && !clear(dx, dy)) { dx = Math.trunc(dx / 2); dy = Math.trunc(dy / 2); }
    for (const e of mine) {
      e.x += dx; e.y += dy;
      for (const k of ["x0", "x1"]) e.box[k] += dx;
      for (const k of ["y0", "y1"]) e.box[k] += dy;
    }
  }
}

// ---------------------------------------------------------------- render
const frame = createFrame(W, H);
await paintGround(frame);
for (const z of zones) await placeZone(z);
placed.sort((a, b) => a.y - b.y || a.x - b.x);

async function overlay(id, x, y, extra = {}) {
  if (!HAVE.has(id)) return false;
  const m = await mod(id);
  if (m.meta.size[0] >= 300) return false; // full-screen effects do not belong on a map
  try {
    // light reads as a soft pool, not a bloom over the pixel art
    paint(frame, m, stillTime(m, id), x, y, stillOptions(m, id, { actor: stockActor(), ...extra }), id.startsWith("lighting/") ? 0.65 : 1);
  } catch (err) {
    missed.push(`${id} (overlay failed: ${err.message})`);
    return false;
  }
  used.add(id);
  return true;
}

for (const e of placed) {
  const shadow = Object.entries(under).find(([pre]) => e.id.startsWith(pre))?.[1];
  if (shadow && !/falling|regrowth|sapling/.test(e.id)) await overlay(shadow, e.x, e.y);
}
for (const e of placed) paint(frame, e.m, e.t, e.x, e.y, e.o);
for (const e of placed) if (glows[e.id]) await overlay(glows[e.id], e.x, e.y - 4);
for (const [anchor, fx, dx = 0, dy = 0] of moments) {
  const e = placed.find((p) => p.id === anchor);
  if (e) await overlay(fx, e.x + dx, e.y + dy);
}
// mood bubbles over the cast
const people = placed.filter((e) => e.id.startsWith("characters/"));
for (const [i, id] of ids("emotes/").entries()) {
  const who = people[i % people.length];
  if (who) await overlay(id, who.x + (i >= people.length ? 12 : 0), who.y + who.b.y0 + 2);
}
// one patch of weather over the middle of each island
if (WEATHER) for (const isl of islands) for (const id of isl.weather) {
  if (!HAVE.has(id)) continue;
  const m = await mod(id), [w, h] = m.meta.size, [ox, oy] = m.meta.origin, [x0, y0, x1, y1] = isl.rect;
  const x = Math.round(((x0 + x1 + 1) * T - w) / 2), y = Math.round(((y0 + y1 + 1) * T - h) / 2);
  paint(frame, m, stillTime(m, id), x + ox, y + oy, stillOptions(m, id), 0.9);
  used.add(id);
}

const rgba = composite(frame, new Uint8ClampedArray(W * H * 4), null);

if (LABELS) {
  const plain = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toUpperCase();
  for (const isl of islands) {
    const s = plain(isl.name), [x0, y0, x1] = isl.rect, tw = s.length * 6 + 6;
    const px = Math.round(((x0 + x1 + 1) * T - tw) / 2), py = y0 * T + 6;
    for (let y = py - 3; y < py + 9; y++) for (let x = px - 3; x < px + tw; x++) rgba.set([24, 28, 38, 255], (y * W + x) * 4);
    rasterText(s, "mini", (x, y) => rgba.set([255, 244, 214, 255], ((py + y) * W + px + x) * 4));
  }
}

save(OUT + ".png", encodePNG(W, H, rgba));
if (SCALE > 1) save(`${OUT}@${SCALE}x.png`, encodePNG(W * SCALE, H * SCALE, upscale(rgba, W, H, SCALE)));

// ---------------------------------------------------------------- report
const left = ALL.filter((id) => !used.has(id));
const byCat = {};
for (const id of left) (byCat[id.split("/")[0]] ??= []).push(id.split("/").slice(1).join("/"));
writeFileSync(OUT + ".json", JSON.stringify({ size: [W, H], islands: islands.map((i) => ({ name: i.name, rect: i.rect })),
  placed: placed.map(({ id, x, y }) => ({ id, x, y })), missed, unused: byCat }, null, 1));
console.log(`map ${W}x${H}  placed ${placed.length} sprites  ${used.size}/${ALL.length} assets used`);
if (missed.length) console.log("missed:\n  " + missed.join("\n  "));
console.log("left out:\n  " + Object.entries(byCat).map(([k, v]) => `${k} (${v.length})`).join(", "));

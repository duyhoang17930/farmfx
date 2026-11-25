import * as pine from "../../src/fx/trees/wind-pine.js";
import * as stone from "../../src/fx/resources/coastal-boulder.js";
import * as ore from "../../src/fx/resources/coastal-iron-seam.js";
import * as flowers from "../../src/fx/tiles/wildflowers.js";
import * as forge from "../../src/fx/machines/coastal-kiln.js";
import * as workbench from "../../src/fx/objects/weather-workbench.js";
import * as bridge from "../../src/fx/tiles/wooden-bridge.js";
import * as beacon from "../../src/fx/objects/mist-beacon.js";
import * as dock from "../../src/fx/exploration/boat-dock.js";
import * as guardian from "../../src/fx/enemies/crystal-guardian.js";
import * as wood from "../../src/fx/items/raw/wood.js";
import * as rock from "../../src/fx/items/raw/stone.js";
import * as ironOre from "../../src/fx/items/raw/iron-ore.js";
import * as ingot from "../../src/fx/items/processed/iron-ingot.js";
import * as coin from "../../src/fx/items/special/coin.js";
import * as pearl from "../../src/fx/items/gems/quartz.js";
import * as core from "../../src/fx/items/special/magic-orb.js";
import * as idle from "../../src/fx/player/idle.js";
import * as walk from "../../src/fx/player/walk.js";
import * as axe from "../../src/fx/player/axe-swing.js";
import * as pick from "../../src/fx/player/pickaxe-swing.js";
import * as sword from "../../src/fx/player/sword-attack.js";
import * as dash from "../../src/fx/player/dash.js";
import * as building from "../../src/fx/player/building.js";
import * as hurt from "../../src/fx/player/hurt.js";

export const objects = { pine, stone, ore, flowers, forge, workbench, bridge, beacon, dock, guardian };
export const clips = { idle, walk, axe, pick, sword, dash, building, hurt };
export const items = {
  wood: { name: "Gỗ thông", module: wood, icon: "wood" },
  stone: { name: "Đá", module: rock, icon: "stone" },
  ore: { name: "Quặng sắt", module: ironOre, icon: "iron-ore" },
  ingot: { name: "Thỏi sắt", module: ingot, icon: "iron-ingot" },
  coin: { name: "Tín phiếu", module: coin, icon: "coin" },
  pearl: { name: "Ngọc sương", module: pearl, icon: "quartz" },
  core: { name: "Lõi phong vũ", module: core, icon: "magic-orb" },
};

export const blueprints = {
  forge: { name: "Lò luyện", cost: { wood: 3, stone: 2 }, width: 2, height: 1, detail: "Luyện quặng thành thỏi sắt." },
  workbench: { name: "Bàn chế tạo", cost: { wood: 3 }, width: 2, height: 1, detail: "Lắp lõi từ sắt và ngọc sương." },
  bridge: { name: "Nhịp cầu", cost: { wood: 2 }, width: 1, height: 1, detail: "Đặt ở hai ô nước được đánh dấu." },
};

export const recipes = {
  smelt: { name: "Luyện 1 thỏi sắt", cost: { ore: 1 }, station: "forge", time: 2100, output: "ingot" },
  core: { name: "Lắp lõi phong vũ", cost: { ingot: 2, pearl: 1 }, station: "workbench", time: 1500, output: "core" },
};

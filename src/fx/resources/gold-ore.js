import { ore } from "../_kit/resource-stone.js";
import { GOLD } from "../_kit/art.js";

export const { meta, draw } = ore("Gold ore", "Two dark crags with a wide, bright seam of exposed gold.",
  GOLD, "twin", [[-6,-8,4,4],[0,-5,4,3],[6,-8,3,3],[5,-2,2,2]]);

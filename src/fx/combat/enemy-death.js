import * as recipe from "../_kit/pixel-recipes/spawn/disintegrate.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("enemy-death", recipe.meta), name: "enemy death",
  tags: [...recipe.meta.tags, "combat", "enemy-death"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

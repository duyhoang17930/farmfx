import * as recipe from "../_kit/pixel-recipes/melee/spin-slash.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("sword-spin", recipe.meta), name: "sword spin",
  tags: [...recipe.meta.tags, "combat", "sword-spin"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

import * as recipe from "../_kit/pixel-recipes/melee/double-slash.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("sword-double-slash", recipe.meta), name: "sword double slash",
  tags: [...recipe.meta.tags, "combat", "sword-double-slash"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

import * as recipe from "../_kit/pixel-recipes/melee/sword-slash.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("sword-slash", recipe.meta), name: "sword slash",
  tags: [...recipe.meta.tags, "combat", "sword-slash"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

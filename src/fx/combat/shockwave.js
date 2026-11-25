import * as recipe from "../_kit/pixel-recipes/nature/quake.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("shockwave", recipe.meta), name: "shockwave",
  tags: [...recipe.meta.tags, "combat", "shockwave"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

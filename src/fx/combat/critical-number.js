import * as recipe from "../_kit/pixel-recipes/ui/crit-number.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("critical-number", recipe.meta), name: "critical number",
  tags: [...recipe.meta.tags, "combat", "critical-number"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

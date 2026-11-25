import * as recipe from "../_kit/pixel-recipes/impacts/crit-hit.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("critical-hit", recipe.meta), name: "critical hit",
  tags: [...recipe.meta.tags, "combat", "critical-hit"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

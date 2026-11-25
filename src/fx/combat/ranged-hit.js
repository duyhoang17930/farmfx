import * as recipe from "../_kit/pixel-recipes/impacts/ricochet.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("ranged-hit", recipe.meta), name: "ranged hit",
  tags: [...recipe.meta.tags, "combat", "ranged-hit"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

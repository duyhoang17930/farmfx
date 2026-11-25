import * as recipe from "../_kit/pixel-recipes/nature/acid-splash.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("poison-hit", recipe.meta), name: "poison hit",
  tags: [...recipe.meta.tags, "combat", "poison-hit"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

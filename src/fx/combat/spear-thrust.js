import * as recipe from "../_kit/pixel-recipes/melee/thrust.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("spear-thrust", recipe.meta), name: "spear thrust",
  tags: [...recipe.meta.tags, "combat", "spear-thrust"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

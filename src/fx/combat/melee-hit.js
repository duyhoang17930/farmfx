import * as recipe from "../_kit/pixel-recipes/impacts/blunt-hit.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("melee-hit", recipe.meta), name: "melee hit",
  tags: [...recipe.meta.tags, "combat", "melee-hit"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

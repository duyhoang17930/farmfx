import * as recipe from "../_kit/pixel-recipes/impacts/parry.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("parry", recipe.meta), name: "parry",
  tags: [...recipe.meta.tags, "combat", "parry"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

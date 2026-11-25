import * as recipe from "../_kit/pixel-recipes/impacts/shield-block.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("shield-block", recipe.meta), name: "shield block",
  tags: [...recipe.meta.tags, "combat", "shield-block"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

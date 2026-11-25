import * as recipe from "../_kit/pixel-recipes/impacts/heavy-landing.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("knockback", recipe.meta), name: "knockback",
  tags: [...recipe.meta.tags, "combat", "knockback"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

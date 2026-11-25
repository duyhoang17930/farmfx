import * as recipe from "../_kit/pixel-recipes/spawn/shatter-death.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("shield-break", recipe.meta), name: "shield break",
  tags: [...recipe.meta.tags, "combat", "shield-break"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

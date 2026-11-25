import * as recipe from "../_kit/pixel-recipes/explosions/big-explosion.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("large-explosion", recipe.meta), name: "large explosion",
  tags: [...recipe.meta.tags, "combat", "large-explosion"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

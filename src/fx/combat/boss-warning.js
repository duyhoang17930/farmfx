import * as recipe from "../_kit/pixel-recipes/ui/exclamation.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("boss-warning", recipe.meta), name: "boss warning",
  tags: [...recipe.meta.tags, "combat", "boss-warning"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

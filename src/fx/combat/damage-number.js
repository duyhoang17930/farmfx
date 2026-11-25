import * as recipe from "../_kit/pixel-recipes/ui/damage-number.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("damage-number", recipe.meta), name: "damage number",
  tags: [...recipe.meta.tags, "combat", "damage-number"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

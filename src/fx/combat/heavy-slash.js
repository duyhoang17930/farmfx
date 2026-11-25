import * as recipe from "../_kit/pixel-recipes/melee/heavy-cleave.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("heavy-slash", recipe.meta), name: "heavy slash",
  tags: [...recipe.meta.tags, "combat", "heavy-slash"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

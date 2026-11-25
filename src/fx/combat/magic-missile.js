import * as recipe from "../_kit/pixel-recipes/projectiles/magic-missile.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("magic-missile", recipe.meta), name: "magic missile",
  tags: [...recipe.meta.tags, "combat", "magic-missile"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

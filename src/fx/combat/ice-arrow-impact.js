import * as recipe from "../_kit/pixel-recipes/ice/ice-shatter.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("ice-arrow-impact", recipe.meta), name: "ice arrow impact",
  tags: [...recipe.meta.tags, "combat", "ice-arrow-impact"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

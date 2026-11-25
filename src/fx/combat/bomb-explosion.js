import * as recipe from "../_kit/pixel-recipes/explosions/barrel-explosion.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("bomb-explosion", recipe.meta), name: "bomb explosion",
  tags: [...recipe.meta.tags, "combat", "bomb-explosion"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

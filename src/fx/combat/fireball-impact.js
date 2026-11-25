import * as recipe from "../_kit/pixel-recipes/explosions/small-explosion.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("fireball-impact", recipe.meta), name: "fireball impact",
  tags: [...recipe.meta.tags, "combat", "fireball-impact"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

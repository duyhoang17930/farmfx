import * as recipe from "../_kit/pixel-recipes/impacts/hit-flash.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("enemy-hit", recipe.meta), name: "enemy hit",
  tags: [...recipe.meta.tags, "combat", "enemy-hit"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

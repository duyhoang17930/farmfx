import * as recipe from "../_kit/pixel-recipes/nature/healing-bloom.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("regeneration-aura", recipe.meta), name: "regeneration aura",
  tags: [...recipe.meta.tags, "combat", "regeneration-aura"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

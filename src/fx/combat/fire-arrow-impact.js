import * as recipe from "../_kit/pixel-recipes/fire/fire-ring.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("fire-arrow-impact", recipe.meta), name: "fire arrow impact",
  tags: [...recipe.meta.tags, "combat", "fire-arrow-impact"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

import * as recipe from "../_kit/pixel-recipes/moves/arrow-shot.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("bow-shot", recipe.meta), name: "bow shot",
  tags: [...recipe.meta.tags, "combat", "bow-shot"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

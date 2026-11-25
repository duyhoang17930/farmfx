import * as recipe from "../_kit/pixel-recipes/nature/earth-spike.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("ground-crack", recipe.meta), name: "ground crack",
  tags: [...recipe.meta.tags, "combat", "ground-crack"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

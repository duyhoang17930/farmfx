import * as recipe from "../_kit/pixel-recipes/impacts/hit-spark.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("arrow-impact", recipe.meta), name: "arrow impact",
  tags: [...recipe.meta.tags, "combat", "arrow-impact"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

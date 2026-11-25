import * as recipe from "../_kit/pixel-recipes/ui/crit-number.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "critical number",
  tags: [...recipe.meta.tags, "combat", "critical-number"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

import * as recipe from "../_kit/pixel-recipes/ui/damage-number.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "damage number",
  tags: [...recipe.meta.tags, "combat", "damage-number"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

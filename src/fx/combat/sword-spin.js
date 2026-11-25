import * as recipe from "../_kit/pixel-recipes/melee/spin-slash.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "sword spin",
  tags: [...recipe.meta.tags, "combat", "sword-spin"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

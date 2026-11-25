import * as recipe from "../_kit/pixel-recipes/melee/double-slash.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "sword double slash",
  tags: [...recipe.meta.tags, "combat", "sword-double-slash"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

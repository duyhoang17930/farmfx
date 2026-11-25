import * as recipe from "../_kit/pixel-recipes/melee/sword-slash.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "sword slash",
  tags: [...recipe.meta.tags, "combat", "sword-slash"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

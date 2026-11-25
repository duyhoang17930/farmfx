import * as recipe from "../_kit/pixel-recipes/nature/boulder.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "rock projectile",
  tags: [...recipe.meta.tags, "combat", "rock-projectile"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

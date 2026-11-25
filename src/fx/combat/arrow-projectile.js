import * as recipe from "../_kit/pixel-recipes/projectiles/arrow.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "arrow projectile",
  tags: [...recipe.meta.tags, "combat", "arrow-projectile"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

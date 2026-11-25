import * as recipe from "../_kit/pixel-recipes/nature/acid-splash.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "poison hit",
  tags: [...recipe.meta.tags, "combat", "poison-hit"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

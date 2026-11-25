import * as recipe from "../_kit/pixel-recipes/ice/ice-shatter.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "ice arrow impact",
  tags: [...recipe.meta.tags, "combat", "ice-arrow-impact"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

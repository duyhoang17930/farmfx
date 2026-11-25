import * as recipe from "../_kit/pixel-recipes/impacts/ricochet.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "ranged hit",
  tags: [...recipe.meta.tags, "combat", "ranged-hit"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

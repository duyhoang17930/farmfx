import * as recipe from "../_kit/pixel-recipes/status/burning.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "burning",
  tags: [...recipe.meta.tags, "combat", "burning"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

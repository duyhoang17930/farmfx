import * as recipe from "../_kit/pixel-recipes/nature/poison-cloud.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "poison cloud",
  tags: [...recipe.meta.tags, "combat", "poison-cloud"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

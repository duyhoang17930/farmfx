import * as recipe from "../_kit/pixel-recipes/impacts/shield-block.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "shield block",
  tags: [...recipe.meta.tags, "combat", "shield-block"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

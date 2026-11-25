import * as recipe from "../_kit/pixel-recipes/ice/ice-lance.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "ice shard",
  tags: [...recipe.meta.tags, "combat", "ice-shard"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

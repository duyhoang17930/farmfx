import * as recipe from "../_kit/pixel-recipes/impacts/hit-spark.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "arrow impact",
  tags: [...recipe.meta.tags, "combat", "arrow-impact"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

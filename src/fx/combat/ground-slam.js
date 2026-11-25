import * as recipe from "../_kit/pixel-recipes/impacts/ground-slam.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "ground slam",
  tags: [...recipe.meta.tags, "combat", "ground-slam"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

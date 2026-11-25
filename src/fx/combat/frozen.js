import * as recipe from "../_kit/pixel-recipes/status/frozen.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "frozen",
  tags: [...recipe.meta.tags, "combat", "frozen"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

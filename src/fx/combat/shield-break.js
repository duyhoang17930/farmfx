import * as recipe from "../_kit/pixel-recipes/spawn/shatter-death.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "shield break",
  tags: [...recipe.meta.tags, "combat", "shield-break"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

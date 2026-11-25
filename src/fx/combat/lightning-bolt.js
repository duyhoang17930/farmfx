import * as recipe from "../_kit/pixel-recipes/lightning/lightning-strike.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "lightning bolt",
  tags: [...recipe.meta.tags, "combat", "lightning-bolt"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

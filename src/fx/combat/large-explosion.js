import * as recipe from "../_kit/pixel-recipes/explosions/big-explosion.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "large explosion",
  tags: [...recipe.meta.tags, "combat", "large-explosion"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;

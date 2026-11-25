import * as recipe from "../_kit/pixel-recipes/ice/frost-nova.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "ice explosion",
  tags: [...recipe.meta.tags, "combat", "ice-explosion"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
